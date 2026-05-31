'use client';

import type { ReactNode, CSSProperties } from 'react';

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

export function Toolbar({
  onSave,
  onCancel,
  saving,
  status,
  extra,
}: {
  onSave: () => void;
  onCancel?: () => void;
  saving: boolean;
  status?: 'idle' | 'saving' | 'success' | 'error';
  extra?: ReactNode;
}) {
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
      {status === 'success' ? (
        <span className="t-meta" style={{ color: 'var(--primary)' }}>
          ✓ 保存しました
        </span>
      ) : null}
      {status === 'error' ? (
        <span className="t-meta" style={{ color: '#c33' }}>
          ! 保存に失敗しました
        </span>
      ) : null}
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
