# AI実装ガイドライン

## 🤖 基本実装方針

### **Google Gemini CLI を標準採用**
AI機能の実装には **Google Gemini CLI** を使用してください。

```bash
# 基本的なGemini CLI使用例
gemini-cli --prompt "アプリケーションを生成してください" --model gemini-2.0-flash-exp
```

## 📚 参考リソース

### **claude-ai-toolkit 参照**
詳細な使用方法・実装パターンは以下を参照：

#### **📋 主要リファレンス**
- **セットアップガイド**: `claude-ai-toolkit/CLAUDE_CODE_GEMINI_SETUP.md`
- **MCP統合ガイド**: `claude-ai-toolkit/GEMINI_MCP_SETUP_GUIDE.md`
- **自動セットアップ**: `claude-ai-toolkit/setup-gemini-cli.sh` (.ps1, .bat)

#### **🔧 実装例**
- **MCP統合**: `/mnt/c/Users/user/gemini-mcp-server.js`
- **Python実装**: `/mnt/c/Users/user/gemini_helper.py`
- **AIエージェント**: `/mnt/c/Users/user/gemini_agent.py`
- **ブリッジスクリプト**: `/mnt/c/Users/user/gemini-bridge.sh`

### **推奨実装パターン（claude-ai-toolkit準拠）**

#### 1. OAuth認証方式（推奨）
```bash
# APIキー不要のOAuth認証設定
mkdir -p ~/.gemini
cat > ~/.gemini/settings.json << 'EOF'
{
  "selectedAuthType": "oauth-personal",
  "theme": "Default"
}
EOF
```

#### 2. 基本的なGemini CLI呼び出し
```bash
# OAuth認証使用（推奨）
npx @google/gemini-cli -p "質問内容"

# モデル指定
npx @google/gemini-cli -m gemini-2.5-pro -p "質問内容"
npx @google/gemini-cli -m gemini-2.5-flash -p "質問内容"
```

#### 3. Claude Code MCP統合
```bash
# MCPツール経由（Claude Code内で使用）
mcp__gemini-cli__gemini_query
mcp__gemini-cli__gemini_summarize
mcp__gemini-cli__gemini_code_review
```

#### 4. Node.js実装例
```javascript
// toolkit参考のMCPサーバー実装
const { execAsync } = require('child_process');
const { promisify } = require('util');
const exec = promisify(execAsync);

async function generateAppWithGemini(requirements, appId) {
    const prompt = `以下の要件でWebアプリケーションを生成してください：
要件: ${requirements.join(', ')}
アプリID: ${appId}
出力形式: HTML/CSS/JavaScript`;

    const command = `npx @google/gemini-cli -p "${prompt.replace(/"/g, '\\"')}"`;
    const { stdout } = await exec(command, { timeout: 30000 });
    return stdout.trim();
}
```

#### 5. Python実装例（toolkit参考）
```python
import google.generativeai as genai
import os

def setup_gemini():
    """Gemini API設定（toolkit参考）"""
    api_key = os.getenv('GEMINI_API_KEY')
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-2.5-pro')

def analyze_requirements(markdown_content):
    """要件解析（toolkit参考）"""
    model = setup_gemini()
    prompt = f"以下のMarkdown要件を解析し、技術仕様を決定してください：\n{markdown_content}\n出力形式: JSON"
    response = model.generate_content(prompt)
    return response.text
```

## 🛠️ 設定・環境

### **セットアップ手順（toolkit準拠）**

#### **自動セットアップ（推奨）**
```bash
# Linux/macOS
bash claude-ai-toolkit/setup-gemini-cli.sh

# Windows PowerShell
PowerShell -ExecutionPolicy Bypass -File claude-ai-toolkit/setup-gemini-cli.ps1

# Windows CMD
claude-ai-toolkit/setup-gemini-cli.bat
```

#### **手動セットアップ**
```bash
# 1. Node.jsインストール確認
node --version

# 2. OAuth設定（APIキー不要）
mkdir -p ~/.gemini
echo '{"selectedAuthType": "oauth-personal", "theme": "Default"}' > ~/.gemini/settings.json

# 3. 初回認証（ブラウザで認証）
npx @google/gemini-cli -p "テスト質問"
```

### **動作確認**
```bash
# Gemini CLI接続テスト
npx @google/gemini-cli -p "Hello, Gemini!"

# モデル指定テスト
npx @google/gemini-cli -m gemini-2.5-flash -p "簡単な質問"
```

## 📋 実装チェックリスト

### **AI機能実装時の必須項目**
- [ ] Google Gemini CLIを使用
- [ ] claude-ai-toolkit内の実装例を参照
- [ ] エラーハンドリング実装
- [ ] レスポンス形式の検証
- [ ] 適切なモデル選択（推奨: gemini-2.0-flash-exp）

### **コード品質基準**
- [ ] プロンプトの明確性確保
- [ ] 出力形式の指定
- [ ] タイムアウト設定
- [ ] 失敗時のフォールバック処理

## 🔧 トラブルシューティング

### **よくある問題と解決方法**

#### API接続エラー
```bash
# 認証確認
gemini-cli --auth-check

# 設定リセット
gemini-cli --reset-config
```

#### モデル選択
```bash
# 利用可能モデル一覧
gemini-cli --list-models

# 推奨モデル優先順位
1. gemini-2.0-flash-exp    # 高速・高品質
2. gemini-1.5-pro         # 安定性重視
3. gemini-1.5-flash       # 軽量用途
```

#### 出力形式制御
```javascript
// JSON出力強制
const jsonResult = execSync(`gemini-cli --prompt "${prompt}" --format json`);

// プレーンテキスト
const textResult = execSync(`gemini-cli --prompt "${prompt}" --format text`);
```

## 📖 高度な使用例

### **ファイル処理連携**
```bash
# 複数ファイル処理
gemini-cli --prompt "これらのファイルを統合して単一のWebアプリにしてください" \
           --files "*.html,*.css,*.js" \
           --output-dir ./generated-app/
```

### **インタラクティブモード**
```bash
# 対話的開発
gemini-cli --interactive --model gemini-2.0-flash-exp
```

### **バッチ処理**
```bash
# 複数要件の一括処理
gemini-cli --batch-file requirements-list.txt \
           --output-format json \
           --model gemini-2.0-flash-exp
```

---

## 📝 重要な注意事項

### **セキュリティ**
- API キーの適切な管理
- プロンプトインジェクション対策
- 出力内容の検証

### **パフォーマンス**
- 適切なモデル選択
- プロンプト最適化
- キャッシュ活用

### **運用**
- ログ記録の実装
- エラー監視
- 使用量管理

**このガイドラインに従って、一貫性のあるAI実装を行なってください。**