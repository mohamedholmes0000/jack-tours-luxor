import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminBlogPostSchema } from "@/lib/validations";

type Props = { params: Promise<{ id: string }> };

async function findId(id: string) {
  return (await prisma.blogPost.findFirst({ where: { OR: [{ id }, { slug: id }] }, select: { id: true } }))?.id;
}

export async function PUT(request: Request, { params }: Props) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  const parsed = adminBlogPostSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid blog post." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Blog post was not saved." }, { status: 503 });
  const { id } = await params;
  const postId = await findId(id);
  if (!postId) return NextResponse.json({ ok: false, message: "Blog post not found." }, { status: 404 });
  await prisma.blogPost.update({ where: { id: postId }, data: { ...parsed.data, heroImage: parsed.data.heroImage || null, metaTitle: parsed.data.metaTitle || null, metaDescription: parsed.data.metaDescription || null } });
  return NextResponse.json({ ok: true, id: postId });
}

export async function DELETE(_request: Request, { params }: Props) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Blog post was not deleted." }, { status: 503 });
  const { id } = await params;
  const postId = await findId(id);
  if (!postId) return NextResponse.json({ ok: false, message: "Blog post not found." }, { status: 404 });
  await prisma.blogPost.delete({ where: { id: postId } });
  return NextResponse.json({ ok: true });
}
