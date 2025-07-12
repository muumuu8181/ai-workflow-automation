# スクリーンショット OCR ツール

PyAutoGUIを使用して画面上の2点をクリックで指定し、その範囲をスクリーンショットしてOCRで文字列を抽出するツールです。

## 機能

- 2点クリックによる範囲選択
- 指定範囲のスクリーンショット撮影
- OCR（光学文字認識）による文字列抽出
- 日本語・英語対応
- 結果のテキストファイル保存

## 必要な環境

- Python 3.x
- 仮想環境: `pyautogui_env`
- Tesseract OCR（システムにインストール）

## インストール手順

### 1. Tesseract OCR のインストール

```bash
# インストールスクリプトを実行
./install_tesseract.sh
```

または手動で：

```bash
sudo apt update
sudo apt install -y tesseract-ocr tesseract-ocr-jpn
```

### 2. Pythonライブラリのインストール

既に仮想環境 `pyautogui_env` が作成され、必要なライブラリがインストールされています。

## 使用方法

### 基本的な使用法

```bash
# 仮想環境をアクティベートして実行
source pyautogui_env/bin/activate
python3 screenshot_ocr.py
```

### 操作手順

1. スクリプトを実行
2. 画面上の左上の点にマウスを合わせてEnterキーを押す
3. 画面上の右下の点にマウスを合わせてEnterキーを押す
4. スクリーンショットが撮影され、OCRで文字列が抽出される
5. 結果がコンソールに表示され、`extracted_text.txt`に保存される

### 終了方法

- `Ctrl+C` でプログラムを終了できます

## 出力ファイル

- `screenshot_region.png`: 撮影されたスクリーンショット
- `extracted_text.txt`: 抽出されたテキスト

## 注意点

- WSL2環境でのGUI操作のため、X11転送が必要な場合があります
- Tesseractが正しくインストールされていない場合、OCR処理が失敗します
- 日本語の認識精度は画像の品質に依存します

## トラブルシューティング

### Tesseract not found エラー

```bash
# Tesseractのインストール確認
tesseract --version

# 利用可能な言語の確認
tesseract --list-langs
```

### GUI操作が動作しない場合

WSL2でのGUI操作には追加の設定が必要な場合があります。

## ライセンス

このツールは個人使用・学習目的で作成されています。