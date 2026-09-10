import { promises as fs } from 'fs';
import path from 'path';
import { Post } from '@/models/Post';

const postsFilePath = path.join(process.cwd(), 'src', 'content', 'posts.json');

async function ensurePostsFile(): Promise<void> {
  try {
    await fs.access(postsFilePath);
  } catch {
    await fs.mkdir(path.dirname(postsFilePath), { recursive: true });
    await fs.writeFile(postsFilePath, '[]\n', 'utf8');
  }
}

function generateId(): string {
  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getPostsFromJSON(): Promise<Post[]> {
  await ensurePostsFile();
  try {
    const raw = await fs.readFile(postsFilePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      _id: item._id ? String(item._id) : item.id ? String(item.id) : generateId(),
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    }));
  } catch (err) {
    console.error('Error reading posts.json:', err);
    return [];
  }
}

export async function savePostsToJSON(posts: Post[]): Promise<void> {
  await ensurePostsFile();
  const serialized = posts.map((post) => ({
    ...post,
    _id: String(post._id),
    publishedAt: post.publishedAt instanceof Date ? post.publishedAt.toISOString() : post.publishedAt,
    updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
  }));
  await fs.writeFile(postsFilePath, `${JSON.stringify(serialized, null, 2)}\n`, 'utf8');
}

export async function createPost(postData: Omit<Post, '_id' | 'publishedAt' | 'updatedAt'>) {
  if (await slugExists(postData.slug)) {
    throw new Error('A post with this slug already exists');
  }

  const now = new Date();
  const providedPublishedAt = (postData as Record<string, unknown>).publishedAt;
  const publishedAt =
    providedPublishedAt instanceof Date && !Number.isNaN(providedPublishedAt.getTime())
      ? providedPublishedAt
      : typeof providedPublishedAt === 'string' && !Number.isNaN(new Date(providedPublishedAt).getTime())
        ? new Date(providedPublishedAt)
        : now;

  const newId = generateId();

  const newPost: Post = {
    ...postData,
    _id: newId,
    publishedAt,
    updatedAt: now,
  };

  const currentPosts = await getPostsFromJSON();
  await savePostsToJSON([newPost, ...currentPosts]);

  return newId;
}

export async function updatePost(id: string, updates: Partial<Post>) {
  const currentPosts = await getPostsFromJSON();
  const index = currentPosts.findIndex(
    (p) => String(p._id) === id || String(p.id) === id
  );

  if (index >= 0) {
    const now = new Date();
    const updated = {
      ...currentPosts[index],
      ...updates,
      updatedAt: now,
    };
    if (!('factBadge' in updates) || updates.factBadge === undefined) {
      delete updated.factBadge;
    }
    currentPosts[index] = updated;
    await savePostsToJSON(currentPosts);
    return true;
  }

  return false;
}

export async function getPostById(id: string): Promise<Post | null> {
  const posts = await getPostsFromJSON();
  return posts.find((p) => String(p._id) === id || String(p.id) === id) ?? null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPostsFromJSON();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getAllPosts(
  limit: number = 10,
  skip: number = 0,
  sortBy: 'publishedAt' | 'recentlyAdded' = 'publishedAt'
) {
  const posts = await getPostsFromJSON();
  const sorted = [...posts].sort((a, b) => {
    if (sortBy === 'recentlyAdded') {
      return new Date(b.updatedAt || b.publishedAt).getTime() - new Date(a.updatedAt || a.publishedAt).getTime();
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const items = sorted.slice(skip, skip + limit);
  return { items, total: sorted.length };
}

export async function deletePost(id: string) {
  const currentPosts = await getPostsFromJSON();
  const next = currentPosts.filter(
    (p) => String(p._id) !== id && String(p.id) !== id
  );

  if (next.length !== currentPosts.length) {
    await savePostsToJSON(next);
    return true;
  }

  return false;
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const posts = await getPostsFromJSON();
  return posts.some((p) => {
    if (p.slug !== slug) return false;
    if (excludeId && (String(p._id) === excludeId || String(p.id) === excludeId)) {
      return false;
    }
    return true;
  });
}
