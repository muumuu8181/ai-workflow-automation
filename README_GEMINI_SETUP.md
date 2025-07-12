# Gemini CLI + Claude Code 連携セットアップ完了

## 概要
Claude CodeからGemini CLIを呼び出すための設定が完了しました。

## 設定完了項目

### 1. MCPサーバー設定
- **ファイル**: `gemini-mcp-server.js`
- **設定場所**: `~/.claude/claude_desktop_config.json`
- **設定場所**: `~/.claude/settings.json`

### 2. 直接呼び出し用ブリッジスクリプト
- **ファイル**: `gemini-bridge.sh`
- **実行可能**: はい

### 3. 設定ファイル
- **package.json**: ES Module設定済み
- **APIキー**: 環境変数で設定済み

## 使用方法

### A. MCPサーバー経由（推奨）
Claude Codeの新しいセッションで以下を実行：
```
Use gemini_query to search for "質問内容"
Use gemini_summarize to summarize this text: "テキスト"
Use gemini_code_review to review this code: "コード"
```

### B. 直接呼び出し
```bash
# 検索・質問
./gemini-bridge.sh query "Python非同期処理について教えて"

# テキスト要約
./gemini-bridge.sh summarize "" "要約したいテキスト"

# ファイル要約
./gemini-bridge.sh summarize "document.txt"

# コードレビュー
./gemini-bridge.sh code_review "def hello(): print('Hello')" "Python"
```

### C. 直接Gemini CLI
```bash
GEMINI_API_KEY="AIzaSyCiFKunqIbwDajgoOu1V7JXDUw-6V_EUCo" npx @google/gemini-cli -p "質問内容"
```

## トラブルシューティング

### MCPサーバーが認識されない場合
1. Claude Codeを完全に再起動
2. 設定ファイルの確認：
   ```bash
   cat ~/.claude/claude_desktop_config.json
   cat ~/.claude/settings.json
   ```

### MCPサーバーの手動テスト
```bash
cd /mnt/c/Users/user
node gemini-mcp-server.js
```

## 技術詳細

### APIキー
- **Gemini API**: AIzaSyCiFKunqIbwDajgoOu1V7JXDUw-6V_EUCo
- **使用量**: 1日1000リクエスト、毎分60リクエスト（無料枠）

### 利用可能ツール
- `gemini_query`: 検索・質問応答
- `gemini_summarize`: テキスト・ファイル要約
- `gemini_code_review`: コードレビュー

### ファイル構成
```
/mnt/c/Users/user/
├── gemini-mcp-server.js    # MCPサーバー本体
├── gemini-bridge.sh        # 直接呼び出し用スクリプト
├── package.json           # Node.js設定（ES Module）
└── README_GEMINI_SETUP.md # この説明書

~/.claude/
├── claude_desktop_config.json  # Claude Desktop設定
└── settings.json              # Claude Code設定
```

## 注意事項
- APIキーは公開しないでください
- 無料枠の制限に注意してください
- 長時間の処理は30秒でタイムアウトします

## 成功テスト結果
- ✅ Gemini CLIの単体動作確認
- ✅ MCPサーバーの起動確認
- ✅ ブリッジスクリプトの動作確認
- ✅ 設定ファイルの正常性確認

セットアップは完了しています！