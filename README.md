# デスクトップ監視アプリ

デスクトップの状況を10秒間隔で監視し、AI解析で詳細な状況を解説してテキストファイルに保存するアプリケーションです。

## 機能

- 10秒間隔でスクリーンショットを自動撮影
- マウスカーソル位置の検出
- アクティブなウィンドウとアプリケーションの識別
- Gemini APIを使った詳細な画面解析（画面の具体的な内容、ブラウザのサイト、作業内容など）
- 解析結果をタイムスタンプ付きでテキストファイルに保存
- 解説内容の無限ループを防ぐため、解析結果は画面に表示せず直接ファイルに保存

## インストール

```bash
pip install -r requirements.txt
```

## 使用方法

### 基本的な使用方法（簡易解析）

```bash
python desktop_monitor.py
```

### 詳細解析を使用する場合（推奨・無料）

Gemini APIキーを環境変数に設定してから実行：

```bash
# Windows
set GEMINI_API_KEY=your_api_key_here
python desktop_monitor.py

# Linux/Mac
export GEMINI_API_KEY=your_api_key_here
python desktop_monitor.py
```

終了するには `Ctrl+C` を押してください。

## 出力

- 解析結果は `desktop_analysis/` ディレクトリに保存されます
- ファイル名は `analysis_YYYYMMDD_HHMMSS.txt` の形式です

## 解析内容

### Gemini API使用時（詳細解析・無料）
- 画面に表示されているアプリケーションの詳細な説明
- ブラウザの場合：どのサイトを見ているか、コンテンツの内容
- 画面上の主要な要素（ボタン、メニュー、テキストなど）
- マウスカーソルの位置と何を指しているか
- 推測される作業内容

### 簡易解析（APIキー無し）
- 画面解像度
- マウスカーソル位置
- アクティブなウィンドウ名
- 実行中のアプリケーション名
- 基本的な状況推測

## Gemini APIキーの取得（無料）

1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. Googleアカウントでログイン
3. "Create API Key"をクリックしてAPIキーを取得
4. 環境変数 `GEMINI_API_KEY` に設定

## 注意事項

- Windows環境でのみ動作確認済み
- 一部のアプリケーションでは詳細な情報が取得できない場合があります
- Gemini APIは無料枠内（月15リクエスト/分、100万トークン/月）で利用可能
- 無料枠を超えると料金が発生する場合があります