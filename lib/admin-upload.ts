import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { hasCloudinaryConfig, uploadToCloudinary } from "@/lib/cloudinary";

const maxBytes = 5 * 1024 * 1024;

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export type AdminUploadResult = {
  publicId?: string;
  storage: "cloudinary" | "local";
  url: string;
};

export function validateAdminImageFile(file: File) {
  const extension = allowedTypes.get(file.type);
  if (!extension) {
    return { error: "Use a JPG, PNG, or WebP image." };
  }

  if (file.size > maxBytes) {
    return { error: "Image must be 5MB or smaller." };
  }

  return { extension };
}

export async function uploadAdminImage(file: File, folder: string): Promise<AdminUploadResult> {
  const validation = validateAdminImageFile(file);
  if ("error" in validation) {
    throw new Error(validation.error);
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  if (hasCloudinaryConfig()) {
    const uploaded = await uploadToCloudinary(bytes, folder);
    return { ...uploaded, storage: "cloudinary" };
  }

  const filename = `${Date.now()}-${randomUUID()}.${validation.extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  return {
    storage: "local",
    url: `/api/uploads/${folder}/${filename}`,
  };
}
