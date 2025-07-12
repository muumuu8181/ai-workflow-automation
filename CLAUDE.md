# CCF Project Settings

## 🎯 Quick Commands
- When user says "gem [question]", use mcp__gemini-cli__gemini_query to ask Gemini: "[question]"
- When user says "gemini [question]", use mcp__gemini-cli__gemini_query to ask Gemini: "[question]"

## 🚀 Base Configuration
- **Language**: Japanese preferred
- **Code Style**: PEP 8 for Python, Prettier for JS/TS
- **Environment**: WSL2 Ubuntu, Claude Code CLI

## 💡 Automation Rules
- Be proactive and efficient
- Complete tasks without asking for permission when clear
- Provide complete solutions

## ⚠️ 重要な報告ルール
- **部分的な成功を全体の成功として報告しない**
- テスト結果は正確な範囲・制限を明記する
- 「成功しました」は完全な動作確認後にのみ使用
- 例：「3000文字のテストに成功」≠「15000文字の読み込みに成功」

## 🤖 Gemini CLI 運用ガイド

### 文字数制限
- **実用制限：3500文字以下**（4000文字以上でタイムアウト/エラー）
- 大きなファイル分析は分割処理（`head -c 3000`等）
- 制限の原因：APIサーバー側の処理制約（認証方法に関係なし）

### 認証方法の選択
- **推奨：個人Googleアカウント認証**（完全無料、1,000回/日）
- APIキー使用は課金リスクあり
- 設定ファイル：`~/.gemini/settings.json`
```json
{
  "selectedAuthType": "oauth-personal",
  "theme": "Default"
}
```

### ファイル読み込み方法
```bash
# 3000文字以下でファイル読み込み
npx @google/gemini-cli -p "$(head -c 3000 'ファイルパス')"$'\n\n'"質問内容"

# 大きなファイルの分割処理例
head -c 3000 file.txt    # 1回目：0-3000文字
tail -c +3001 file.txt | head -c 3000    # 2回目：3001-6000文字
```

### モデル選択
```bash
# 高品質分析が必要な場合
npx @google/gemini-cli -m gemini-2.5-pro -p "質問"

# 高速応答が必要な場合
npx @google/gemini-cli -m gemini-2.5-flash -p "質問"
```

### WSL2環境での認証注意点
- localhost接続エラーの場合：WSLのIPアドレス（`hostname -I`）を使用
- 認証URL中の`localhost`を`172.x.x.x`に置換
- ポート転送が必要な場合あり

### TodoWrite使用の重要性
- **複雑なタスクは必ずTodoWriteで計画・追跡**
- 完了したタスクは即座にcompleted状態に更新
- 進捗の可視化でユーザーの安心感向上