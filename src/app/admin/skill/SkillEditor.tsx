'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SkillsContent, SkillCategory, Certification } from '@/types/skill';
import SkillView from '@/app/(use-header)/skill/_components/SkillView';
import {
  Field,
  FieldErrors,
  TextInput,
  TextArea,
  NumberInput,
  StringListEditor,
  Toolbar,
  TwoPaneLayout,
} from '../_components/AdminForm';
import { saveSkills } from '../_actions/skills';
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

function CategoryEditor({
  category,
  onChange,
  onRemove,
}: {
  category: SkillCategory;
  onChange: (c: SkillCategory) => void;
  onRemove: () => void;
}) {
  return (
    <div style={{ padding: 12, border: '1px solid var(--hairline)', marginBottom: 12, background: 'var(--bg)' }}>
      <Field label="漢字（1文字）">
        <TextInput value={category.kanji} onChange={(v) => onChange({ ...category, kanji: v })} />
      </Field>
      <Field label="英語カテゴリ名">
        <TextInput value={category.en} onChange={(v) => onChange({ ...category, en: v })} />
      </Field>
      <div className="t-eyebrow" style={{ marginTop: 12, marginBottom: 8 }}>
        スキル
      </div>
      {category.items.map((s, i) => (
        <div key={i} style={{ padding: 8, border: '1px dashed var(--hairline)', marginBottom: 6 }}>
          <Field label="名称">
            <TextInput
              value={s.name}
              onChange={(v) => onChange({ ...category, items: category.items.map((x, j) => (j === i ? { ...x, name: v } : x)) })}
            />
          </Field>
          <Field label="習熟度 (0-100)">
            <NumberInput
              value={s.level}
              onChange={(v) => onChange({ ...category, items: category.items.map((x, j) => (j === i ? { ...x, level: v } : x)) })}
            />
          </Field>
          <Field label="年数">
            <TextInput
              value={s.years}
              onChange={(v) => onChange({ ...category, items: category.items.map((x, j) => (j === i ? { ...x, years: v } : x)) })}
            />
          </Field>
          <Field label="備考">
            <TextInput
              value={s.note ?? ''}
              onChange={(v) => onChange({ ...category, items: category.items.map((x, j) => (j === i ? { ...x, note: v } : x)) })}
            />
          </Field>
          <button
            type="button"
            onClick={() => onChange({ ...category, items: category.items.filter((_, j) => j !== i) })}
            style={removeBtn}
          >
            このスキルを削除
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange({ ...category, items: [...category.items, { name: '', level: 50, years: '', note: '' }] })
        }
        style={addBtn}
      >
        + スキルを追加
      </button>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
        <button type="button" onClick={onRemove} style={removeBtn}>
          このカテゴリを削除
        </button>
      </div>
    </div>
  );
}

function CertEditor({
  value,
  onChange,
}: {
  value: Certification[];
  onChange: (v: Certification[]) => void;
}) {
  return (
    <div>
      {value.map((c, i) => (
        <div key={i} style={{ padding: 12, border: '1px solid var(--hairline)', marginBottom: 8, background: 'var(--bg)' }}>
          <Field label="名称">
            <TextInput value={c.name} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, name: v } : x)))} />
          </Field>
          <Field label="取得年">
            <TextInput value={c.year} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, year: v } : x)))} />
          </Field>
          <Field label="認定機関">
            <TextInput value={c.org} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, org: v } : x)))} />
          </Field>
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} style={removeBtn}>
            この資格を削除
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, { name: '', year: '', org: '' }])} style={addBtn}>
        + 資格を追加
      </button>
    </div>
  );
}

export default function SkillEditor({ initial }: { initial: SkillsContent }) {
  const router = useRouter();
  const [form, setForm] = useState<SkillsContent>(initial);
  const [state, formAction] = useActionState<ActionState<SkillsContent>, FormData>(
    saveSkills,
    INITIAL_ACTION_STATE as ActionState<SkillsContent>,
  );

  function update<K extends keyof SkillsContent>(key: K, value: SkillsContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

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
            <Field label="紹介文">
              <TextArea value={form.intro} onChange={(v) => update('intro', v)} rows={2} />
            </Field>
            <Field label="カテゴリ">
              {form.categories.map((cat, i) => (
                <CategoryEditor
                  key={i}
                  category={cat}
                  onChange={(c) => update('categories', form.categories.map((x, j) => (j === i ? c : x)))}
                  onRemove={() => update('categories', form.categories.filter((_, j) => j !== i))}
                />
              ))}
              <button
                type="button"
                onClick={() => update('categories', [...form.categories, { kanji: '', en: '', items: [] }])}
                style={addBtn}
              >
                + カテゴリを追加
              </button>
            </Field>
            <Field label="日々の道具">
              <StringListEditor value={form.tools} onChange={(v) => update('tools', v)} />
            </Field>
            <Field label="資格">
              <CertEditor value={form.certifications} onChange={(v) => update('certifications', v)} />
            </Field>
          </div>
        }
        preview={<SkillView data={form} />}
      />
    </form>
  );
}
