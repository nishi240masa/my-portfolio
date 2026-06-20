'use client';

import type { ReactNode, CSSProperties } from 'react';
import { useFormStatus } from 'react-dom';

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 13, marginBottom: 6, color: 'var(--fg)' }}>{label}</div>
      {children}
      {hint ? (
        <div className="t-meta" style={{ fontSize: 11, marginTop: 4 }}>
          {hint}
        </div>
      ) : null}
    </label>
  );
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  fontFamily: 'inherit',
  fontSize: 13,
  border: '1px solid var(--hairline-strong)',
  background: 'var(--bg)',
  color: 'var(--fg)',
};

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
    />
  );
}

export function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={inputStyle}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
  monospace = false,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  monospace?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      style={{
        ...inputStyle,
        fontFamily: monospace ? 'var(--font-mono, ui-monospace, monospace)' : 'inherit',
        resize: 'vertical',
      }}
    />
  );
}

export function StringListEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      {value.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} style={removeBtn}>
            ×
          </button>
          {i > 0 ? (
            <button
              type="button"
              onClick={() => {
                const next = [...value];
                [next[i - 1], next[i]] = [next[i], next[i - 1]];
                onChange(next);
              }}
              style={removeBtn}
              aria-label="上へ"
            >
              ↑
            </button>
          ) : null}
          {i < value.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                const next = [...value];
                [next[i + 1], next[i]] = [next[i], next[i + 1]];
                onChange(next);
              }}
              style={removeBtn}
              aria-label="下へ"
            >
              ↓
            </button>
          ) : null}
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ''])} style={addBtn}>
        + 追加
      </button>
    </div>
  );
}

const addBtn: CSSProperties = {
  padding: '6px 12px',
  fontSize: 12,
  fontFamily: 'var(--font-mincho)',
  border: '1px dashed var(--hairline-strong)',
  background: 'transparent',
  color: 'var(--fg-muted)',
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

// Toolbar
// - onSave 指定時: 旧パターン (fetch コールバック) — 後方互換
// - onSave 省略時: <form action={...}> 内で type=submit として動作 (Server Action)
//   この場合 saving は useFormStatus().pending で内部判定する
//
// 注: 保存成功時の「✓ 保存しました」自動消失 (3 秒) ロジックは親 Editor 側に持たせる。
// useActionState が返す state object identity を観測する必要があるため Toolbar は
// presentational のまま showOk を受け取るだけにする。
export function Toolbar({
  onSave,
  onCancel,
  saving,
  status,
  showOk,
  extra,
  errorMessage,
}: {
  onSave?: () => void;
  onCancel?: () => void;
  saving?: boolean;
  status?: 'idle' | 'saving' | 'success' | 'error';
  showOk?: boolean;
  extra?: ReactNode;
  errorMessage?: string;
}) {
  const isSubmitMode = !onSave;
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        padding: '12px 0',
        marginBottom: 16,
        borderBottom: '1px solid var(--hairline)',
        background: 'var(--bg)',
      }}
    >
      {isSubmitMode ? (
        <SubmitButton />
      ) : (
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          style={{
            padding: '10px 20px',
            fontFamily: 'var(--font-mincho)',
            fontSize: 13,
            border: '1px solid var(--primary)',
            background: 'var(--primary)',
            color: 'var(--primary-on)',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? '保存中...' : '保存'}
        </button>
      )}
      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            fontFamily: 'var(--font-mincho)',
            fontSize: 13,
            border: '1px solid var(--hairline-strong)',
            background: 'transparent',
            color: 'var(--fg)',
            cursor: 'pointer',
          }}
        >
          破棄
        </button>
      ) : null}
      {extra}
      {status === 'success' && showOk ? (
        <span role="status" aria-live="polite" className="t-meta" style={{ color: 'var(--primary)' }}>
          ✓ 保存しました
        </span>
      ) : null}
      {status === 'error' ? (
        <span className="t-meta" style={{ color: '#c33' }}>
          ! {errorMessage ?? '保存に失敗しました'}
        </span>
      ) : null}
    </div>
  );
}

// useFormStatus は <form> の子孫でしか動作しないため、別コンポーネントに分離。
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: '10px 20px',
        fontFamily: 'var(--font-mincho)',
        fontSize: 13,
        border: '1px solid var(--primary)',
        background: 'var(--primary)',
        color: 'var(--primary-on)',
        cursor: pending ? 'not-allowed' : 'pointer',
        opacity: pending ? 0.6 : 1,
      }}
    >
      {pending ? '保存中...' : '保存'}
    </button>
  );
}

// fieldErrors を表示する小さなヘルパ。
// Server Action の戻り値 (ActionState.fieldErrors) を受けて key ごとに行を作る。
export function FieldErrors({
  errors,
}: {
  errors?: Record<string, string[] | undefined>;
}) {
  if (!errors) return null;
  const entries = Object.entries(errors).filter(([, v]) => v && v.length > 0);
  if (entries.length === 0) return null;
  return (
    <div
      style={{
        marginBottom: 12,
        padding: '10px 12px',
        border: '1px solid #c33',
        background: 'rgba(204,51,51,0.06)',
        color: '#c33',
        fontFamily: 'var(--font-mincho)',
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 4 }}>入力エラー:</div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {entries.map(([key, msgs]) => (
          <li key={key}>
            <code style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)' }}>{key}</code>: {(msgs ?? []).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TwoPaneLayout({
  form,
  preview,
}: {
  form: ReactNode;
  preview: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '420px 1fr',
        gap: 24,
        alignItems: 'start',
      }}
    >
      <div style={{ minWidth: 0 }}>{form}</div>
      <div
        style={{
          minWidth: 0,
          border: '1px solid var(--hairline)',
          background: 'var(--bg-elev)',
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
          position: 'sticky',
          top: 80,
        }}
      >
        <div
          className="t-eyebrow"
          style={{ padding: '12px 16px', borderBottom: '1px solid var(--hairline)', background: 'var(--bg)' }}
        >
          PREVIEW · プレビュー
        </div>
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left', width: '117.6%' }}>{preview}</div>
      </div>
    </div>
  );
}
