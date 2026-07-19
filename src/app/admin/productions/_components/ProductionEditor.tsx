'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef, useState } from 'react';
import dynamicImport from 'next/dynamic';
import type { CSSProperties } from 'react';
import type { CaseStudy, CaseStudyLink, CaseStudyMetric, PostPage } from '@/types/post';
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
import { useAutoDismissOnSuccess } from '../../_hooks/useAutoDismissOnSuccess';

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
    // caseStudy は optional — 既定は未定義（バッジが「ノート」になる）
  };
}

function emptyCaseStudy(): CaseStudy {
  return {
    role: '',
    period: '',
    teamSize: undefined,
    stack: [],
    problem: '',
    approach: '',
    result: '',
    metrics: [],
    links: [],
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
  const showOk = useAutoDismissOnSuccess(state);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // caseStudy 内のフィールドを部分更新する
  function updateCS<K extends keyof CaseStudy>(key: K, value: CaseStudy[K]) {
    setForm((prev) => {
      const base = prev.caseStudy ?? emptyCaseStudy();
      return { ...prev, caseStudy: { ...base, [key]: value } };
    });
  }

  function enableCaseStudy() {
    setForm((prev) => ({ ...prev, caseStudy: prev.caseStudy ?? emptyCaseStudy() }));
  }

  function disableCaseStudy() {
    if (!confirm('ケーススタディ定義を削除します。よろしいですか？')) return;
    setForm((prev) => {
      const { caseStudy: _drop, ...rest } = prev;
      void _drop;
      return rest;
    });
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

            <CaseStudySection
              caseStudy={form.caseStudy}
              onEnable={enableCaseStudy}
              onDisable={disableCaseStudy}
              onUpdate={updateCS}
            />
          </div>
        }
        preview={
          <article style={{ padding: 24 }}>
            <div className="t-eyebrow" style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span>{form.date} · WORK</span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  fontFamily: 'var(--font-mincho)',
                  border: '1px solid var(--hairline-strong)',
                  background: form.caseStudy ? 'var(--fg)' : 'transparent',
                  color: form.caseStudy ? 'var(--bg)' : 'var(--fg-muted)',
                }}
              >
                {form.caseStudy ? 'ケーススタディ' : 'ノート'}
              </span>
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

// ケーススタディセクション
// <details>/<summary> で折り畳み可能。Editor 本体から分離しておくことで
// 折り畳みの開閉状態（DOM 側で保持）と form state を独立させる。
function CaseStudySection({
  caseStudy,
  onEnable,
  onDisable,
  onUpdate,
}: {
  caseStudy: CaseStudy | undefined;
  onEnable: () => void;
  onDisable: () => void;
  onUpdate: <K extends keyof CaseStudy>(key: K, value: CaseStudy[K]) => void;
}) {
  return (
    <details
      open={caseStudy != null}
      style={{
        marginTop: 24,
        padding: 0,
        border: '1px solid var(--hairline)',
        background: 'var(--bg-elev)',
      }}
    >
      <summary
        style={{
          padding: '10px 14px',
          fontFamily: 'var(--font-mincho)',
          fontSize: 13,
          cursor: 'pointer',
          listStyle: 'revert',
          background: 'var(--bg)',
          borderBottom: caseStudy != null ? '1px solid var(--hairline)' : 'none',
        }}
      >
        ケーススタディ {caseStudy != null ? '(有効)' : '(未設定)'}
      </summary>
      <div style={{ padding: 16 }}>
        {caseStudy == null ? (
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 12, lineHeight: 1.6 }}>
              役割・問・工・果・指標・参照リンクを定義すると、詳細ページに「ケーススタディ」として
              表示されます。最低限 role / problem / result の入力が必要です。
            </div>
            <button
              type="button"
              onClick={onEnable}
              style={addBtnPrimary}
            >
              + ケーススタディを有効化
            </button>
          </div>
        ) : (
          <CaseStudyFields cs={caseStudy} onUpdate={onUpdate} onDisable={onDisable} />
        )}
      </div>
    </details>
  );
}

function CaseStudyFields({
  cs,
  onUpdate,
  onDisable,
}: {
  cs: CaseStudy;
  onUpdate: <K extends keyof CaseStudy>(key: K, value: CaseStudy[K]) => void;
  onDisable: () => void;
}) {
  return (
    <div>
      <Field label="役割 (role) ※必須">
        <TextInput value={cs.role} onChange={(v) => onUpdate('role', v)} placeholder="フルスタック / 設計" />
      </Field>
      <Field label="期間 (period)">
        <TextInput value={cs.period} onChange={(v) => onUpdate('period', v)} placeholder="2024-04 〜 2024-06" />
      </Field>
      <Field label="チーム規模 (teamSize)" hint="任意。個人開発なら空欄でも可">
        <TextInput
          value={cs.teamSize ?? ''}
          onChange={(v) => onUpdate('teamSize', v === '' ? undefined : v)}
          placeholder="3名"
        />
      </Field>
      <Field label="スタック (stack)">
        <StringListEditor value={cs.stack} onChange={(v) => onUpdate('stack', v)} placeholder="Next.js" />
      </Field>
      <Field label="問 · 問題 (problem) ※必須" hint="解決すべき課題・前提">
        <TextArea value={cs.problem} onChange={(v) => onUpdate('problem', v)} rows={4} />
      </Field>
      <Field label="工 · アプローチ (approach)" hint="どう設計・実装したか">
        <TextArea value={cs.approach} onChange={(v) => onUpdate('approach', v)} rows={4} />
      </Field>
      <Field label="果 · 結果 (result) ※必須" hint="得られた成果・学び">
        <TextArea value={cs.result} onChange={(v) => onUpdate('result', v)} rows={4} />
      </Field>

      <Field label="定量指標 (metrics)" hint="label / value のペア">
        <MetricsEditor
          value={cs.metrics}
          onChange={(v) => onUpdate('metrics', v)}
        />
      </Field>
      <Field label="参照リンク (links)" hint="label / url (URL は http/https)">
        <LinksEditor
          value={cs.links}
          onChange={(v) => onUpdate('links', v)}
        />
      </Field>

      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed var(--hairline)' }}>
        <button type="button" onClick={onDisable} style={dangerBtn}>
          ケーススタディを削除
        </button>
      </div>
    </div>
  );
}

