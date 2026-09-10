'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateSeoTitle, normalizeSlug } from '@/models/Post';

type FactBadgeType = 'none' | 'myth' | 'truth';

type Source = {
  label: string;
  url: string;
};

type FormState = {
  title: string;
  slug: string;
  isSlugTouched: boolean;
  lead: string;
  content: string;
  factBadgeType: FactBadgeType;
  badgeStatement: string;
  sources: Source[];
  coverImageUrl: string;
  coverImageAlt: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
};

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<FormState>({
    title: '',
    slug: '',
    isSlugTouched: false,
    lead: '',
    content: '',
    factBadgeType: 'none',
    badgeStatement: '',
    sources: [{ label: '', url: '' }],
    coverImageUrl: '',
    coverImageAlt: '',
    seoTitle: '',
    metaDescription: '',
    excerpt: '',
  });

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: prev.isSlugTouched ? prev.slug : normalizeSlug(value),
    }));
  }

  function handleSlugChange(value: string) {
    setForm((prev) => ({
      ...prev,
      slug: normalizeSlug(value),
      isSlugTouched: true,
    }));
  }

  function setSource(index: number, key: 'label' | 'url', value: string) {
    setForm((prev) => {
      const next = [...prev.sources];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, sources: next };
    });
  }

  function addSource() {
    setForm((prev) => ({
      ...prev,
      sources: [...prev.sources, { label: '', url: '' }],
    }));
  }

  function removeSource(index: number) {
    setForm((prev) => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index),
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const title = form.title.trim();
    const slug = normalizeSlug(form.slug || title);
    const lead = form.lead.trim();
    const content = form.content.trim();
    const coverImageUrl = form.coverImageUrl.trim();
    const coverImageAlt = form.coverImageAlt.trim();

    if (!title) {
      setError('Title is required.');
      return;
    }
    if (!slug) {
      setError('Slug is required.');
      return;
    }
    if (!lead) {
      setError('The Question That Started It is required.');
      return;
    }
    if (!content) {
      setError('Article Content is required.');
      return;
    }

    if (form.factBadgeType !== 'none') {
      if (!form.badgeStatement.trim()) {
        setError('Badge statement is required when a Fact Badge is selected.');
        return;
      }
    }

    if (!form.sources || form.sources.length < 1) {
      setError('At least one source is required.');
      return;
    }

    for (const source of form.sources) {
      if (!source.label.trim()) {
        setError('Source label cannot be blank.');
        return;
      }
      if (!source.url.trim()) {
        setError('Source URL cannot be blank.');
        return;
      }
      if (!/^https?:\/\//i.test(source.url.trim())) {
        setError('Source URL must begin with http:// or https://.');
        return;
      }
    }

    if (!coverImageUrl) {
      setError('Cover Image URL is required.');
      return;
    }
    if (!coverImageAlt) {
      setError('Cover Image Alt Text is required.');
      return;
    }

    setSaving(true);

    const payload: Record<string, unknown> = {
      title,
      slug,
      lead,
      content,
      sources: form.sources.map((s) => ({
        label: s.label.trim(),
        url: s.url.trim(),
      })),
      coverImageUrl,
      coverImageAlt,
      seoTitle: form.seoTitle.trim() || generateSeoTitle(title),
      metaDescription: form.metaDescription.trim() || lead,
      excerpt: form.excerpt.trim() || lead,
    };

    if (form.factBadgeType === 'myth' || form.factBadgeType === 'truth') {
      payload.factBadge = {
        type: form.factBadgeType,
        statement: form.badgeStatement.trim(),
      };
    }

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || 'Failed to create post');
      setSaving(false);
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  }

  const computedSeoTitle = form.title.trim() ? generateSeoTitle(form.title) : 'Title | Lexies Scrubs';

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Create Post</h1>
      <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        {/* 1. Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
        </div>

        {/* 2. Slug */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            required
          />
        </div>

        {/* 3. The Question That Started It */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            The Question That Started It <span className="text-red-500">*</span>
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            What made you curious about this topic? Write a short question or thought that inspired the post.
          </p>
          <textarea
            rows={3}
            className="mt-1.5 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            value={form.lead}
            onChange={(e) => setField('lead', e.target.value)}
            placeholder="If the heart pumps blood to the whole body, why isn’t it exactly in the middle of the chest?"
            required
          />
        </div>

        {/* 4. Article Content */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Article Content <span className="text-red-500">*</span>
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            Explain the surprising fact in clear, teen-friendly language. Include why it matters in real life, medicine, or science naturally in the article when relevant.
          </p>
          <textarea
            rows={10}
            className="mt-1.5 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            value={form.content}
            onChange={(e) => setField('content', e.target.value)}
            required
          />
        </div>

        {/* 5. Fact badge (optional) */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <label className="block text-sm font-semibold text-slate-800">
            Fact badge (optional)
          </label>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="factBadgeType"
                value="none"
                checked={form.factBadgeType === 'none'}
                onChange={() => setField('factBadgeType', 'none')}
              />
              <span>Do not show a badge</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="factBadgeType"
                value="myth"
                checked={form.factBadgeType === 'myth'}
                onChange={() => setField('factBadgeType', 'myth')}
              />
              <span>Myth</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="factBadgeType"
                value="truth"
                checked={form.factBadgeType === 'truth'}
                onChange={() => setField('factBadgeType', 'truth')}
              />
              <span>Truth</span>
            </label>
          </div>

          {form.factBadgeType !== 'none' && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-800">
                Badge statement <span className="text-red-500">*</span>
              </label>
              <p className="mt-0.5 text-xs text-slate-500">
                Write the short claim readers may believe. The article itself should explain the science.
              </p>
              <input
                type="text"
                className="mt-1.5 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
                value={form.badgeStatement}
                onChange={(e) => setField('badgeStatement', e.target.value)}
                required
              />
            </div>
          )}
        </div>

        {/* 6. Sources */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-800">
            Sources <span className="text-red-500">*</span>
          </label>
          {form.sources.map((source, index) => (
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] items-start" key={index}>
              <div>
                <label className="block text-xs font-medium text-slate-600">Source Label</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-pink-500 focus:outline-none"
                  value={source.label}
                  onChange={(e) => setSource(index, 'label', e.target.value)}
                  placeholder="e.g. NIH"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Source URL</label>
                <input
                  type="url"
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-pink-500 focus:outline-none"
                  value={source.url}
                  onChange={(e) => setSource(index, 'url', e.target.value)}
                  placeholder="https://example.org/source"
                  required
                />
              </div>
              {form.sources.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSource(index)}
                  className="mt-6 text-xs font-semibold text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSource}
            className="rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Add Source
          </button>
        </div>

        {/* 7. Cover Image */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Cover Image <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            value={form.coverImageUrl}
            onChange={(e) => setField('coverImageUrl', e.target.value)}
            placeholder="e.g. /heart-anatomy.png or https://example.com/image.jpg"
            required
          />
        </div>

        {/* 8. Cover Image Alt Text */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Cover Image Alt Text <span className="text-red-500">*</span>
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            Describe what is visible in the image for readers using screen readers.
          </p>
          <input
            type="text"
            className="mt-1.5 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            value={form.coverImageAlt}
            onChange={(e) => setField('coverImageAlt', e.target.value)}
            required
          />
        </div>

        {/* 9. Optional SEO Settings */}
        <details className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800 hover:text-slate-900">
            Optional SEO settings
          </summary>
          <div className="mt-4 space-y-4 pt-2 border-t border-slate-200">
            {/* SEO Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-800">
                SEO Title
              </label>
              <p className="mt-0.5 text-xs text-slate-500">
                Optional. If blank, the site uses the article title followed by “| Lexies Scrubs”.
              </p>
              <input
                type="text"
                className="mt-1.5 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-pink-500 focus:outline-none bg-white"
                value={form.seoTitle}
                onChange={(e) => setField('seoTitle', e.target.value)}
                placeholder={computedSeoTitle}
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-800">
                  Meta Description
                </label>
                <span className="text-xs text-slate-500">
                  {form.metaDescription.length} / 160 characters
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Optional. A short summary for search results. If blank, the site uses the question above.
              </p>
              <textarea
                rows={2}
                className="mt-1.5 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-pink-500 focus:outline-none bg-white"
                value={form.metaDescription}
                onChange={(e) => setField('metaDescription', e.target.value)}
                placeholder={form.lead || 'Short summary for search results...'}
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-slate-800">
                Excerpt
              </label>
              <p className="mt-0.5 text-xs text-slate-500">
                Optional. Short text for article cards. If blank, the site uses the question above.
              </p>
              <textarea
                rows={2}
                className="mt-1.5 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-pink-500 focus:outline-none bg-white"
                value={form.excerpt}
                onChange={(e) => setField('excerpt', e.target.value)}
                placeholder={form.lead || 'Short text for article cards...'}
              />
            </div>
          </div>
        </details>

        {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}

        {/* 10. Publish / Update action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-pink-600 px-6 py-2.5 font-semibold text-white hover:bg-pink-700 disabled:opacity-60 transition-colors"
          >
            {saving ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
