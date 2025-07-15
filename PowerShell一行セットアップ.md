# 🚀 PowerShell 1行でGemini CLIセットアップ

## ⚡ 最速セットアップ方法

### 方法1: スクリプト実行（推奨）
```powershell
iex (iwr https://raw.githubusercontent.com/muumuu8181/claude-gemini-cli-guide/main/quick-setup.ps1 -UseBasicParsing).Content
```

### 方法2: 1行直接実行
```powershell
if (Get-Command node -ErrorAction SilentlyContinue) { if (!(Test-Path "$env:USERPROFILE\.gemini")) { New-Item -ItemType Directory -Path "$env:USERPROFILE\.gemini" -Force | Out-Null }; '{"selectedAuthType":"oauth-personal","theme":"Default"}' | Out-File -FilePath "$env:USERPROFILE\.gemini\settings.json" -Encoding UTF8; Write-Host "Starting Gemini CLI..."; npx "@google/gemini-cli" -p "Setup complete" } else { Write-Host "Install Node.js from https://nodejs.org/" }
```

## 📋 実行内容

このコマンドは以下を自動実行します：

1. ✅ **Node.js確認**
2. ✅ **~/.gemini ディレクトリ作成**
3. ✅ **OAuth設定ファイル作成**
4. ✅ **Gemini CLI初回実行**

## 🔐 認証について

- **ブラウザが自動で開きます**
- **Googleアカウントでログイン**してください
- **認証は1回のみ**（以降は自動ログイン）

## ⚠️ エラー対応

### "実行ポリシー" エラーが出た場合
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

### "Node.js not found" が出た場合
1. https://nodejs.org/ からNode.jsをインストール
2. PowerShellを再起動
3. 再度コマンド実行

## 🎯 使用方法（セットアップ後）

```powershell
# 基本的な質問
npx @google/gemini-cli -p "質問内容"

# モデル指定
npx @google/gemini-cli -m gemini-2.5-pro -p "質問内容"
npx @google/gemini-cli -m gemini-2.5-flash -p "質問内容"

# ファイル読み込み（3500文字以下）
npx @google/gemini-cli -p "$(Get-Content ファイル名 -TotalCount 100)" + "質問"
```

## 📊 制限事項

- **文字数制限**: 3500文字以下推奨
- **利用制限**: 1,000回/日（完全無料）
- **認証**: 個人Googleアカウント必須

## 🔗 関連リンク

- [GitHub Repository](https://github.com/muumuu8181/claude-gemini-cli-guide)
- [詳細運用ガイド](https://github.com/muumuu8181/claude-gemini-cli-guide/blob/main/CLAUDE.md)
- [Node.js公式サイト](https://nodejs.org/)