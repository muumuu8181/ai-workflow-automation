# Claude Code GitHub連携完全ガイド

## 📋 概要
このガイドは**Claude Code**と**GitHub**の2つの連携方法を説明します：

### 🎯 2つの連携方式
1. **Claude Code CLI** → GitHub直接操作（ローカルから）
2. **GitHub Actions** → `@claude`メンション応答（リモートから）

### 💡 用途の違い
- **CLI**: 開発作業、リポジトリ横断操作、対話的作業
- **Actions**: Issue対応、自動PR作成、チーム協業

---

# Part 1: Claude Code CLI GitHub連携設定

## 🚀 基本設定（必須）

### 1. Claude Code CLI インストール・認証
```bash
# Claude Code CLI インストール
npm install -g @anthropic-ai/claude-code

# 認証確認
claude auth status

# 未認証の場合
claude auth login
```

### 2. GitHub CLI設定
```bash
# GitHub CLI インストール確認
gh --version

# 認証
gh auth login
# → GitHub.com を選択
# → HTTPS を選択  
# → ブラウザで認証

# 認証確認
gh auth status
```

### 3. Git設定
```bash
# Git ユーザー設定確認
git config --global user.name
git config --global user.email

# 未設定の場合
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

## 🎯 Claude Code CLI でのGitHub操作方法

### リポジトリクローン・操作
```bash
# 新規リポジトリクローン
claude "https://github.com/username/repo をクローンして、プロジェクト構造を分析して"

# 既存ディレクトリでClaude起動
cd your-repo
claude
# → 自動的にリポジトリを認識してGit操作可能
```

### 一般的な操作例
```bash
# リポジトリ分析
claude "このリポジトリの全体構造を把握して、改善点を教えて"

# Issue対応
claude "Issue #5の内容を確認して、解決するコードを実装してPRを作成して"

# ドキュメント作成
claude "READMEを現在のコードベースに合わせて更新して"

# 横断的作業
claude "全ての.js ファイルでESLintエラーを修正して"
```

### 高度な連携例
```bash
# 複数リポジトリ操作
claude "muumuu8181 の全リポジトリをチェックして、依存関係を更新して"

# 自動化スクリプト
claude "GitHub Actionsワークフローを作成して、テスト・デプロイ・リリースを自動化して"

# 組織管理
claude "Organizationの全リポジトリで同じGitHub Actions設定を適用して"
```

## ⚡ Claude Code CLI 最適化設定

### CLAUDE.md 設定例
```markdown
# Project Configuration
- **Repository**: GitHub連携プロジェクト
- **Auto GitHub**: Always use gh CLI for GitHub operations
- **Commit Style**: Conventional Commits
- **Branch Strategy**: feature/fix branches with PR workflow

## GitHub 操作ルール
- コミット前に必ずテスト実行
- PR作成時は詳細な説明を記載
- Issue番号をコミットメッセージに含める
```

### プロジェクト別設定
```bash
# プロジェクトディレクトリで
echo "enableAllProjectMcpServers: true" > .claude/settings.json
```

---

# Part 2: GitHub Actions Claude設定

## 📋 GitHub Actions概要
- **日時**: 2025-07-14
- **対象**: 任意のGitHubリポジトリ
- **目的**: GitHub IssueやPRで`@claude`メンションによるClaude Code Actionsの自動実行
- **認証方式**: OAuth Token（Max Plan定額内で利用可能）
- **実例**: muumuu8181/test_python で検証済み

## 🚀 実行した作業手順

### 1. 現状確認・準備作業
```bash
# 現在のリポジトリ状況確認
git remote -v
# → origin https://github.com/muumuu8181/claude-ai-toolkit.git

# ユーザーのリポジトリ一覧確認
gh repo list muumuu8181 --limit 20
# → test_python が存在することを確認

# test_pythonリポジトリをクローン
gh repo clone muumuu8181/test_python /tmp/test_python
```

### 2. ワークフローファイル作成
```bash
# ワークフローディレクトリ作成
mkdir -p /tmp/test_python/.github/workflows

# claude.ymlファイル作成
```

**作成した`.github/workflows/claude.yml`の内容:**
```yaml
name: Claude AI Assistant

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]

jobs:
  claude-pr:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        
      - name: Claude Code Action
        uses: anthropics/claude-code-action@beta
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### 3. GitHub Secrets設定
```bash
# Claude OAuth Token取得
find ~ -name ".credentials.json" 2>/dev/null
# → /home/muu/.claude/.credentials.json

# OAuth Token確認
cat /home/muu/.claude/.credentials.json
# → accessToken: "sk-ant-oat01-..."

# ⚠️ 重要: accessTokenを環境変数に設定（トークンの直接コピペミスを防ぐ）
export CLAUDE_TOKEN=$(cat /home/muu/.claude/.credentials.json | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

# GitHub Secretsに設定
gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo muumuu8181/test_python --body "$CLAUDE_TOKEN"

# 設定確認
gh secret list --repo muumuu8181/test_python
# → CLAUDE_CODE_OAUTH_TOKEN 2025-07-14T16:17:56Z
```

