import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { uploadAdminImage } from "@/lib/admin-upload";

export const runtime = "nodejs";

function safeFolderSlug(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "gallery";
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `gallery/${slug}` : "gallery";
}

export async function POST(request: Request) {
  const guard = await requireAdminApi({ resource: "gallery", action: "create" });
  if (!guard.ok) return guard.response;

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ ok: false, message: "Upload an image file." }, { status: 400 });
  }

  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Upload an image file." }, { status: 400 });
  }

  try {
    const uploaded = await uploadAdminImage(file, safeFolderSlug(formData.get("albumSlug")));
    return NextResponse.json({ ok: true, ...uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload image.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
