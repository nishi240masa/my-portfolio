'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { HomeContent, HomeIndexItem } from '@/types/home';
import HomeView from '@/app/(use-header)/home/_components/HomeView';
import {
  Field,
  FieldErrors,
  TextInput,
  TextArea,
  StringListEditor,
  Toolbar,
  TwoPaneLayout,
} from '../_components/AdminForm';
import { saveHome } from '../_actions/home';
import { INITIAL_ACTION_STATE, type ActionState } from '../_actions/_types';

const addBtn = {
  padding: '6px 12px',
  fontSize: 12,
  fontFamily: 'var(--font-mincho)',
  border: '1px dashed var(--hairline-strong)',
  background: 'transparent',
  color: 'var(--fg-muted)',
  cursor: 'pointer',
} as const;

const removeBtn = {
  padding: '4px 10px',
  fontSize: 11,
  border: '1px solid var(--hairline)',
  background: 'transparent',
  color: '#c33',
  cursor: 'pointer',
  marginTop: 4,
} as const;

function IndexItemsEditor({
  value,
  onChange,
}: {
  value: HomeIndexItem[];
  onChange: (v: HomeIndexItem[]) => void;
}) {
  return (
    <div>
      {value.map((it, i) => (
        <div key={i} style={{ padding: 12, border: '1px solid var(--hairline)', marginBottom: 8, background: 'var(--bg)' }}>
          <Field label="番号（漢字）">
            <TextInput value={it.n} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, n: v } : x)))} />
          </Field>
          <Field label="英語タイトル">
            <TextInput value={it.en} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, en: v } : x)))} />
          </Field>
          <Field label="日本語タイトル">
            <TextInput value={it.jp} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, jp: v } : x)))} />
          </Field>
          <Field label="リンク先">
            <TextInput value={it.href} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, href: v } : x)))} />
          </Field>
          <Field label="説明">
            <TextInput value={it.desc} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, desc: v } : x)))} />
          </Field>
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} style={removeBtn}>
            このセクションを削除
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { n: '', en: '', jp: '', href: '', desc: '' }])}
        style={addBtn}
      >
        + セクションを追加
      </button>
    </div>
  );
}

export default function HomeEditor({ initial }: { initial: HomeContent }) {
  const router = useRouter();
  const [form, setForm] = useState<HomeContent>(initial);
  const [state, formAction] = useActionState<ActionState<HomeContent>, FormData>(
    saveHome,
    INITIAL_ACTION_STATE as ActionState<HomeContent>,
  );

  function update<K extends keyof HomeContent>(key: K, value: HomeContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // 保存成功時に Server Component を再フェッチして表示を反映。
  // useActionState は毎回新しい state オブジェクトを返すため、state 自体を
  // deps に入れることで 2 回目以降の成功時にも確実に refresh される。
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  const status = state.ok ? 'success' : state.error ? 'error' : 'idle';

  return (
    <form action={formAction}>
      <input type="hidden" name="payload" value={JSON.stringify(form)} />
      <Toolbar
        onCancel={() => setForm(initial)}
        status={status}
        errorMessage={state.error}
      />
      <FieldErrors errors={state.fieldErrors} />
      <TwoPaneLayout
        form={
          <div>
            <Field label="名前（漢字）">
              <TextInput value={form.nameJp} onChange={(v) => update('nameJp', v)} />
            </Field>
            <Field label="名前（英字）">
              <TextInput value={form.nameEn} onChange={(v) => update('nameEn', v)} />
            </Field>
            <Field label="ポートレート画像パス">
              <TextInput value={form.portraitSrc} onChange={(v) => update('portraitSrc', v)} />
            </Field>
            <Field label="ヒーロー左テキスト" hint="改行 \\n を含めると複数行表示">
              <TextArea value={form.heroLeft} onChange={(v) => update('heroLeft', v)} rows={3} />
            </Field>
            <Field label="ヒーロー右テキスト">
              <TextArea value={form.heroRight} onChange={(v) => update('heroRight', v)} rows={3} />
            </Field>
            <Field label="メタ情報（行ごと）">
              <StringListEditor value={form.metaLines} onChange={(v) => update('metaLines', v)} />
            </Field>
            <Field label="CTA ラベル">
              <TextInput value={form.ctaLabel} onChange={(v) => update('ctaLabel', v)} />
            </Field>
            <Field label="CTA リンク先">
              <TextInput value={form.ctaHref} onChange={(v) => update('ctaHref', v)} />
            </Field>
            <Field label="MOTTO 見出し">
              <TextInput value={form.mottoEyebrow} onChange={(v) => update('mottoEyebrow', v)} />
            </Field>
            <Field label="MOTTO タイトル" hint="改行 \\n で複数行">
              <TextArea value={form.mottoTitle} onChange={(v) => update('mottoTitle', v)} rows={2} />
            </Field>
            <Field label="MOTTO 本文">
              <TextArea value={form.mottoBody} onChange={(v) => update('mottoBody', v)} rows={4} />
            </Field>
            <Field label="セクション一覧">
              <IndexItemsEditor value={form.indexItems} onChange={(v) => update('indexItems', v)} />
            </Field>
          </div>
        }
        preview={<HomeView data={form} />}
      />
    </form>
  );
}