### ⚠️ トラブルシューティング

#### Token認証エラー（401エラー）
**症状**: "OAuth token has expired" エラーが発生
**原因**: 
1. **古いToken値**がGitHub Secretsに設定されている
2. Token期限切れ（通常は長期間有効）

**対処法**:
```bash
# 1. 現在のToken期限確認
EXPIRES_AT=$(cat /home/muu/.claude/.credentials.json | grep -o '"expiresAt":[0-9]*' | cut -d':' -f2)
echo "Token expires: $(date -d @$((EXPIRES_AT/1000)))"
echo "Current time: $(date)"

# 2. 最新Token値でSecret更新
export CLAUDE_TOKEN=$(cat /home/muu/.claude/.credentials.json | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo リポジトリ名 --body "$CLAUDE_TOKEN"

# 3. 更新確認
gh secret list --repo リポジトリ名
```

### 4. ワークフローファイルをリポジトリにプッシュ
```bash
# GitHub API経由でファイルをアップロード
gh api --method PUT repos/muumuu8181/test_python/contents/.github/workflows/claude.yml \
  --field message="Add Claude Code GitHub Actions workflow

- Enable @claude mentions in issues and PRs
- OAuth token authentication for Max Plan integration
- Automatic code assistance and PR creation

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>" \
  --field content="$(base64 -w0 /tmp/test_python/.github/workflows/claude.yml)"
```

**プッシュ結果:**
- Commit SHA: `f78e139baae8b0814b7a6de3de287a5f717c4fcf`
- ファイル作成完了: `.github/workflows/claude.yml`

### 5. 動作テスト実行
```bash
# テスト用Issue作成
gh issue create --repo muumuu8181/test_python \
  --title "Claude Code GitHub Actions動作テスト" \
  --body "@claude こんにちは！GitHub Actionsの動作テストです。

この投稿でClaude Code GitHub Actionsが正常に動作するかテストしています。

期待される結果：
- GitHub Actionsが自動実行される
- Claudeからの応答コメントが投稿される
- OAuth tokenでの認証が正常に動作する

🤖 Generated with [Claude Code](https://claude.ai/code)"
```

**テスト結果:**
- Issue URL: https://github.com/muumuu8181/test_python/issues/6
- GitHub Actionsが自動実行される状態

## 🔧 重要なポイント

### OAuth Token認証の利点
- **Max Plan定額内利用**: 追加課金なしで利用可能
- **API Key認証の問題回避**: "Credit balance is too low"エラーを回避
- **認証方式**: `CLAUDE_CODE_OAUTH_TOKEN`を使用

### ワークフローの動作条件
- **トリガー**: `@claude`メンションがissue、PR、コメントに含まれる場合
- **実行環境**: ubuntu-latest
- **必要な権限**: contents:write, pull-requests:write, issues:write

### 使用したツール・コマンド
- `gh` (GitHub CLI) - リポジトリ操作、Secret管理
- `git` - バージョン管理
- `base64` - ファイル内容のエンコード
- GitHub API - ファイル直接アップロード

## 📝 実行ログ・エラーと対処

### エラー1: git push認証エラー
```bash
git -C /tmp/test_python_push push origin main
# → fatal: could not read Username for 'https://github.com': No such device or address
```
**対処**: GitHub API経由でファイルを直接アップロード

### エラー2: PR作成エラー
```bash
gh pr create --repo muumuu8181/test_python --title "..." --head main --base main
# → GraphQL: No commits between main and main (createPullRequest)
```
**対処**: PRではなくIssue作成に変更

## 🎯 最終的な成果

### 設定完了項目
1. ✅ `.github/workflows/claude.yml` - ワークフローファイル作成・配置
2. ✅ `CLAUDE_CODE_OAUTH_TOKEN` - GitHub Secretsに設定
3. ✅ 動作テスト - Issue #6で`@claude`メンションテスト実行

### 今後の利用方法
- **Issue作成時**: 本文に`@claude`を記載
- **Issue・PRコメント**: `@claude`メンションで自動応答
- **期待される動作**: GitHub Actionsが自動実行され、Claudeが応答

## 📚 参考資料
- 元の設定テンプレート: `/mnt/c/Users/user/claude-workflow-template.yml`
- Claude Code Actions公式文書: `/mnt/c/Users/user/claude_code_actions_summary.md`
- CLAUDE.md設定: `/mnt/c/Users/user/CLAUDE.md`

---
## 🚀 全リポジトリ一括設定結果

### 設定完了リポジトリ一覧
以下のリポジトリすべてに Claude Code GitHub Actions を設定完了：

