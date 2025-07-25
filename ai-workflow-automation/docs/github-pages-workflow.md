# GitHub Pages自動公開ワークフロー

## 🎯 最重要目標
**ワンコマンド（/wk-st）でWebページ公開まで確実完了**

## リポジトリ構造設計

### 公開用リポジトリ: `published-apps`
```
published-apps/
├── README.md                 # アプリ一覧（容量対策）
├── app-001-abc123/          # アプリ1 + 乱数識別子
│   ├── index.html
│   ├── style.css  
│   ├── script.js
│   └── README.md
├── app-002-def456/          # アプリ2 + 乱数識別子
└── app-003-ghi789/          # アプリ3 + 乱数識別子
```

### アクセスURL形式
- `https://[username].github.io/published-apps/app-001-abc123/`
- `https://[username].github.io/published-apps/app-002-def456/`

## 自動採番・識別子システム

### ナンバリングルール
1. **アプリナンバー**: 001, 002, 003... (3桁ゼロパディング)
2. **識別子**: 6文字英数字乱数 (abc123, def456...)
3. **フォルダ名**: `app-{番号}-{識別子}`

### 並列開発対応
- 複数デバイスが同じアプリ要求を処理 → 同じアプリ名、異なる識別子
- 例: "お金管理システム" → app-001-abc123, app-001-def456, app-001-ghi789

## /wk-st実行フロー

### Phase 1: 要求取得・番号確認
```bash
1. 外部リポジトリクローン（app-request-list）
2. published-appsのREADME.md取得（最新番号確認）
3. 優先度判定で次のアプリ決定
4. 新しい識別子生成（乱数6桁）
```

### Phase 2: アプリ生成
```bash
5. テンプレート選択（Node.js/HTML/Python等）
6. 要件に基づくコード生成
7. 基本動作確認（軽微テストのみ）
```

### Phase 3: 公開処理（最重要）
```bash
8. published-appsリポジトリにフォルダ作成
9. GitHub Pages有効化確認
10. README.md更新（アプリ一覧追加）
11. コミット・プッシュ
12. GitHub Pages反映確認
```

## 容量対策
- **軽量管理**: アプリの実体はpublished-appsのみ
- **テキスト情報**: README.mdでアプリ一覧管理
- **クローン最小化**: 必要な情報のみフェッチ

## 止まらない設計
- テスト失敗でもアップロード継続
- GitHub Pages設定エラーでも基本公開試行
- 部分的エラーはログ記録、全体は継続

## 技術スタック柔軟性
- 基本: HTML/CSS/JavaScript（確実公開）
- 選択肢: Node.js, Python (Flask), React等
- フォールバック: 静的HTMLページ