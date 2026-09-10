import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/posts';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.seoTitle,
    description: post.metaDescription,
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle,
      description: post.metaDescription,
      images: post.coverImageUrl ? [post.coverImageUrl] : [],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const isMyth = post.factBadge
    ? post.factBadge.type === 'myth'
    : (post.mythOrTruth?.label === 'Myth' || post.mythOrTruthChoice === 'Myth');

  const badgeType = post.factBadge?.type || (post.mythOrTruth?.label ? post.mythOrTruth.label.toLowerCase() : undefined);
  const badgeStatement = post.factBadge?.statement || post.mythOrTruth?.text;

  const mythOrTruthDisplayLabel =
    badgeType === 'myth'
      ? "No, it's a Myth"
      : badgeType === 'truth'
        ? "Yes, it's a Truth"
        : post.mythOrTruth?.label;

  const articleText = post.content || post.mainExplanation || '';

  return (
    <article className="la-page min-h-screen">
      <div className="la-hero py-12">
        <div className="max-w-3xl mx-auto px-6">
          {isMyth && (
            <div className="mb-3">
              <span className="la-badge bg-[#f8e6ee] text-[#a5546f] text-xs font-semibold px-3 py-1 rounded-full">
                Myth
              </span>
            </div>
          )}
          <h1 className="la-title la-section-title mb-4 text-4xl font-bold md:text-5xl">{post.title}</h1>
          <p className="la-subtitle text-lg">{post.lead}</p>
          <time className="mt-4 block text-sm text-[#6b7f92]">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </div>

      {post.coverImageUrl && (
        <div className="max-w-3xl mx-auto px-6 py-8">
          <img src={post.coverImageUrl} alt={post.coverImageAlt} className="la-card w-full rounded-lg" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        <hr className="la-divider mb-8" />
        <div className="la-heading-stack mb-12 prose prose-lg max-w-none">
          <h2 className="la-title la-section-title mb-4 text-2xl font-bold">The Explanation</h2>
          <p className="whitespace-pre-wrap leading-relaxed text-[#3f5369]">{articleText}</p>
        </div>

        {badgeStatement && (
          <div className="la-soft-note mb-12 border-l-4 border-[#bb6f88] p-6">
            <h2 className="la-title la-section-title mb-4 text-2xl font-bold">Myth or Truth?</h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-[#a1536d]">{mythOrTruthDisplayLabel}</span> {badgeStatement}
              </p>
            </div>
          </div>
        )}

        {post.glossary && post.glossary.length > 0 && (
          <div className="mb-12">
            <h2 className="la-title la-section-title mb-4 text-2xl font-bold">Key Terms</h2>
            <div className="space-y-4">
              {post.glossary.map((item, i) => (
                <div key={i} className="border-l-2 border-[#6292b3] pl-4">
                  <p className="font-semibold text-[#25384d]">{item.term}</p>
                  <p className="text-[#3f5369]">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {post.whyThisMatters && (
          <div className="la-soft-note mb-12 p-6">
            <h2 className="la-title la-section-title mb-4 text-2xl font-bold">Why This Matters</h2>
            <p className="leading-relaxed text-[#3f5369]">{post.whyThisMatters}</p>
          </div>
        )}

        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <div className="mb-12">
            <h2 className="la-title la-section-title mb-4 text-2xl font-bold">3 Key Takeaways</h2>
            <ul className="space-y-2">
              {post.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex gap-3 text-[#3f5369]">
                  <span className="font-bold text-[#b1627b]">{i + 1}.</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {post.sources.length > 0 && (
          <div className="mb-12">
            <h2 className="la-title la-section-title mb-4 text-2xl font-bold">Sources</h2>
            <ul className="space-y-2">
              {post.sources.map((source, i) => (
                <li key={i}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="la-link underline">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12 border-t border-[color:var(--line)] pt-12 text-sm text-[#66798b]">
          <p>
            <strong>Disclaimer:</strong> Lexi&apos;s Anatomy is for educational purposes only and does not provide medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </article>
  );
}
