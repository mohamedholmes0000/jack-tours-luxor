import Link from "next/link";
import { DatabaseNotice } from "@/components/admin/database-notice";
import { BlogPostForm } from "@/components/admin/simple-cms-forms";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";

export const metadata = { title: "New Blog Post" };

export default function NewBlogPage() {
  const hasDb = hasConfiguredDatabase();

  return (
    <div>
      <Link className="text-sm font-bold text-[var(--color-gold)]" href="/admin/blog">
        Back to blog
      </Link>
      <h1 className="my-6 font-serif text-5xl font-semibold text-[var(--color-navy)]">
        Add blog post
      </h1>
      {!hasDb ? <DatabaseNotice /> : null}
      <BlogPostForm mode="create" />
    </div>
  );
}
