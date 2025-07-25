# Gemini CLI統合チェックリスト

## 🚀 プロジェクト開始時の確認事項

### **📋 前提条件**
- [ ] Node.js 18+ インストール済み
- [ ] claude-ai-toolkit セットアップ済み
- [ ] Google アカウント認証準備完了

### **⚙️ Gemini CLI セットアップ**
- [ ] OAuth認証設定完了（~/.gemini/settings.json）
- [ ] 初回ブラウザ認証実行済み
- [ ] `npx @google/gemini-cli -p "test"` で動作確認済み

### **🔗 Claude Code MCP統合（オプション）**
- [ ] gemini-mcp-server.js 配置済み
- [ ] Claude Code設定でMCPサーバー有効化
- [ ] `mcp__gemini-cli__gemini_query` 動作確認済み

## 🛠️ 実装時の必須チェック

### **コード実装**
- [ ] OAuth認証方式使用（APIキー方式は非推奨）
- [ ] プロンプト文字数制限（3500文字以下）
- [ ] タイムアウト設定（30秒推奨）
- [ ] エラーハンドリング実装

### **モデル選択**
- [ ] **gemini-2.5-pro**: 高品質・複雑なタスク用
- [ ] **gemini-2.5-flash**: 高速・軽量タスク用
- [ ] 用途に応じた適切なモデル選択

### **セキュリティ**
- [ ] プロンプトインジェクション対策
- [ ] 出力内容検証
- [ ] 機密情報のフィルタリング

## 📊 運用時のモニタリング

### **パフォーマンス**
- [ ] レスポンス時間監視
- [ ] 利用制限監視（1,000回/日）
- [ ] エラー率監視

### **ログ記録**
- [ ] API呼び出しログ
- [ ] エラーログ
- [ ] 使用量トラッキング

## 🔧 トラブルシューティング準備

### **よくある問題の対処法準備**
- [ ] 認証エラー → OAuth再設定手順
- [ ] 接続エラー → ネットワーク確認手順
- [ ] 文字数制限エラー → プロンプト分割手順
- [ ] WSL2問題 → localhost IP置換手順

### **フォールバック戦略**
- [ ] Gemini API直接使用への切り替え
- [ ] 代替AIモデルの準備
- [ ] ローカル処理への切り替え

## 📝 ドキュメント整備

### **必須ドキュメント**
- [ ] セットアップ手順書
- [ ] 実装ガイドライン
- [ ] トラブルシューティングガイド
- [ ] 運用マニュアル

### **サンプルコード**
- [ ] 基本的な呼び出し例
- [ ] エラーハンドリング例
- [ ] 非同期処理例
- [ ] バッチ処理例

## ✅ 本格運用前の最終確認

### **機能テスト**
- [ ] 基本的なプロンプト処理
- [ ] 長文処理
- [ ] エラー処理
- [ ] 並列処理

### **負荷テスト**
- [ ] 連続実行テスト
- [ ] 同時実行テスト
- [ ] 制限値近くでのテスト

### **セキュリティテスト**
- [ ] 不正プロンプト入力テスト
- [ ] 出力検証テスト
- [ ] 認証テスト

---

**このチェックリストを完了してから本格的なGemini CLI統合を開始してください。**