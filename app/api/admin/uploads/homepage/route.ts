import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";

export const runtime = "nodejs";

const maxBytes = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  const guard = await requireAdminApi({ resource: "pages", action: "update" });
  if (!guard.ok) return guard.response;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Upload an image file." }, { status: 400 });
  }

  const extension = allowedTypes.get(file.type);
  if (!extension) {
    return NextResponse.json({ ok: false, message: "Use a JPG, PNG, or WebP image." }, { status: 400 });
  }

  if (file.size > maxBytes) {
    return NextResponse.json({ ok: false, message: "Image must be 5MB or smaller." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads", "homepage");
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  return NextResponse.json({ ok: true, url: `/uploads/homepage/${filename}` });
}
