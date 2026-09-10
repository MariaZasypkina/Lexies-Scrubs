import { NextRequest, NextResponse } from 'next/server';
import { createPost, getAllPosts, slugExists } from '@/lib/posts';
import { verifyAdminAuth } from '@/lib/auth';
import { generateSeoTitle, normalizeSlug, Post } from '@/models/Post';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '500', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const sortBy = searchParams.get('sortBy') === 'recentlyAdded' ? 'recentlyAdded' : 'publishedAt';
    const { items, total } = await getAllPosts(limit, skip, sortBy);

    return NextResponse.json({
      posts: items,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const title = typeof data.title === 'string' ? data.title.trim() : '';
    const lead = typeof data.lead === 'string' ? data.lead.trim() : '';
    const content = typeof data.content === 'string' ? data.content.trim() : '';
    const coverImageUrl = typeof data.coverImageUrl === 'string' ? data.coverImageUrl.trim() : '';
    const coverImageAlt = typeof data.coverImageAlt === 'string' ? data.coverImageAlt.trim() : '';

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!lead) {
      return NextResponse.json({ error: 'The Question That Started It is required' }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ error: 'Article Content is required' }, { status: 400 });
    }
    if (!coverImageUrl) {
      return NextResponse.json({ error: 'Cover Image URL is required' }, { status: 400 });
    }
    if (!coverImageAlt) {
      return NextResponse.json({ error: 'Cover Image Alt Text is required' }, { status: 400 });
    }

    if (!Array.isArray(data.sources) || data.sources.length < 1) {
      return NextResponse.json({ error: 'At least one source is required' }, { status: 400 });
    }

    for (const source of data.sources) {
      const label = typeof source.label === 'string' ? source.label.trim() : '';
      const url = typeof source.url === 'string' ? source.url.trim() : '';
      if (!label) {
        return NextResponse.json({ error: 'Source label cannot be blank' }, { status: 400 });
      }
      if (!url || !/^https?:\/\//i.test(url)) {
        return NextResponse.json({ error: 'Source URL must begin with http:// or https://' }, { status: 400 });
      }
    }

    const rawSlug = typeof data.slug === 'string' && data.slug.trim() ? data.slug : title;
    const slug = normalizeSlug(rawSlug);

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    if (await slugExists(slug)) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
    }

    const seoTitle = typeof data.seoTitle === 'string' && data.seoTitle.trim()
      ? data.seoTitle.trim()
      : generateSeoTitle(title);

    const metaDescription = typeof data.metaDescription === 'string' && data.metaDescription.trim()
      ? data.metaDescription.trim()
      : lead;

    const excerpt = typeof data.excerpt === 'string' && data.excerpt.trim()
      ? data.excerpt.trim()
      : lead;

    const postPayload: Record<string, unknown> = {
      title,
      slug,
      lead,
      content,
      sources: data.sources.map((s: { label: string; url: string }) => ({
        label: String(s.label).trim(),
        url: String(s.url).trim(),
      })),
      coverImageUrl,
      coverImageAlt,
      seoTitle,
      metaDescription,
      excerpt,
    };

    if (data.factBadge && (data.factBadge.type === 'myth' || data.factBadge.type === 'truth')) {
      const statement = typeof data.factBadge.statement === 'string' ? data.factBadge.statement.trim() : '';
      if (!statement) {
        return NextResponse.json({ error: 'Badge statement is required when Myth or Truth is selected' }, { status: 400 });
      }
      postPayload.factBadge = {
        type: data.factBadge.type,
        statement,
      };
    }

    if (data.publishedAt) {
      const date = new Date(data.publishedAt);
      if (!Number.isNaN(date.getTime())) {
        postPayload.publishedAt = date;
      }
    }

    const postId = await createPost(postPayload as Omit<Post, '_id' | 'publishedAt' | 'updatedAt'>);
    return NextResponse.json({ id: postId.toString(), success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
