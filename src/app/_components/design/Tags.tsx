/** タグ列 */
export default function TagList({ tags, solid = false }: { tags: string[]; solid?: boolean }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {tags.map((t) => (
        <span key={t} className={'tag' + (solid ? ' solid' : '')}>
          {t}
        </span>
      ))}
    </div>
  );
}
