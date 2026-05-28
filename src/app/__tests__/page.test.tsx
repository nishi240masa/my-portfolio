/**
 * ルートページのテスト
 * "/" へのアクセスが "/home" にリダイレクトされることを確認する
 */
import { redirect } from 'next/navigation';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Root Page', () => {
  it('should redirect to /home', () => {
    // RootPage を実行するとリダイレクトが呼ばれる
    const { default: RootPage } = jest.requireActual('../page');
    try {
      RootPage();
    } catch {
      // redirect() はエラーをスローするため catch で無視
    }
    expect(redirect).toHaveBeenCalledWith('/home');
  });
});
