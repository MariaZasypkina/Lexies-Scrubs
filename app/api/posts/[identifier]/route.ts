import { NextRequest, NextResponse } from 'next/server';
import { deletePost, getPostById, getPostBySlug, slugExists, updatePost } from '@/lib/posts';
import { verifyAdminAuth } from '@/lib/auth';
import { generateSeoTitle, normalizeSlug, Post } from '@/models/Post';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;

    let post = await getPostById(identifier);
    if (!post) {
      post = await getPostBySlug(identifier);
    }

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { identifier } = await params;
    let post = await getPostById(identifier);
    if (!post) {
      post = await getPostBySlug(identifier);
    }

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const targetId = String(post._id || post.id);
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

    if (await slugExists(slug, targetId)) {
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

    const updates: Record<string, unknown> = {
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
      updates.factBadge = {
        type: data.factBadge.type,
        statement,
      };
    } else {
      updates.factBadge = undefined;
    }

    if (data.publishedAt) {
      const date = new Date(data.publishedAt);
      if (!Number.isNaN(date.getTime())) {
        updates.publishedAt = date;
      }
    }

    const ok = await updatePost(targetId, updates as Partial<Post>);
    if (!ok) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { identifier } = await params;
    let post = await getPostById(identifier);
    if (!post) {
      post = await getPostBySlug(identifier);
    }

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const targetId = String(post._id);
    const ok = await deletePost(targetId);
    if (!ok) {
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
