# /wk-st コマンド - AI自動ワークフロー実行

## 目標
外部「アプリ要求リスト」から1つのプロジェクトを取得し、自動生成してGitHub Pagesで公開する。

## 実行フロー

### Phase 1: 要求取得・環境準備
```bash
!echo "🚀 AI自動ワークフロー開始..."

# 0. ワークセッション開始・時刻記録
!TERMINAL_ID=$(node scripts/terminal-id-manager.cjs get)
!SESSION_ID=$(node scripts/work-history-manager.cjs start $TERMINAL_ID)
!echo "📝 セッション開始: $SESSION_ID"
!node scripts/work-history-manager.cjs log $SESSION_ID "ワークフロー開始" info

# 1. 外部リポジトリから要求リスト取得
!node scripts/work-history-manager.cjs log $SESSION_ID "外部リポジトリ取得開始" info
!git clone https://github.com/muumuu8181/app-request-list ./temp-requests 2>/dev/null || git -C ./temp-requests pull
!node scripts/work-history-manager.cjs log $SESSION_ID "外部リポジトリ取得完了" info

# 1.5. Markdown→JSON変換（各AI個別実行）
!node scripts/work-history-manager.cjs log $SESSION_ID "Markdown→JSON変換開始" info
!node scripts/md-to-json-converter.cjs ./temp-requests/app-requests.md ./temp-requests/app-requests.json
!node scripts/work-history-manager.cjs log $SESSION_ID "Markdown→JSON変換完了" info

# 2. 最新アプリ番号取得
!node scripts/work-history-manager.cjs log $SESSION_ID "アプリ番号取得開始" info
!node scripts/app-number-manager.js https://github.com/muumuu8181/published-apps
!node scripts/work-history-manager.cjs log $SESSION_ID "アプリ番号取得完了" info

# 3. 乱数識別子生成  
!node scripts/work-history-manager.cjs log $SESSION_ID "識別子生成開始" info
!node scripts/random-identifier.js generate
!node scripts/work-history-manager.cjs log $SESSION_ID "識別子生成完了" info
```

### Phase 2: 要求解析・プロジェクト選択
- `./temp-requests/app-requests.json`からプロジェクト要求を読み込み
- 優先度判定ルールに基づき次のプロジェクトを選択：
  - 「最優先」「urgent」「高優先度」「ASAP」キーワード検索
  - 見つからない場合は上から順番の未완了項目
- 完了済みプロジェクトとの照合（`configs/completed-projects.json`）

### Phase 3: アプリ生成・開発
```bash
# 3.1. プロジェクト選択ログ
!node scripts/work-history-manager.cjs log $SESSION_ID "プロジェクト選択: {選択されたアプリ名}" info

# 3.2. アプリ生成開始
!node scripts/work-history-manager.cjs log $SESSION_ID "アプリ生成開始" info
```

選択されたプロジェクト要求に基づき：

1. **技術スタック決定**
   - 要件に応じてHTML/CSS/JS、Node.js、Python等を選択
   - 確実性重視：基本は静的HTML

2. **コード生成**
   - Google Gemini CLI使用
   - テンプレートベースの高速開発
   - 要件を満たす最小限の実装
   
3. **基本動作確認**（軽微テストのみ）
   - HTMLファイルの構文チェック
   - 基本動作の簡易確認
   - ❗ エラーがあってもアップロード継続

```bash
# 3.3. アプリ生成完了ログ
!node scripts/work-history-manager.cjs log $SESSION_ID "アプリ生成完了: {アプリID}" info
```

### Phase 4: GitHub Pages公開（最重要）
```bash
# 4.1. デプロイ開始ログ
!node scripts/work-history-manager.cjs log $SESSION_ID "GitHub Pages デプロイ開始" info

# 4.2. published-appsリポジトリ準備
!git clone https://github.com/muumuu8181/published-apps ./temp-published 2>/dev/null || echo "新規リポジトリ作成予定"

# 4.3. アプリフォルダ作成・ファイル配置
!mkdir -p ./temp-published/app-{番号}-{識別子}
!node scripts/work-history-manager.cjs log $SESSION_ID "アプリフォルダ作成完了" info

# 4.4. GitHub Pages有効化確認・設定
!cd ./temp-published && git config --local user.name "AI Workflow" && git config --local user.email "noreply@ai-workflow.com"

# 4.5. コミット・プッシュ
!node scripts/work-history-manager.cjs log $SESSION_ID "GitHubプッシュ開始" info
!cd ./temp-published && git add . && git commit -m "Add app-{番号}-{識別子}: {アプリ名}" && git push origin main
!node scripts/work-history-manager.cjs log $SESSION_ID "GitHubプッシュ完了" info

# 4.6. GitHub Pages反映確認
!echo "✅ 公開URL: https://muumuu8181.github.io/published-apps/app-{番号}-{識別子}/"
!node scripts/work-history-manager.cjs log $SESSION_ID "GitHub Pages公開完了" info
```

### Phase 5: 完了処理・次回準備
```bash
# 5.1. 完了プロジェクト記録
!node scripts/work-history-manager.cjs log $SESSION_ID "完了処理開始" info
!echo "Updating completed projects list..."

# 5.2. アプリ一覧更新（README.md）
!echo "Updating app registry..."
!node scripts/work-history-manager.cjs log $SESSION_ID "アプリ一覧更新完了" info

# 5.3. 一時ファイル削除
!rm -rf ./temp-requests ./temp-published
!node scripts/work-history-manager.cjs log $SESSION_ID "一時ファイル削除完了" info

# 5.4. 端末完了記録
!node scripts/terminal-id-manager.cjs complete {アプリID} "{アプリ名}"

# 5.5. ワークセッション完了・時刻記録
!node scripts/work-history-manager.cjs complete $SESSION_ID {アプリID} "{アプリ名}" success
!echo "🎉 ワークフロー完了! 次回は /wk-st で次のプロジェクトを実行"

# 5.6. 作業統計表示
!node scripts/work-history-manager.cjs stats
```

## エラーハンドリング
- **外部リポジトリ接続失敗** → ローカルキャッシュで継続
- **テスト失敗** → ログ記録してアップロード継続  
- **GitHub Push失敗** → 再試行後、手動プッシュ手順表示
- **全プロジェクト完了** → "全タスク完了"メッセージ

## 設定ファイル参照
- `configs/external-repo.json`: 外部リポジトリURL
- `configs/completed-projects.json`: 完了管理
- `templates/`: アプリテンプレート集

## 成功基準
✅ 外部要求リストから適切なプロジェクト取得
✅ 重複しないアプリID生成  
✅ Webページとしてアクセス可能
✅ GitHub Pagesで正常表示
✅ 次回実行準備完了

**最重要**: どんなエラーが発生してもGitHub Pages公開まで到達すること!