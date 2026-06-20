'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import type { PostPage } from '@/types/post';
import {
  Field,
  FieldErrors,
  TextInput,
  NumberInput,
  TextArea,
  StringListEditor,
  Toolbar,
  TwoPaneLayout,
} from '../../_components/AdminForm';
import { ImagePlaceholder } from '@/app/_components/design/Placeholders';
import TagList from '@/app/_components/design/Tags';
import { LoadingDots } from '@/app/_components/design/States';
import { upsertProduction } from '../../_actions/productions';
import { INITIAL_ACTION_STATE, type ActionState } from '../../_actions/_types';

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
  const [state, formAction] = useActionState<ActionState<PostPage>, FormData>(
    upsertProduction,
    INITIAL_ACTION_STATE as ActionState<PostPage>,
  );
  const [showOk, setShowOk] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // 保存成功時のナビゲーション:
  // - 新規 (id が無く data.id が返る) → 編集画面へ push
  // - 既存 (id 指定済) → router.refresh()
  // useActionState は毎回新しい state オブジェクトを返すため、state 自体を
  // deps に入れることで 2 回目以降の成功時にも確実に発火する。
  useEffect(() => {
    if (!state.ok) return;
    if (id == null && state.data?.id != null) {
      router.push(`/admin/productions/${state.data.id}`);
    } else {
      router.refresh();
    }
  }, [state, id, router]);

  // 「✓ 保存しました」を 3 秒後に自動消失。state オブジェクトの identity を
  // 観測することで 2 回目以降の連続成功でも effect が再発火する。
  useEffect(() => {
    if (state.ok) {
      setShowOk(true);
      const t = setTimeout(() => setShowOk(false), 3000);
      return () => clearTimeout(t);
    }
  }, [state]);

  const status = state.ok ? 'success' : state.error ? 'error' : 'idle';

  const meta = [
    { label: 'ROLE · 役割', value: form.role || '—' },
    { label: 'TEAM · 人数', value: `${form.peopleNum}名` },
    { label: 'PERIOD · 期間', value: form.period || '—' },
    { label: 'STACK · 使用技術', value: form.technologys.join(' / ') || '—' },
  ];

  return (
    <form action={formAction}>
      <input type="hidden" name="payload" value={JSON.stringify(form)} />
      {id != null ? <input type="hidden" name="id" value={String(id)} /> : null}

      <Toolbar
        onCancel={() => router.push('/admin/productions')}
        status={status}
        showOk={showOk}
        errorMessage={state.error}
      />
      <FieldErrors errors={state.fieldErrors} />

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
    </form>
  );
}
