import Link from "next/link";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminBlogPosts } from "@/lib/data/admin";

export const metadata = { title: "Admin Blog" };

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();
  const currentUser = await getCurrentAdminUser();
  const canWriteBlog = canWriteAdminResource(currentUser?.role || "VIEWER", "blog", "update");
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">Blog</p><h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">Blog posts</h1></div>
        {canWriteAdminResource(currentUser?.role || "VIEWER", "blog", "create") ? <Link className="btn-primary" href="/admin/blog/new">Add Blog Post</Link> : null}
      </div>
      <section className="mt-8 overflow-x-auto border border-[var(--color-gray-100)] bg-white p-4">
        <table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b text-xs uppercase tracking-[0.14em] text-[var(--color-gray-600)]"><th className="py-3 pr-4">Title</th><th>Category</th><th>Published</th><th>Updated</th><th>Actions</th></tr></thead><tbody>
          {posts.map((post) => <tr key={post.id} className="border-b border-[var(--color-gray-100)]"><td className="py-4 pr-4 font-semibold text-[var(--color-navy)]">{post.title}</td><td>{post.category}</td><td>{post.published ? "Yes" : "No"}</td><td>{post.updatedAt.toLocaleDateString("en-US")}</td><td>{canWriteBlog ? <Link className="font-bold text-[var(--color-gold)]" href={`/admin/blog/${post.id}`}>Edit</Link> : <span className="text-[var(--color-gray-600)]">View only</span>}</td></tr>)}
        </tbody></table>
      </section>
    </div>
  );
}
