# Claude Code仕様情報 信頼度別まとめ

## 🟢 ほぼ確実（公式・信頼度高）

### 公式仕様（第2弾追加）
**認証オプション**
- Anthropic API
- AWS Bedrock  
- Google Vertex AI

**セキュリティ機能**
- 明示的許可システム（dangerous commands対策）
- コンテキスト分析でmalicious instructions検出
- 入力サニタイゼーション
- コマンドブロックリスト

**コスト管理**
- トークン消費ベース課金
- 開発者1人あたり1日5-10ドル推定
- `/cost`、`/compact`コマンドで費用管理

### CLAUDE.md詳細仕様（第3弾追加）
**推奨構造**
```markdown
# Bash commands  
- npm run build: Build the project
- npm run typecheck: Run the typechecker

# Code style
- Use ES modules syntax
- Destructure imports when possible
```

**配置場所**
- リポジトリルート
- ホームフォルダ
- プロジェクト固有の場所

### GitHub Actions公式仕様（第3弾追加）
**認証方法4種**
- Anthropic API key
- Claude Code OAuth token  
- Custom GitHub App
- Amazon Bedrock/Google Vertex AI

**実行モード**
- Tag Mode（デフォルト）: @claude mention対応
- Agent Mode: 自動ワークフロー実行

**トリガー設定**
- Issue/PR comments、assignments、label応用

### インストール・基本設定
```bash
npm install -g @anthropic-ai/claude-code
claude  # 初回認証
```

### 確実なスラッシュコマンド一覧
- `/init` - CLAUDE.mdファイル生成
- `/clear` - コンテキストリセット  
- `/compact` - 会話要約でトークン節約
- `/review` - プルリクエスト確認
- `/help` - コマンド一覧表示
- `/model` - AIモデル選択（Opus, Sonnet, Default）
- `/add-dir` - 別フォルダをコンテキストに追加（第3弾追加）
- `/config` - 設定パネル表示（第3弾追加）
- `/status` - Claude Code現在状態表示（第3弾追加）
- `/exit` - インタラクティブセッション終了（第3弾追加）
- `/mcp` - MCPサーバー管理（第3弾追加）

### カスタムコマンド定義方法
```bash
mkdir -p .claude/commands
echo "コマンド内容" > .claude/commands/custom-name.md
# 使用: /custom-name
```

### ファイル操作
- ドラッグ&ドロップでファイル読み込み
- `Command + Option + K`でエディタファイル含む
- 自然言語でGit操作可能

### WebFetch機能
- URLからWebページ内容取得可能
- HTML→Markdown変換処理
- プロンプトで特定情報抽出指示
- YouTube動画の実コンテンツは取得不可（JS設定のみ）

## 🟡 たぶん大丈夫（技術記事・実践ベース）

### カスタマイゼーション（第2弾追加）
**3つのカスタマイズ機能**
1. Commands: `/`で始まるカスタムコマンド
2. Roles: 専門家視点（`/role architect`等）
3. Hooks: 特定タイミングでの自動スクリプト

**実用カスタムコマンド例**
- `/analyze-dependencies`: 依存関係可視化
- `/fix-error`: エラーメッセージベースの修正提案
- `/pr-review`: プルリクエスト体系的レビュー
- `/semantic-commit`: 大規模変更の意味的分割

**コマンド作成基準**
- 3回以上同様の実装経験
- プロダクト＋テストコードをセット作成可能
- 実装が単純明快

### 並列運用・高度活用（第3弾追加）
**Tmux並列運用**
- 複数Claude Codeセッションの同時実行
- "Claude Code Company"概念（複数AI協働）
- git worktreeでの分散作業管理

**実践的Tips（技術コミュニティ情報）**
- `/add-dir`での効率的なフォルダ管理
- セッション管理とコンテキスト最適化
- 並列ワークロードの思想と実装

**業界ポジション（Reuters報道）**
- Microsoft・GitHub統合の動向
- エンタープライズ向けの位置づけ
- AIコーディングエージェント市場での立ち位置

### GitHub Actions連携
```yaml
# .github/workflows/claude.yml
runs-on: self-hosted  # VPS使用で無料枠節約
```

### 対応モデル（CometAPI経由）
- Claude Sonnet 4
- Claude Opus 4  
- Gemini 2.5
- Grok 4

### 環境変数設定
```bash
export COMET_API_KEY="your-key"
```

### MCP（Model Context Protocol）詳細（第3弾更新）
- 外部データソース連携可能
- OAuth 2.0対応
- `/mcp__servername__promptname`形式

**MCPサーバー管理**
- `claude mcp add my-server`でサーバー追加
- 設定は`./.mcp.json`に保存
- ツール実行時はユーザー承認必要

**セキュリティ考慮事項**
- MCPサーバーはコード実行・システムリソースアクセス可能
- 事前許可とアクセス制御が重要
- プロジェクト/ユーザーレベルでスコープ管理

### システム要件
- Node.js 18+
- Ubuntu/MacOS対応確認済み
- Windows（WSL推奨？）

## 🔴 怪しいかも（要検証・憶測含む）

### 制限・課題（第2・3弾追加）
- コードベースが大きいと破綻する（Twitter上の声）
- ベータ版のため機能変更の可能性
- 情報が古くなるリスク（頻繁アップデート）

### 検証不足情報（第3弾追加）
**YouTube個人解説動画**
- "5人のAIが勝手に開発する会社"等のデモ
- 概念理解には有用だが手順差分は要確認

**X（Twitter）個人ポスト**
- tmux量産・Maxプラン運用の"勢いあるノウハウ"
- 情報の持続性・正確性は未保証
- 公式Docsでの裏取り必須

**Medium個人ブログ**
- "23 Claude Code FREE Addons"等の面白い情報
- 出典曖昧・古い仕様混入の可能性
- エンターテイメント性重視で精度に注意

**メタ推奨事項**
- 仕様確認は必ずAnthropic Docs/公式GitHubへ
- 日本語Tips→公式差分確認が安定ルート
- X/YouTubeは発想源に留め、手順は再検証必須

### 新機能（未確認）
- `custom subagents`機能
- `/agents`コマンド存在？
- 24/7動作「Claudeputer」

### 性能・制限
- 長時間タスク処理能力
- 大規模コードベース対応範囲
- 同時実行可能数

### 高度な機能（再現性不明）
- 動画編集ツール連携
- Remotion統合
- vibe coding

### セキュリティ・実用性
- プロンプトインジェクション対策
- 企業環境での安全性
- 実際のプロダクション使用事例

## 📋 情報整理完了

第1弾・第2弾・第3弾の情報を信頼度別に統合完了。
さらなる深掘りテーマ：
- MCPサーバー詳細連携
- Tmux並列運用の具体的実装
- Maxプランセッション上限回避戦略
- エンタープライズ環境のベストプラクティス

---
*最終更新: 2025-01-25（第3弾反映）*