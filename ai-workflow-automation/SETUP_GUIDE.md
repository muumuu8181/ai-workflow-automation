# 🚀 AI自動化ワークフローシステム セットアップガイド

## あなたがやるべき作業（超シンプル）

### 1. GitHubリポジトリ作成（必須）

以下の2つのリポジトリをGitHubで作成してください：

#### A. アプリ要求リスト `app-request-list`
```bash
# GitHubで新しいリポジトリを作成：app-request-list
# publicまたはprivateどちらでもOK
```

#### B. 公開アプリ集 `published-apps`  
```bash
# GitHubで新しいリポジトリを作成：published-apps
# 必ずpublicで作成（GitHub Pages用）
```

### 2. 初期ファイルのアップロード

#### app-request-listに追加：
```bash
git clone https://github.com/[あなたのユーザー名]/app-request-list
cd app-request-list

# このファイルをコピー
cp /mnt/c/Users/user/app-request-list/app-requests.json .
cp /mnt/c/Users/user/app-request-list/README.md .

git add .
git commit -m "初期セットアップ: AI自動化ワークフロー対応"
git push origin main
```

#### published-appsに追加：
```bash
git clone https://github.com/[あなたのユーザー名]/published-apps  
cd published-apps

# このファイルをコピー
cp /mnt/c/Users/user/published-apps/README.md .
cp /mnt/c/Users/user/published-apps/.gitkeep .

git add .
git commit -m "初期セットアップ: AI自動化ワークフロー対応"
git push origin main
```

### 3. GitHub Pages有効化

1. published-appsリポジトリのSettings → Pages
2. Source: Deploy from a branch
3. Branch: main / (root)
4. Save

### 4. 設定ファイル更新

`ai-workflow-automation/configs/external-repo.json`で：
```json
{
  "app_request_repository": {
    "url": "https://github.com/[あなたのユーザー名]/app-request-list"
  }
}
```

### 5. 新端末での実行

```bash
# Claude Code起動
claude

# ワークフロー実行
/wk-st
```

## 日常の使い方

### 新しいアプリを追加したい時
1. `app-request-list/app-requests.json`を編集
2. 新しい要求を追加
3. GitHubにプッシュ
4. 任意の端末で`/wk-st`実行

### 完成したアプリの確認
- `https://[あなたのユーザー名].github.io/published-apps/`
- 各アプリは`app-001-abc123`形式のフォルダ名

## トラブルシューティング

### /wk-stコマンドが見つからない
```bash
# .claude/commandsディレクトリが存在するか確認
ls .claude/commands/wk-st.md
```

### GitHub Pages が表示されない
1. リポジトリがpublicか確認
2. Settings → Pagesで設定確認
3. 5-10分待ってからアクセス

### アプリが生成されない
1. `configs/external-repo.json`のURL確認
2. `app-requests.json`の形式確認
3. GitHubの認証状態確認

## 完了確認チェックリスト

- [ ] app-request-listリポジトリ作成済み
- [ ] published-appsリポジトリ作成済み（public）
- [ ] GitHub Pages有効化済み
- [ ] 初期ファイルアップロード済み
- [ ] `/wk-st`コマンドでテスト実行完了
- [ ] 最初のアプリがWebで確認可能

**🎉 全て完了したら、あとは`/wk-st`コマンドを叩くだけですピヨ！**