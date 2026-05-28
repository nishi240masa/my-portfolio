import { redirect } from 'next/navigation';

/**
 * ルート "/" へのアクセスは "/home" へリダイレクト
 * ヘッダー付きレイアウトグループ (use-header) が適用されます
 */
export default function RootPage() {
  redirect('/home');
}
