import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminBlogPostSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const guard = await requireAdminApi({ resource: "blog", action: "create" });
  if (!guard.ok) return guard.response;
  const parsed = adminBlogPostSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid blog post." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Blog post was not saved." }, { status: 503 });
  const post = await prisma.blogPost.create({ data: { ...parsed.data, heroImage: parsed.data.heroImage || null, metaTitle: parsed.data.metaTitle || null, metaDescription: parsed.data.metaDescription || null } });
  return NextResponse.json({ ok: true, id: post.id });
}
