# 🤖 Claude Code向け Gemini CLI自動セットアップガイド

## 📋 他PC環境での自動セットアップ手順

### 前提条件確認
```bash
# Node.jsの存在確認
node -v && npm -v
```

### Step 1: Gemini CLI設定ディレクトリ作成
```bash
mkdir -p ~/.gemini
```

### Step 2: OAuth認証設定ファイル作成
```bash
cat > ~/.gemini/settings.json << 'EOF'
{
  "selectedAuthType": "oauth-personal", 
  "theme": "Default"
}
EOF
```

### Step 3: 初回認証の実行
```bash
# 認証プロセス開始（ブラウザが開く）
timeout 60 npx @google/gemini-cli -p "認証テスト" || echo "認証URL表示待ち"
```

### Step 4: WSL2環境での認証URL修正（必要時）
```bash
# WSLのIPアドレス取得
WSL_IP=$(hostname -I | awk '{print $1}')
echo "WSL2環境の場合、認証URLのlocalhostを${WSL_IP}に置換してください"
```

### Step 5: 認証完了確認
```bash
# 認証成功の確認
npx @google/gemini-cli -p "認証確認テスト"
```

### Step 6: 文字数制限テスト
```bash
# 3500文字制限の確認
npx @google/gemini-cli -p "$(python3 -c "print('テスト:' + 'あ' * 3000)")"
```

## 🔧 Claude Code用のワンライナー

### 完全自動セットアップ
```bash
# 一括実行コマンド
mkdir -p ~/.gemini && \
echo '{"selectedAuthType":"oauth-personal","theme":"Default"}' > ~/.gemini/settings.json && \
echo "Gemini CLI設定完了。初回認証を開始します..." && \
npx @google/gemini-cli -p "セットアップ完了テスト"
```

## 📱 ユーザー向け指示

### 認証が必要な場合の対応
1. **ブラウザが開く** → Googleアカウントでログイン
2. **WSL2でlocalhost接続エラー** → URLのlocalhostをWSL IPに置換
3. **認証完了** → "認証が成功しました"メッセージ確認

## 🎯 Claude Code実装ポイント

### 環境チェック関数
```bash
check_gemini_cli_ready() {
    if ! command -v node &> /dev/null; then
        echo "❌ Node.jsが必要です。https://nodejs.org/ からインストールしてください"
        return 1
    fi
    
    if [ ! -f ~/.gemini/settings.json ]; then
        echo "🔧 Gemini CLI設定中..."
        mkdir -p ~/.gemini
        echo '{"selectedAuthType":"oauth-personal","theme":"Default"}' > ~/.gemini/settings.json
    fi
    
    echo "✅ Gemini CLI準備完了"
    return 0
}
```

### 自動認証確認
```bash
test_gemini_auth() {
    local test_result=$(npx @google/gemini-cli -p "認証テスト" 2>&1)
    if [[ $test_result == *"login required"* ]]; then
        echo "🔐 初回認証が必要です。ブラウザが開きます..."
        return 1
    elif [[ $test_result == *"Loaded cached credentials"* ]]; then
        echo "✅ 認証済み - Gemini CLI使用可能"
        return 0
    fi
}
```

## ⚡ 重要な自動化ポイント

1. **Node.js確認** → なければユーザーに指示
2. **設定ファイル自動作成** → OAuth認証設定
3. **初回認証ガイド** → ブラウザ認証の案内
4. **WSL2対応** → IP置換の自動案内
5. **動作確認** → 3500文字制限内でのテスト

これらをClaude Codeが自動実行すれば、ユーザーは**Node.jsインストールのみ**で使用開始可能！