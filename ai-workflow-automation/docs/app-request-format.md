# アプリ要求リスト フォーマット仕様

## 外部リポジトリ「app-request-list」の構成

### app-requests.json フォーマット

```json
{
  "requests": [
    {
      "id": "unique-app-id-001",
      "title": "アプリ名",
      "priority": "最優先",
      "requirements": [
        "要件1：具体的な機能説明",
        "要件2：操作方法の詳細", 
        "要件3：出力・保存形式"
      ],
      "tech_preferences": ["HTML", "JavaScript", "CSS"],
      "estimated_complexity": "low|medium|high",
      "created_date": "2025-01-25",
      "notes": "補足情報や特記事項"
    }
  ]
}
```

## 優先度指定方法

- **最優先**: 他を差し置いて最初に処理
- **高優先度**: 通常より優先的に処理
- **urgent**: 緊急対応が必要
- **ASAP**: 可能な限り早急に対応
- 指定なし: リスト上から順番に処理

## AIの処理ロジック

1. 外部リポジトリから最新のapp-requests.jsonを取得
2. 優先度キーワード検索で最優先項目を特定
3. 見つからない場合は未完了の最上位項目を選択
4. 1プロジェクト完了まで実行
5. 完了後はローカルで完了マーク付与

## 追加・更新方法

外部リポジトリのapp-requests.jsonを直接編集し、GitHubにプッシュするだけでAIが自動認識します。