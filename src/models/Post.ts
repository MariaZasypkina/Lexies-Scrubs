export type FactBadgeType = 'myth' | 'truth';

export interface FactBadge {
  type: FactBadgeType;
  statement: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface SourceItem {
  label: string;
  url: string;
}

export interface MythOrTruth {
  label: 'Myth' | 'Truth';
  text: string;
}

export interface MythOrTruthEntry {
  postSlug: string;
  postTitle: string;
  choice: 'Myth' | 'Truth';
  explanation: string;
  publishedAt?: Date;
}

export interface Post {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  lead: string;
  content?: string;
  factBadge?: FactBadge;
  mainExplanation?: string;
  whyThisMatters?: string;
  mythOrTruth?: MythOrTruth;
  mythOrTruthChoice?: 'Myth' | 'Truth';
  mythOrTruthExplanation?: string;
  glossary?: GlossaryItem[];
  keyTakeaways?: string[];
  sources: SourceItem[];
  coverImageUrl: string;
  coverImageAlt: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt: Date;
}

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateSlug(title: string): string {
  return normalizeSlug(title);
}

export function generateExcerpt(lead: string, maxLength: number = 160): string {
  if (lead.length <= maxLength) return lead;
  return lead.substring(0, maxLength).trim() + '...';
}

export function generateSeoTitle(title: string): string {
  return `${title.trim()} | Lexies Scrubs`;
}

export function generateMetaDescription(lead: string): string {
  const excerpt = generateExcerpt(lead, 160);
  return excerpt;
}

export function getMythOrTruthEntriesFromPosts(posts: Post[]): MythOrTruthEntry[] {
  return posts.reduce<MythOrTruthEntry[]>((entries, post) => {
      const choice = post.factBadge
        ? (post.factBadge.type === 'myth' ? 'Myth' : 'Truth')
        : (post.mythOrTruthChoice ?? post.mythOrTruth?.label);
      const explanation = post.factBadge
        ? post.factBadge.statement
        : (post.mythOrTruthExplanation ?? post.mythOrTruth?.text);

      if (!choice || !explanation || !post.slug || !post.title) {
        return entries;
      }

      if (choice !== 'Myth' && choice !== 'Truth') {
        return entries;
      }

      entries.push({
        postSlug: post.slug,
        postTitle: post.title,
        choice,
        explanation,
        publishedAt: post.publishedAt,
      });

      return entries;
    }, []);
}
