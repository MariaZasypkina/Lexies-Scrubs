import { ObjectId } from 'mongodb';

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
  _id?: ObjectId;
  title: string;
  slug: string;
  lead: string;
  mainExplanation: string;
  mythOrTruth: MythOrTruth;
  mythOrTruthChoice?: 'Myth' | 'Truth';
  mythOrTruthExplanation?: string;
  glossary: GlossaryItem[];
  whyThisMatters: string;
  keyTakeaways: string[];
  sources: SourceItem[];
  coverImageUrl: string;
  coverImageAlt: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt: Date;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateExcerpt(lead: string, maxLength: number = 160): string {
  if (lead.length <= maxLength) return lead;
  return lead.substring(0, maxLength).trim() + '...';
}

export function generateSeoTitle(title: string): string {
  return `${title} | Lexies Scrubs`;
}

export function generateMetaDescription(lead: string): string {
  const excerpt = generateExcerpt(lead, 160);
  return excerpt;
}

export function getMythOrTruthEntriesFromPosts(posts: Post[]): MythOrTruthEntry[] {
  return posts.reduce<MythOrTruthEntry[]>((entries, post) => {
      const choice = post.mythOrTruthChoice ?? post.mythOrTruth?.label;
      const explanation = post.mythOrTruthExplanation ?? post.mythOrTruth?.text;

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
