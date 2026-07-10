import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { uploadAdminImage } from "@/lib/admin-upload";
import { hasCloudinaryConfig } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const guard = await requireAdminApi({ resource: "pages", action: "update" });
  if (!guard.ok) return guard.response;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Upload an image file." }, { status: 400 });
  }

  try {
    if (process.env.VERCEL && !hasCloudinaryConfig()) {
      return NextResponse.json(
        {
          ok: false,
          message: "Cloudinary is required for image uploads on Vercel. Local /uploads paths are only safe in local development.",
        },
        { status: 500 },
      );
    }

    const uploaded = await uploadAdminImage(file, "homepage");
    return NextResponse.json({ ok: true, ...uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload image.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
