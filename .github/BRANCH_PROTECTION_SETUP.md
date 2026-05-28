# ブランチ保護ルールの設定手順

テストが通らないとmainブランチにマージできないようにするための設定手順です。

## 設定手順

1. **GitHubリポジトリのSettings に移動**
   - リポジトリのページで `Settings` タブをクリック

2. **Branches セクションに移動**
   - 左サイドバーの `Code and automation` セクションから `Branches` をクリック

3. **ブランチ保護ルールを追加**
   - `Branch protection rules` の `Add branch protection rule` ボタンをクリック

4. **ルールを設定**

   **Branch name pattern:**
   ```
   main
   ```

   **以下のオプションにチェックを入れる:**

   - ✅ **Require a pull request before merging**
     - PRを必須にする
     - オプション: `Require approvals` のチェックを外す（1人開発の場合）

   - ✅ **Require status checks to pass before merging**
     - テストが通らないとマージできなくする
     - `Require branches to be up to date before merging` にチェック
     - **Status checks that are required** に以下を追加:
       - `test` （testワークフローのjob名）

     > 注: Status checks は初回のPR/Pushでワークフローが実行された後に選択可能になります

   - ✅ **Do not allow bypassing the above settings**
     - 管理者でもルールをバイパスできないようにする（推奨）

5. **保存**
   - `Create` ボタンをクリックして設定を保存

## Status Checks が表示されない場合

初回は Status checks のリストが空の場合があります。以下の手順で表示されるようになります：

1. 任意のブランチを作成して、mainブランチへのPRを作成
2. GitHub Actions でテストワークフローが実行されるのを待つ
3. ワークフローが実行されたら、ブランチ保護ルールの編集画面に戻る
4. `test` が Status checks のリストに表示されるようになる
5. `test` を選択して保存

## 確認方法

設定が正しく機能しているか確認するには：

1. 新しいブランチを作成
2. 何かしらの変更をコミット
3. mainブランチへのPRを作成
4. テストが実行され、緑のチェックマークが表示される
5. テストが失敗した場合、`Merge pull request` ボタンが無効になることを確認

## Cloudflare Pages のデプロイ設定

デプロイワークフローに必要なシークレットを設定：

1. リポジトリの `Settings` > `Secrets and variables` > `Actions` に移動
2. `New repository secret` をクリックして以下を追加：

   - **Name:** `CLOUDFLARE_API_TOKEN`
     - **Value:** Cloudflare APIトークン
     - 取得方法: Cloudflare Dashboard > Profile > API Tokens > Create Token

   - **Name:** `CLOUDFLARE_ACCOUNT_ID`
     - **Value:** CloudflareアカウントID
     - 取得方法: Cloudflare Dashboard > Overview > Account ID

## 参考

- [GitHub Docs - Branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions - Status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
