import Link from "next/link";
import { notFound } from "next/navigation";
import { DatabaseNotice } from "@/components/admin/database-notice";
import { BlogPostForm } from "@/components/admin/simple-cms-forms";
import { getAdminBlogPost } from "@/lib/data/admin";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";

type Props = { params: Promise<{ id: string }> };
export const metadata = { title: "Edit Blog Post" };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const post = await getAdminBlogPost(id);
  const hasDb = hasConfiguredDatabase();

  if (!post) notFound();

  return (
    <div>
      <Link className="text-sm font-bold text-[var(--color-gold)]" href="/admin/blog">
        Back to blog
      </Link>
      <h1 className="my-6 font-serif text-5xl font-semibold text-[var(--color-navy)]">
        Edit blog post
      </h1>
      {!hasDb ? <DatabaseNotice /> : null}
      <BlogPostForm mode="edit" id={id} initialValues={post} />
    </div>
  );
}
