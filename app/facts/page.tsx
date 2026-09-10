'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  mythOrTruth?: {
    label: 'Myth' | 'Truth';
    text: string;
  };
  mythOrTruthChoice?: 'Myth' | 'Truth';
}

export default function FactsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const skip = (page - 1) * itemsPerPage;
        const response = await fetch(`/api/posts?limit=${itemsPerPage}&skip=${skip}`);
        const data = await response.json();
        setPosts(data.posts || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="la-page min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="la-title la-section-title mb-4 text-4xl font-bold md:text-5xl">All Facts</h1>
          <p className="la-subtitle mx-auto max-w-2xl text-lg">
            Explore every investigation published on Lexi&apos;s Anatomy, from anatomy and microbiology to medical myths, brain facts, and everyday questions about how the body works.
          </p>
        </div>

        <div className="la-card mb-8 p-4">
          <p className="text-[#3f5369]">
            <span className="font-semibold">Newest first:</span> Short, surprising science stories you can read in just a few minutes.
          </p>
        </div>

        <hr className="la-divider mb-8" />

        {loading ? (
          <div className="text-center py-12">
            <p className="la-subtitle">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="la-subtitle text-lg">No facts yet — but the next mystery is already on its way.</p>
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {posts.map((post) => (
              <Link key={post._id} href={`/posts/${post.slug}`}>
                <article className="la-card cursor-pointer overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="grid md:grid-cols-3 gap-6 p-6">
                    {post.coverImageUrl && (
                      <div className="md:col-span-1">
                        <img
                          src={post.coverImageUrl}
                          alt={post.coverImageAlt || post.title}
                          className="w-full h-48 object-cover rounded"
                        />
                      </div>
                    )}
                    <div className={post.coverImageUrl ? 'md:col-span-2' : 'md:col-span-3'}>
                      {(post.mythOrTruth?.label === 'Myth' || post.mythOrTruthChoice === 'Myth') && (
                        <div className="mb-2">
                          <span className="la-badge inline-block bg-[#f8e6ee] text-[#a5546f] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            Myth
                          </span>
                        </div>
                      )}
                      <h2 className="la-title la-section-title mb-2 text-2xl font-bold">{post.title}</h2>
                      <p className="la-subtitle mb-4">{post.excerpt}</p>
                      <time className="text-sm text-[#6d7f91]">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex gap-4 justify-center items-center">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="la-btn-primary px-6 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Older facts
            </button>
            <span className="la-subtitle">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="la-btn-secondary px-6 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Newer facts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