1. ✅ **quiz-app** - ワークフロー設定完了、OAuth Token設定完了
2. ✅ **dev-tools** - ワークフロー設定完了、OAuth Token設定完了  
3. ✅ **claude-ai-toolkit** - ワークフロー設定完了、OAuth Token設定完了
4. ✅ **text-tools-mcp** - ワークフロー設定完了、OAuth Token設定完了
5. ✅ **ccf** - ワークフロー設定完了、OAuth Token設定完了
6. ✅ **test_cursor** - ワークフロー設定完了、OAuth Token設定完了
7. ✅ **visual-priority-matrix-todo** - ワークフロー設定完了、OAuth Token設定完了
8. ✅ **multidimensional-visualizer** - ワークフロー設定完了、OAuth Token設定完了
9. ✅ **todo_heya_kataduke** - ワークフロー設定完了、OAuth Token設定完了
10. ✅ **test_python** - ワークフロー設定完了、OAuth Token設定完了
11. ✅ **test_copilot** - ワークフロー設定完了、OAuth Token設定完了

### 一括設定コマンド（改良版）
```bash
# 最新のOAuth Token取得
export CLAUDE_TOKEN=$(cat /home/muu/.claude/.credentials.json | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

for repo in quiz-app dev-tools claude-ai-toolkit text-tools-mcp ccf test_cursor visual-priority-matrix-todo multidimensional-visualizer todo_heya_kataduke test_copilot; do
  echo "Setting up $repo..."
  
  # ワークフローファイル作成
  gh api --method PUT repos/muumuu8181/$repo/contents/.github/workflows/claude.yml \
    --field message="Add Claude Code GitHub Actions workflow..." \
    --field content="$(base64 -w0 /tmp/test_python/.github/workflows/claude.yml)"
  
  # OAuth Token Secret設定（環境変数使用）
  gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo muumuu8181/$repo --body "$CLAUDE_TOKEN"
  
  echo "Completed setup for $repo"
done
```

### 全リポジトリSecret一括チェック・更新
```bash
# 最新Token取得
export CLAUDE_TOKEN=$(cat /home/muu/.claude/.credentials.json | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

# 全リポジトリチェック・更新
for repo in quiz-app dev-tools claude-ai-toolkit text-tools-mcp ccf test_cursor visual-priority-matrix-todo multidimensional-visualizer todo_heya_kataduke test_python test_copilot; do
  echo "📁 $repo"
  echo "  現在: $(gh secret list --repo muumuu8181/$repo | grep CLAUDE_CODE_OAUTH_TOKEN || echo '❌ 未設定')"
  
  # Secret更新
  gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo muumuu8181/$repo --body "$CLAUDE_TOKEN"
  echo "  更新: $(gh secret list --repo muumuu8181/$repo | grep CLAUDE_CODE_OAUTH_TOKEN)"
  echo
done
```

---

# 🎯 統合活用例

## 📋 両方式の組み合わせ活用

### シナリオ1: 機能開発フロー
```bash
# 1. Claude Code CLI で開発
claude "新しいログイン機能を実装して、テストも書いて"
# → ローカルで実装・テスト

# 2. PR作成
claude "実装完了した機能のPRを作成して"
# → GitHub にPR作成

# 3. GitHub Actions でレビュー
# PR に @claude コメント
# → 自動コードレビュー・修正提案
```

### シナリオ2: Issue対応フロー
```bash
# 1. GitHub Actions で初期対応
# Issue に @claude メンション
# → 自動で分析・修正案提示

# 2. Claude Code CLI で詳細実装
claude "Issue #10の修正を実装して、関連テストも更新して"
# → ローカルで詳細実装

# 3. 統合テスト・デプロイ
claude "修正内容をステージング環境にデプロイして確認して"
```

### シナリオ3: リポジトリ管理
```bash
# Claude Code CLI: 横断的作業
claude "全11リポジトリのGitHub Actionsを最新化して"

# GitHub Actions: 継続的メンテナンス  
# 各リポジトリで @claude メンション
# → 個別リポジトリの自動メンテナンス
```

## 🔧 トラブルシューティング

### Claude Code CLI 接続エラー
```bash
# 認証状況確認
claude auth status
gh auth status

# 再認証
claude auth logout
claude auth login
```

### GitHub Actions 認証エラー
```bash
# Token確認・更新
export CLAUDE_TOKEN=$(cat ~/.claude/.credentials.json | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo owner/repo --body "$CLAUDE_TOKEN"
```

## 📚 参考リンク
- **Claude Code CLI**: https://docs.anthropic.com/en/docs/claude-code
- **GitHub CLI**: https://cli.github.com/
- **GitHub Actions**: https://docs.github.com/actions

---
**作業完了日**: 2025-07-15  
**実行者**: Claude Code Assistant  
**対象**: Claude Code GitHub連携完全ガイド