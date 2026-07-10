import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminBlogPostSchema } from "@/lib/validations";

type Props = { params: Promise<{ id: string }> };

async function findId(id: string) {
  return prisma.blogPost.findFirst({ where: { OR: [{ id }, { slug: id }] }, select: { id: true, slug: true } });
}

function revalidateBlogPublicPaths(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

export async function PUT(request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "blog", action: "update" });
  if (!guard.ok) return guard.response;
  const parsed = adminBlogPostSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid blog post." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Blog post was not saved." }, { status: 503 });
  const { id } = await params;
  const existingPost = await findId(id);
  if (!existingPost) return NextResponse.json({ ok: false, message: "Blog post not found." }, { status: 404 });
  const updatedPost = await prisma.blogPost.update({
    where: { id: existingPost.id },
    data: { ...parsed.data, heroImage: parsed.data.heroImage || null, metaTitle: parsed.data.metaTitle || null, metaDescription: parsed.data.metaDescription || null },
    select: { id: true, slug: true },
  });
  revalidateBlogPublicPaths(existingPost.slug);
  revalidateBlogPublicPaths(updatedPost.slug);
  return NextResponse.json({ ok: true, id: updatedPost.id });
}

export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "blog", action: "delete" });
  if (!guard.ok) return guard.response;
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Blog post was not deleted." }, { status: 503 });
  const { id } = await params;
  const existingPost = await findId(id);
  if (!existingPost) return NextResponse.json({ ok: false, message: "Blog post not found." }, { status: 404 });
  await prisma.blogPost.delete({ where: { id: existingPost.id } });
  revalidateBlogPublicPaths(existingPost.slug);
  return NextResponse.json({ ok: true });
}
