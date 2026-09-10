'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  lead: string;
  publishedAt: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  mythOrTruth?: {
    label: 'Myth' | 'Truth';
    text: string;
  };
  mythOrTruthChoice?: 'Myth' | 'Truth';
  mythOrTruthExplanation?: string;
}

export default function HomePage() {
  const [latestPost, setLatestPost] = useState<Post | null>(null);
  const [previousPost, setPreviousPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const response = await fetch('/api/posts?limit=50&skip=0&sortBy=recentlyAdded');
        const data = await response.json();
        const posts: Post[] = Array.isArray(data.posts) ? data.posts : [];

        if (posts.length > 0) {
          setLatestPost(posts[0]);
        }

        if (posts.length > 1) {
          setPreviousPost(posts[1]);
        }
      } catch (error) {
        console.error('Error fetching featured post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPost();
  }, []);

  return (
    <div className="la-page min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pb-4 pt-10 md:pb-2 md:pt-12">
        <h2 className="la-title mb-3 text-3xl font-bold md:text-4xl">
          Science facts that unfold like small investigations
        </h2>
        <p className="la-subtitle max-w-3xl text-lg leading-relaxed">
          A science blog built around one simple idea: surprising facts are easier to remember when they unfold like small investigations.
        </p>
      </div>

      {/* Hero */}
      <div className="la-hero py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="la-panel grid items-center gap-8 p-5 md:grid-cols-[0.98fr_1.02fr] md:gap-8 md:p-6">
            <div className="order-2 text-center md:order-1 md:text-left">
              <p className="la-kicker mb-3 text-xs">
                {latestPost ? 'Latest Fact' : 'Fact of the Week'}
              </p>
              <h1 className="la-title la-section-title mb-5 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                {latestPost ? latestPost.title : "Why doesn't your heart sit exactly in the center?"}
              </h1>
              <p className="la-subtitle mb-8 max-w-2xl text-lg leading-relaxed">
                {latestPost
                  ? latestPost.lead
                  : "Lexi&apos;s Anatomy is a curious, teen-friendly biology and medicine blog where surprising facts turn into clear explanations. One question, one investigation, one reason it matters in real life and real medicine."}
              </p>
              <hr className="la-divider mb-7" />
              <div className="flex flex-col gap-4 md:flex-row">
                {latestPost ? (
                  <>
                    <Link
                      href={`/posts/${latestPost.slug}`}
                      className="la-btn-primary px-8 py-3 text-center"
                    >
                      Read This Fact
                    </Link>
                    <Link
                      href="/facts"
                      className="la-btn-secondary px-8 py-3 text-center"
                    >
                      Explore All Facts
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/facts"
                      className="la-btn-primary px-8 py-3 text-center"
                    >
                      Explore All Facts
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="order-1 mx-auto w-full max-w-[520px] md:order-2">
              <div className="la-hero-portrait overflow-hidden p-1.5 md:p-2">
                <div className="rounded-2xl bg-gradient-to-b from-[#f7f3ef] via-[#f3f5f7] to-[#e8eef3] p-1.5 md:p-2">
                  <Image
                    src="/lexi2.png"
                    alt="Lexi in scrubs illustration"
                    width={700}
                    height={940}
                    priority
                    className="h-auto w-full rounded-xl object-contain scale-[1.08] md:scale-[1.15]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured post */}
      {!loading && previousPost && (
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="la-panel p-8 md:p-12">
            <p className="mb-2 text-sm font-semibold text-[#6b7f97]">Previous Fact</p>
            <h2 className="la-title la-section-title mb-4 text-2xl font-bold md:text-3xl">{previousPost.title}</h2>
            <p className="la-subtitle mb-6 text-lg">{previousPost.excerpt}</p>
            <hr className="la-rule mb-6" />
            <div className="mb-6 flex items-center gap-2">
              <span className="la-badge bg-[#e7c5ce] text-[#2e3b5b]">
                Question-led
              </span>
              {(previousPost.mythOrTruth?.label === 'Myth' || previousPost.mythOrTruthChoice === 'Myth') && (
                <span className="la-badge bg-[#f8e6ee] text-[#a5546f]">
                  Myth
                </span>
              )}
            </div>
            <Link
              href={`/posts/${previousPost.slug}`}
              className="la-btn-secondary px-6 py-2.5"
            >
              Read the Full Investigation
            </Link>
          </div>
        </div>
      )}

      {/* How each fact unfolds */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="la-title la-section-title mb-4 text-3xl font-bold">How each fact unfolds</h2>
          <p className="la-subtitle text-lg">
            Every Lexi&apos;s Anatomy post follows a simple pattern so science feels easier to explore and easier to remember.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: '❓',
              title: 'Start with a question',
              description: 'A surprising headline pulls the reader into the mystery.',
            },
            {
              icon: '🔬',
              title: 'Follow the explanation',
              description: 'The science is unpacked in clear, teen-friendly English.',
            },
            {
              icon: '✓',
              title: 'Check the myth',
              description: 'A quick Myth or Truth box separates what sounds right from what is right.',
            },
            {
              icon: '📚',
              title: 'Learn the key term',
              description: 'A short glossary explains the tricky word without sounding like a textbook.',
            },
          ].map((step, i) => (
            <div key={i} className="la-card p-6">
              <div className="text-3xl mb-3">{step.icon}</div>
              <h3 className="la-title la-section-title mb-2 text-xl font-bold">{step.title}</h3>
              <p className="la-subtitle">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="la-soft-note mt-8 p-6">
          <div className="text-2xl mb-3">💡</div>
          <h3 className="la-title mb-2 text-xl font-bold">See why it matters</h3>
          <p className="text-[#536079]">
            Each fact connects back to doctors, patients, parents, or everyday life.
          </p>
        </div>
      </div>

      {/* Ask Lexi */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="la-panel p-8 md:p-12">
          <h2 className="la-title la-section-title mb-4 text-3xl font-bold">Ask Lexi a question</h2>
          <p className="mb-8 text-[#3f5369]">
            Have you ever heard a strange body fact and wondered if it was actually true? Send a question, suggest a myth, or help choose a future topic for the site.
          </p>
          <hr className="la-rule mb-8" />
          <div className="flex flex-col md:flex-row gap-4">
            <Link
              href="/contact"
              className="la-btn-primary px-6 py-2.5"
            >
              Submit a Question
            </Link>
            <Link
              href="/contact"
              className="la-btn-secondary px-6 py-2.5"
            >
              Suggest a Myth
            </Link>
          </div>
        </div>
      </div>

      {/* About teaser */}
      <div className="bg-[#f2f4f6] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="la-title la-section-title mb-4 text-3xl font-bold">About the project</h2>
          <p className="mb-8 text-lg text-[#536079]">
            Lexi&apos;s Anatomy is an English-language biology and medicine blog created by Lexi, a student who wants to become a doctor. The goal is simple: find surprising facts, explain them clearly, and show why they matter beyond the classroom.
          </p>
          <Link
            href="/about"
            className="la-btn-secondary px-6 py-2.5"
          >
            Read About Lexi&apos;s Anatomy
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[color:var(--line)] bg-[#253341] py-12 text-[#d0d9e0]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="la-title mb-4 text-xl font-bold text-[#f5f8fb]">Lexi&apos;s Anatomy</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/facts" className="transition-colors hover:text-white">
                    All Facts
                  </Link>
                </li>
                <li>
                  <Link href="/about-lexi" className="transition-colors hover:text-white">
                    About Lexi
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition-colors hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-white">Get Involved</h3>
              <p className="text-sm">Curious about a biology or medicine question?</p>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-white">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <p>Lexi&apos;s Anatomy is for educational purposes only and does not provide medical advice.</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#445b72] pt-8 text-sm">
            <p>&copy; 2026 Lexi&apos;s Anatomy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
