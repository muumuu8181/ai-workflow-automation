#!/bin/bash

# 🚀 Gemini CLI完全自動セットアップスクリプト
# Usage: bash setup-gemini-cli.sh

echo "🚀 Gemini CLI自動セットアップを開始します..."

# Step 1: Node.js確認
echo "📋 Step 1: Node.js環境確認中..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.jsが見つかりません。"
    echo "   以下からインストールしてください："
    echo "   Windows: https://nodejs.org/"
    echo "   Mac: brew install node"
    echo "   Linux: sudo apt install nodejs npm"
    exit 1
fi

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo "✅ Node.js $NODE_VERSION"
echo "✅ npm $NPM_VERSION"

# Step 2: Gemini CLI設定ディレクトリ作成
echo "📋 Step 2: 設定ディレクトリ作成中..."
mkdir -p ~/.gemini
echo "✅ ~/.gemini ディレクトリ作成完了"

# Step 3: OAuth認証設定ファイル作成
echo "📋 Step 3: OAuth認証設定中..."
cat > ~/.gemini/settings.json << 'EOF'
{
  "selectedAuthType": "oauth-personal",
  "theme": "Default"
}
EOF
echo "✅ OAuth認証設定完了"

# Step 4: WSL2環境チェック
echo "📋 Step 4: 環境チェック中..."
if grep -q Microsoft /proc/version 2>/dev/null; then
    WSL_IP=$(hostname -I | awk '{print $1}')
    echo "🔧 WSL2環境を検出しました"
    echo "   認証URLでlocalhost接続エラーが出た場合："
    echo "   localhost を ${WSL_IP} に置換してください"
fi

# Step 5: 初回認証実行
echo "📋 Step 5: Gemini CLI初回認証を開始します..."
echo "🔐 ブラウザが開きます。Googleアカウントでログインしてください。"
echo ""

# タイムアウト付きで認証実行
timeout 120 npx @google/gemini-cli -p "初回セットアップテスト" 2>&1 | while IFS= read -r line; do
    echo "$line"
    
    # 認証URL検出
    if [[ $line == *"https://accounts.google.com"* ]]; then
        echo ""
        echo "🔗 認証URLが表示されました。ブラウザでアクセスしてください。"
        echo ""
    fi
    
    # 認証成功検出
    if [[ $line == *"Loaded cached credentials"* ]] || [[ $line == *"セットアップテスト"* ]]; then
        echo ""
        echo "🎉 認証成功！Gemini CLIが使用可能になりました。"
        break
    fi
done

# Step 6: 最終確認
echo ""
echo "📋 Step 6: 動作確認中..."
if npx @google/gemini-cli -p "動作確認：2+2の答えは？" 2>/dev/null | grep -q "4"; then
    echo "✅ 動作確認成功！"
    echo ""
    echo "🎉 Gemini CLIセットアップ完了！"
    echo ""
    echo "📝 使用方法："
    echo "   npx @google/gemini-cli -p \"質問内容\""
    echo "   npx @google/gemini-cli -m gemini-2.5-pro -p \"質問内容\""
    echo "   npx @google/gemini-cli -m gemini-2.5-flash -p \"質問内容\""
    echo ""
    echo "⚠️  文字数制限: 3500文字以下推奨"
    echo "🆓 利用制限: 1,000回/日（完全無料）"
else
    echo "⚠️  認証は完了しましたが、手動で確認してください："
    echo "   npx @google/gemini-cli -p \"テスト\""
fi