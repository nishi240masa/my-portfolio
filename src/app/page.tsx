import WafuuButton from "./_components/WafuuButton";
import WagaraBox from "./_components/WagaraBox";

// app/page.tsx
export default function Home() {
  return (
    <main>
      <WagaraBox />
      {/* クライアントコンポーネントはサーバーコンポーネントから使用可能 */}
      <WafuuButton />
    </main>
  );
}
