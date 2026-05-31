'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Profile, TimelineItem, SnsLink } from '@/types/profile';
import ProfileView from '@/app/(use-header)/profile/_components/ProfileView';
import { Field, TextInput, TextArea, StringListEditor, Toolbar, TwoPaneLayout } from '../_components/AdminForm';

function TimelineEditor({ value, onChange }: { value: TimelineItem[]; onChange: (v: TimelineItem[]) => void }) {
  return (
    <div>
      {value.map((item, i) => (
        <div key={i} style={{ padding: 12, border: '1px solid var(--hairline)', marginBottom: 8, background: 'var(--bg)' }}>
          <Field label="期間">
            <TextInput
              value={item.year}
              onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, year: v } : x)))}
              placeholder="2023.04 — 2026.02"
            />
          </Field>
          <Field label="タイトル">
            <TextInput value={item.label} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, label: v } : x)))} />
          </Field>
          <Field label="備考">
            <TextInput value={item.note} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, note: v } : x)))} />
          </Field>
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} style={removeBtn}>
            この項目を削除
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { year: '', label: '', note: '' }])}
        style={addBtn}
      >
        + タイムライン項目を追加
      </button>
    </div>
  );
}

function SnsEditor({ value, onChange }: { value: SnsLink[]; onChange: (v: SnsLink[]) => void }) {
  return (
    <div>
      {value.map((item, i) => (
        <div key={i} style={{ padding: 12, border: '1px solid var(--hairline)', marginBottom: 8, background: 'var(--bg)' }}>
          <Field label="ラベル">
            <TextInput value={item.label} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, label: v } : x)))} />
          </Field>
          <Field label="表示名 / ハンドル">
            <TextInput value={item.handle} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, handle: v } : x)))} />
          </Field>
          <Field label="URL">
            <TextInput value={item.url} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, url: v } : x)))} />
          </Field>
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} style={removeBtn}>
            この SNS を削除
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { label: '', handle: '', url: '' }])}
        style={addBtn}
      >
        + SNS を追加
      </button>
    </div>
  );
}

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

export default function ProfileEditor({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [form, setForm] = useState<Profile>(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus('idle');
    const res = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setStatus(res.ok ? 'success' : 'error');
    if (res.ok) router.refresh();
  }

  return (
    <>
      <Toolbar onSave={handleSave} onCancel={() => setForm(initial)} saving={saving} status={saving ? 'saving' : status} />
      <TwoPaneLayout
        form={
          <div>
            <Field label="名前（漢字）">
              <TextInput value={form.nameJp} onChange={(v) => update('nameJp', v)} />
            </Field>
            <Field label="名前（英字）">
              <TextInput value={form.nameEn} onChange={(v) => update('nameEn', v)} />
            </Field>
            <Field label="ニックネーム">
              <TextInput value={form.nickname} onChange={(v) => update('nickname', v)} />
            </Field>
            <Field label="ポートレート画像パス">
              <TextInput value={form.portraitSrc} onChange={(v) => update('portraitSrc', v)} />
            </Field>
            <Field label="ヘッドライン">
              <TextInput value={form.headline} onChange={(v) => update('headline', v)} />
            </Field>
            <Field label="自己紹介（段落ごと）">
              {form.bioParagraphs.map((p, i) => (
                <div key={i} style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <TextArea
                    value={p}
                    onChange={(v) => update('bioParagraphs', form.bioParagraphs.map((x, j) => (j === i ? v : x)))}
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={() => update('bioParagraphs', form.bioParagraphs.filter((_, j) => j !== i))}
                    style={removeBtn}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => update('bioParagraphs', [...form.bioParagraphs, ''])} style={addBtn}>
                + 段落を追加
              </button>
            </Field>
            <Field label="学歴">
              <TimelineEditor value={form.education} onChange={(v) => update('education', v)} />
            </Field>
            <Field label="経歴">
              <TimelineEditor value={form.experience} onChange={(v) => update('experience', v)} />
            </Field>
            <Field label="興味のある領域">
              <StringListEditor value={form.interests} onChange={(v) => update('interests', v)} />
            </Field>
            <Field label="SNS">
              <SnsEditor value={form.sns} onChange={(v) => update('sns', v)} />
            </Field>
            <Field label="結びの一文（左）">
              <TextInput value={form.closingLeft} onChange={(v) => update('closingLeft', v)} />
            </Field>
            <Field label="結びの一文（右）">
              <TextInput value={form.closingRight} onChange={(v) => update('closingRight', v)} />
            </Field>
          </div>
        }
        preview={<ProfileView data={form} />}
      />
    </>
  );
}