// metrics は UI 上で最大 4 件まで (ticket 実装ポイント)。上限は Editor UI のみで、
// 永続スキーマ (production.ts) には制約を足さない — 既存データ互換のため。
const METRICS_MAX = 4;

// クライアント側の安定 id を各行に採番するフック。
// key に配列 index を使うと途中行の削除で React が別行の DOM/state を再利用し、
// 入力中のフォーカスや値がずれる。id を data と分離して持つことでこれを防ぐ。
// 初期化は props から一度だけ (CaseStudyFields は disable 時にアンマウントされ、
// 再有効化時は空配列で remount されるため stale にならない)。
function useKeyedRows<T>(value: T[], onChange: (v: T[]) => void) {
  const counter = useRef(0);
  const [rows, setRows] = useState<{ id: number; data: T }[]>(() =>
    value.map((data) => ({ id: counter.current++, data })),
  );
  const commit = (next: { id: number; data: T }[]) => {
    setRows(next);
    onChange(next.map((r) => r.data));
  };
  return {
    rows,
    add: (data: T) => commit([...rows, { id: counter.current++, data }]),
    remove: (i: number) => commit(rows.filter((_, j) => j !== i)),
    patch: (i: number, partial: Partial<T>) =>
      commit(rows.map((r, j) => (j === i ? { ...r, data: { ...r.data, ...partial } } : r))),
  };
}

function MetricsEditor({
  value,
  onChange,
}: {
  value: CaseStudyMetric[];
  onChange: (v: CaseStudyMetric[]) => void;
}) {
  const { rows, add, remove, patch } = useKeyedRows(value, onChange);
  const atMax = rows.length >= METRICS_MAX;
  return (
    <div>
      {rows.map((r, i) => (
        <div
          key={r.id}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 6, marginBottom: 6 }}
        >
          <input
            type="text"
            value={r.data.label}
            placeholder="ラベル (例: PV)"
            onChange={(e) => patch(i, { label: e.target.value })}
            style={pairInputStyle}
          />
          <input
            type="text"
            value={r.data.value}
            placeholder="値 (例: +35%)"
            onChange={(e) => patch(i, { value: e.target.value })}
            style={pairInputStyle}
          />
          <button type="button" onClick={() => remove(i)} style={removeBtn}>
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => add({ label: '', value: '' })}
        disabled={atMax}
        style={atMax ? { ...addBtn, opacity: 0.5, cursor: 'not-allowed' } : addBtn}
      >
        + 指標を追加
      </button>
      {atMax ? (
        <p style={{ margin: '6px 0 0', fontSize: 11, color: 'var(--fg-muted)' }}>
          最大 {METRICS_MAX} 件まで
        </p>
      ) : null}
    </div>
  );
}

function LinksEditor({
  value,
  onChange,
}: {
  value: CaseStudyLink[];
  onChange: (v: CaseStudyLink[]) => void;
}) {
  const { rows, add, remove, patch } = useKeyedRows(value, onChange);
  return (
    <div>
      {rows.map((r, i) => (
        <div
          key={r.id}
          style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 6, marginBottom: 6 }}
        >
          <input
            type="text"
            value={r.data.label}
            placeholder="ラベル"
            onChange={(e) => patch(i, { label: e.target.value })}
            style={pairInputStyle}
          />
          <input
            type="url"
            value={r.data.url}
            placeholder="https://..."
            onChange={(e) => patch(i, { url: e.target.value })}
            style={pairInputStyle}
          />
          <button type="button" onClick={() => remove(i)} style={removeBtn}>
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={() => add({ label: '', url: '' })} style={addBtn}>
        + リンクを追加
      </button>
    </div>
  );
}

const pairInputStyle: CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  fontFamily: 'inherit',
  fontSize: 13,
  border: '1px solid var(--hairline-strong)',
  background: 'var(--bg)',
  color: 'var(--fg)',
};

const addBtn: CSSProperties = {
  padding: '6px 12px',
  fontSize: 12,
  fontFamily: 'var(--font-mincho)',
  border: '1px dashed var(--hairline-strong)',
  background: 'transparent',
  color: 'var(--fg-muted)',
  cursor: 'pointer',
};

const addBtnPrimary: CSSProperties = {
  padding: '8px 14px',
  fontSize: 12,
  fontFamily: 'var(--font-mincho)',
  border: '1px solid var(--primary)',
  background: 'var(--primary)',
  color: 'var(--primary-on)',
  cursor: 'pointer',
};

const removeBtn: CSSProperties = {
  padding: '0 10px',
  fontSize: 14,
  border: '1px solid var(--hairline)',
  background: 'transparent',
  color: 'var(--fg-muted)',
  cursor: 'pointer',
};

const dangerBtn: CSSProperties = {
  padding: '6px 12px',
  fontSize: 12,
  fontFamily: 'var(--font-mincho)',
  border: '1px solid #c33',
  background: 'transparent',
  color: '#c33',
  cursor: 'pointer',
};
