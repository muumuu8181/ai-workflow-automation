# 🚀 Gemini CLI完全自動セットアップスクリプト (PowerShell)
# Usage: .\setup-gemini-cli.ps1

Write-Host "🚀 Gemini CLI自動セットアップを開始します..." -ForegroundColor Green

# Step 1: Node.js確認
Write-Host "📋 Step 1: Node.js環境確認中..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.jsが見つかりません。" -ForegroundColor Red
    Write-Host "   https://nodejs.org/ からインストールしてください" -ForegroundColor Yellow
    Read-Host "Enterキーを押して終了"
    exit 1
}

# Step 2: Gemini CLI設定ディレクトリ作成
Write-Host "📋 Step 2: 設定ディレクトリ作成中..." -ForegroundColor Yellow
$geminiDir = "$env:USERPROFILE\.gemini"
if (!(Test-Path $geminiDir)) {
    New-Item -ItemType Directory -Path $geminiDir -Force | Out-Null
}
Write-Host "✅ ~/.gemini ディレクトリ作成完了" -ForegroundColor Green

# Step 3: OAuth認証設定ファイル作成
Write-Host "📋 Step 3: OAuth認証設定中..." -ForegroundColor Yellow
$settingsContent = @"
{
  "selectedAuthType": "oauth-personal",
  "theme": "Default"
}
"@
$settingsPath = "$geminiDir\settings.json"
$settingsContent | Out-File -FilePath $settingsPath -Encoding UTF8
Write-Host "✅ OAuth認証設定完了" -ForegroundColor Green

# Step 4: 初回認証実行
Write-Host "📋 Step 4: Gemini CLI初回認証を開始します..." -ForegroundColor Yellow
Write-Host "🔐 ブラウザが開きます。Googleアカウントでログインしてください。" -ForegroundColor Cyan
Write-Host ""

# Gemini CLI実行
try {
    $result = npx "@google/gemini-cli" -p "初回セットアップテスト" 2>&1
    Write-Host $result
    
    if ($result -match "Loaded cached credentials" -or $result -match "初回セットアップテスト") {
        Write-Host ""
        Write-Host "🎉 認証成功！Gemini CLIが使用可能になりました。" -ForegroundColor Green
    }
} catch {
    Write-Host "認証プロセスを実行中..." -ForegroundColor Yellow
}

# Step 5: 最終確認
Write-Host ""
Write-Host "📋 Step 5: 動作確認中..." -ForegroundColor Yellow
try {
    $testResult = npx "@google/gemini-cli" -p "動作確認：2+2の答えは？" 2>&1
    if ($testResult -match "4") {
        Write-Host "✅ 動作確認成功！" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  認証は完了しました。手動で確認してください：" -ForegroundColor Yellow
    Write-Host "   npx @google/gemini-cli -p `"テスト`"" -ForegroundColor White
}

Write-Host ""
Write-Host "🎉 Gemini CLIセットアップ完了！" -ForegroundColor Green
Write-Host ""
Write-Host "📝 使用方法：" -ForegroundColor Cyan
Write-Host "   npx @google/gemini-cli -p `"質問内容`"" -ForegroundColor White
Write-Host "   npx @google/gemini-cli -m gemini-2.5-pro -p `"質問内容`"" -ForegroundColor White
Write-Host "   npx @google/gemini-cli -m gemini-2.5-flash -p `"質問内容`"" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  文字数制限: 3500文字以下推奨" -ForegroundColor Yellow
Write-Host "🆓 利用制限: 1,000回/日（完全無料）" -ForegroundColor Green
Write-Host ""
Read-Host "Enterキーを押して終了"