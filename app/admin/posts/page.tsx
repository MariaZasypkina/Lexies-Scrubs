import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  const { items } = await getAllPosts(500, 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Posts</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin/myths" className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
            Myths
          </Link>
          <Link href="/admin/myths/new" className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
            New Myth
          </Link>
          <Link href="/admin/posts/new" className="rounded-lg bg-pink-600 px-4 py-2 font-semibold text-white hover:bg-pink-700">
            New Post
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Published</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Edit</th>
            </tr>
          </thead>
          <tbody>
            {items.map((post: { _id?: string; id?: string; title: string; publishedAt?: string | Date }) => (
              <tr key={String(post._id || post.id)} className="border-t border-slate-100">
                <td className="px-4 py-3 text-sm text-slate-900">{post.title}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Link href={`/admin/posts/${String(post._id)}/edit`} className="text-pink-700 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500">
                  No posts yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
