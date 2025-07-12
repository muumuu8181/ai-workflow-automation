# 🚀 Gemini CLI 他PC向け簡単セットアップガイド

## 📋 最小限セットアップ（5分）

### Step 1: Node.jsインストール
```bash
# Windows: https://nodejs.org/ からダウンロード
# Mac: brew install node
# Linux: sudo apt install nodejs npm
```

### Step 2: Gemini CLI直接使用（No setup required!）
```bash
# 最も簡単な方法 - 個人Googleアカウント認証
npx @google/gemini-cli

# 初回実行時に自動でブラウザ認証が開始されます
```

## 🔧 認証設定（WSL2環境の場合）

### localhost接続エラーが出た場合
```bash
# WSLのIPアドレスを確認
hostname -I

# 出力例: 172.28.144.243
# ブラウザでのURL中のlocalhostを172.28.144.243に置換
```

### 設定ファイル作成（オプション）
```bash
# ~/.gemini/settings.json
mkdir -p ~/.gemini
cat > ~/.gemini/settings.json << 'EOF'
{
  "selectedAuthType": "oauth-personal",
  "theme": "Default"
}
EOF
```

## 📝 文字数制限対応

### 3500文字以下で使用
```bash
# 大きなファイルの分割読み込み
npx @google/gemini-cli -p "$(head -c 3000 'ファイル名')" + "質問"

# モデル指定
npx @google/gemini-cli -m gemini-2.5-pro -p "質問"
npx @google/gemini-cli -m gemini-2.5-flash -p "質問"
```

## 🎯 重要ポイント

### ✅ 利点
- **完全無料**（個人Googleアカウント）
- **1,000回/日、60回/分**の制限
- **Gemini 2.5 Pro & Flash**両方利用可能
- **APIキー不要**（課金リスクなし）

### ⚠️ 注意点
- **文字数制限**: 3500文字以下推奨
- **WSL2**: localhost接続問題の可能性
- **認証**: ブラウザでの初回認証必須

## 🔗 参考リンク
- GitHub: https://github.com/muumuu8181/claude-gemini-cli-guide
- CLAUDE.md: 詳細な運用ガイド