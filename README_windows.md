# Windows用 スクリーンショット OCR ツール

最も簡単な方法でWindows上で動作するスクリーンショット＋OCRツールです。

## ファイル構成

- `setup_windows.py` - セットアップスクリプト
- `windows_screenshot_ocr.py` - メインプログラム
- `README_windows.md` - この説明書

## インストール手順

### 1. Pythonの確認
Windowsにfairpythonがインストールされているか確認：
```cmd
python --version
```

### 2. 必要なライブラリをインストール
```cmd
cd C:\Users\user
python setup_windows.py
```

### 3. Tesseract OCR のインストール
1. https://github.com/UB-Mannheim/tesseract/wiki にアクセス
2. `tesseract-ocr-w64-setup-v5.x.x.exe` をダウンロード
3. インストール実行（日本語言語パックも一緒にインストール）

## 使用方法

### 基本的な実行
```cmd
cd C:\Users\user
python windows_screenshot_ocr.py
```

### 操作手順
1. **プログラム起動**
   - コマンドプロンプトで上記コマンドを実行

2. **1点目の指定**
   - 画面上の左上の位置にマウスを移動
   - Enterキーを押す
   - 5秒のカウントダウン後に座標が記録される

3. **2点目の指定**
   - 画面上の右下の位置にマウスを移動
   - Enterキーを押す
   - 5秒のカウントダウン後に座標が記録される

4. **自動処理**
   - 3秒後にスクリーンショットが撮影される
   - OCR処理が実行される
   - 結果がコンソールとファイルに出力される

## 出力ファイル

- `screenshot_YYYYMMDD_HHMMSS.png` - 撮影されたスクリーンショット
- `extracted_text_YYYYMMDD_HHMMSS.txt` - 抽出されたテキスト
- `ocr_config.py` - Tesseractの設定ファイル（自動生成）

## 機能

### OCR対応言語
- 英語 (eng)
- 日本語 (jpn)
- 英語+日本語 (jpn+eng)

### 安全機能
- マウスを画面左上の角に移動すると自動終了
- Ctrl+C で強制終了

### 自動設定
- Tesseractのパスを自動検出
- 最適な言語設定を自動選択
- タイムスタンプ付きファイル名

## トラブルシューティング

### 「tesseract is not installed」エラー
```
解決方法:
1. Tesseractが正しくインストールされているか確認
2. C:\Program Files\Tesseract-OCR\ に tesseract.exe があるか確認
3. setup_windows.py を再実行
```

### 「ModuleNotFoundError」エラー
```
解決方法:
1. setup_windows.py を実行してライブラリをインストール
2. または手動で: pip install pyautogui pillow pytesseract
```

### スクリーンショットが撮影されない
```
解決方法:
1. 座標が正しく指定されているか確認
2. 画面サイズを超えた座標を指定していないか確認
3. ウイルス対策ソフトがブロックしていないか確認
```

## 注意事項

- Windows 10/11 での動作を想定
- 管理者権限は不要
- ウイルス対策ソフトで誤検知される場合があります
- OCRの精度は画像の品質に依存します

## 使用例

### 文字がくっきり見える画面の一部をOCR
1. ブラウザで文字の多いページを開く
2. プログラムを実行
3. テキスト部分の左上と右下を指定
4. 抽出結果を確認

### PDFや画像内のテキストをOCR
1. PDF や画像を画面に表示
2. プログラムを実行
3. テキスト部分を範囲選択
4. 抽出されたテキストをコピー&ペースト