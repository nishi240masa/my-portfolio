'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import dynamicImport from 'next/dynamic';
import type { PostPage } from '@/types/post';
import { Field, TextInput, NumberInput, TextArea, StringListEditor, Toolbar, TwoPaneLayout } from '../../_components/AdminForm';
import { ImagePlaceholder } from '@/app/_components/design/Placeholders';
import TagList from '@/app/_components/design/Tags';
import { LoadingDots } from '@/app/_components/design/States';

const MarkdownContent = dynamicImport(
  () => import('@/app/(use-header)/production/(use-production)/[id]/MarkdownContent'),
  { ssr: false, loading: () => <LoadingDots /> },
);

type FormState = Omit<PostPage, 'id'>;

function emptyForm(): FormState {
  return {
    title: '',
    image: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    tags: [],
    peopleNum: 1,
    role: '',
    period: '',
    technologys: [],
    content: '',
  };
}

export default function ProductionEditor({
  initial,
  id,
}: {
  initial?: PostPage;
  id?: number;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => {
    if (!initial) return emptyForm();
    const { id: _ignore, ...rest } = initial;
    void _ignore;
    return rest;
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus('idle');
    const url = id != null ? `/api/admin/productions/${id}` : '/api/admin/productions';
    const method = id != null ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      setStatus('error');
      return;
    }
    setStatus('success');
    if (id == null) {
      const data = (await res.json()) as { item: PostPage };
      router.push(`/admin/productions/${data.item.id}`);
    } else {
      router.refresh();
    }
  }

  const meta = [
    { label: 'ROLE · 役割', value: form.role || '—' },
    { label: 'TEAM · 人数', value: `${form.peopleNum}名` },
    { label: 'PERIOD · 期間', value: form.period || '—' },
    { label: 'STACK · 使用技術', value: form.technologys.join(' / ') || '—' },
  ];

  return (
    <>
      <Toolbar
        onSave={handleSave}
        onCancel={() => router.push('/admin/productions')}
        saving={saving}
        status={saving ? 'saving' : status}
      />

      <TwoPaneLayout
        form={
          <div>
            <Field label="タイトル">
              <TextInput value={form.title} onChange={(v) => update('title', v)} />
            </Field>
            <Field label="日付" hint="YYYY-MM-DD 形式">
              <TextInput value={form.date} onChange={(v) => update('date', v)} placeholder="2024-10-01" />
            </Field>
            <Field label="サムネイル画像 URL" hint="任意。空にするとプレースホルダ表示">
              <TextInput value={form.image ?? ''} onChange={(v) => update('image', v)} />
            </Field>
            <Field label="概要">
              <TextArea value={form.description} onChange={(v) => update('description', v)} rows={3} />
            </Field>
            <Field label="タグ">
              <StringListEditor value={form.tags} onChange={(v) => update('tags', v)} placeholder="Golang" />
            </Field>
            <Field label="役割">
              <TextInput value={form.role} onChange={(v) => update('role', v)} />
            </Field>
            <Field label="人数">
              <NumberInput value={form.peopleNum} onChange={(v) => update('peopleNum', v)} />
            </Field>
            <Field label="期間">
              <TextInput value={form.period} onChange={(v) => update('period', v)} placeholder="約2ヶ月" />
            </Field>
            <Field label="使用技術">
              <StringListEditor
                value={form.technologys}
                onChange={(v) => update('technologys', v)}
                placeholder="Docker"
              />
            </Field>
            <Field label="本文（Markdown）" hint="GFM + 数式 (KaTeX) 対応">
              <TextArea value={form.content} onChange={(v) => update('content', v)} rows={20} monospace />
            </Field>
          </div>
        }
        preview={
          <article style={{ padding: 24 }}>
            <div className="t-eyebrow" style={{ marginBottom: 12 }}>
              {form.date} · WORK
            </div>
            <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 32, marginBottom: 12 }}>{form.title || '（タイトル未設定）'}</h1>
            <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 16, color: 'var(--fg-muted)', marginBottom: 16 }}>
              {form.description}
            </div>
            <TagList tags={form.tags} solid />
            <div style={{ marginTop: 16 }}>
              <ImagePlaceholder label={form.title} ratio="21/9" src={form.image} />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
                margin: '24px 0',
                padding: 16,
                border: '1px solid var(--hairline)',
              }}
            >
              {meta.map((m) => (
                <div key={m.label}>
                  <div className="t-eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>
                    {m.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 13, lineHeight: 1.4 }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div className="markdown-body">
              <MarkdownContent content={form.content} />
            </div>
          </article>
        }
      />
    </>
  );
}
