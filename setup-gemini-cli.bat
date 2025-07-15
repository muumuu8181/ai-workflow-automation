@echo off
REM 🚀 Gemini CLI完全自動セットアップスクリプト (Windows)
REM Usage: setup-gemini-cli.bat

echo 🚀 Gemini CLI自動セットアップを開始します...

REM Step 1: Node.js確認
echo 📋 Step 1: Node.js環境確認中...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.jsが見つかりません。
    echo    https://nodejs.org/ からインストールしてください
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ Node.js %NODE_VERSION%
echo ✅ npm %NPM_VERSION%

REM Step 2: Gemini CLI設定ディレクトリ作成
echo 📋 Step 2: 設定ディレクトリ作成中...
if not exist "%USERPROFILE%\.gemini" mkdir "%USERPROFILE%\.gemini"
echo ✅ ~/.gemini ディレクトリ作成完了

REM Step 3: OAuth認証設定ファイル作成
echo 📋 Step 3: OAuth認証設定中...
echo {"selectedAuthType":"oauth-personal","theme":"Default"} > "%USERPROFILE%\.gemini\settings.json"
echo ✅ OAuth認証設定完了

REM Step 4: 初回認証実行
echo 📋 Step 4: Gemini CLI初回認証を開始します...
echo 🔐 ブラウザが開きます。Googleアカウントでログインしてください。
echo.

npx @google/gemini-cli -p "初回セットアップテスト"

echo.
echo 🎉 Gemini CLIセットアップ完了！
echo.
echo 📝 使用方法：
echo    npx @google/gemini-cli -p "質問内容"
echo    npx @google/gemini-cli -m gemini-2.5-pro -p "質問内容" 
echo    npx @google/gemini-cli -m gemini-2.5-flash -p "質問内容"
echo.
echo ⚠️  文字数制限: 3500文字以下推奨
echo 🆓 利用制限: 1,000回/日（完全無料）
echo.
pause