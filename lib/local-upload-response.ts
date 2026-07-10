import { readFile } from "fs/promises";
import path from "path";

const allowedUploadFolders = new Set(["gallery", "homepage"]);
const contentTypes = new Map([
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
]);

function isSafeUploadSegment(value: string) {
  return /^[a-zA-Z0-9._-]+$/.test(value) && !value.includes("..");
}

export async function localUploadResponse(folder: string, filename: string) {
  if (!allowedUploadFolders.has(folder) || !isSafeUploadSegment(folder) || !isSafeUploadSegment(filename)) {
    return new Response("Not found", { status: 404 });
  }

  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const contentType = contentTypes.get(extension);

  if (!contentType) {
    return new Response("Not found", { status: 404 });
  }

  const uploadRoot = path.join(process.cwd(), "public", "uploads", folder);
  const filePath = path.resolve(uploadRoot, filename);

  if (!filePath.startsWith(path.resolve(uploadRoot) + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    return new Response(new Uint8Array(file), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Length": String(file.byteLength),
        "Content-Type": contentType,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
