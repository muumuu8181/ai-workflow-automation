# Database Investigation AI Agent

SQLiteデータベースを自律的に調査し、データ品質や構造を分析するAIエージェントです。

## 特徴

- **自律的な調査**: 事前知識なしでデータベースを調査
- **包括的な分析**: テーブル構造、データ品質、セキュリティ、パフォーマンスを分析
- **拡張可能**: プラグインシステムで機能を追加可能
- **レポート生成**: JSON/Markdown形式でレポートを出力

## ファイル構成

```
db_agent.py                 # メインエージェントクラス
db_agent_plugins.py         # 追加プラグイン集
run_db_investigation.py     # 実行用スクリプト
quick_test.py              # 動作確認用テスト
demo_report.py             # デモレポート生成
```

## 使用方法

### 基本的な使用方法

```bash
# 仮想環境を作成・有効化
python3 -m venv venv
source venv/bin/activate

# 必要なライブラリをインストール
pip install faker

# データベースを調査
python run_db_investigation.py ecommerce_sample.db
```

### オプション

```bash
# 出力形式を指定
python run_db_investigation.py ecommerce_sample.db --output-format json

# ファイルに保存
python run_db_investigation.py ecommerce_sample.db --output-file report.md

# 特定のプラグインのみ使用
python run_db_investigation.py ecommerce_sample.db --plugins profile security

# 詳細ログを表示
python run_db_investigation.py ecommerce_sample.db --verbose
```

### プログラムから使用

```python
from db_agent import DatabaseAgent
from db_agent_plugins import DataProfilePlugin, SecurityAnalysisPlugin

# エージェントを初期化
agent = DatabaseAgent("path/to/database.db")

# プラグインを追加
agent.add_plugin(DataProfilePlugin())
agent.add_plugin(SecurityAnalysisPlugin())

# 調査を実行
results = agent.investigate_database()

# レポートを生成
report = agent.generate_report('markdown')
print(report)

# 接続を閉じる
agent.close()
```

## 分析内容

### 基本分析
- **テーブル構造**: カラム情報、データ型、制約
- **データ統計**: 行数、NULL値、ユニーク値の数
- **外部キー関係**: テーブル間の関連性
- **インデックス情報**: 既存のインデックス

### プラグイン分析

#### DataProfilePlugin
- データ分布分析
- 値のパターン検出
- 外れ値の検出
- 完全性スコア

#### SecurityAnalysisPlugin
- 機密データの検出
- パスワード強度分析
- 個人情報の露出チェック
- SQLインジェクションリスク

#### PerformanceAnalysisPlugin
- テーブルサイズ分析
- インデックス推奨事項
- クエリパフォーマンステスト
- JOINパフォーマンスリスク

#### BusinessLogicValidationPlugin
- ビジネスルール検証
- データ整合性チェック
- 参照整合性チェック
- ロジック推奨事項

## カスタムプラグインの作成

```python
from db_agent import AnalysisPlugin

class MyCustomPlugin(AnalysisPlugin):
    def analyze(self, agent, table_name):
        # 分析ロジックを実装
        return {
            'custom_metric': 'value',
            'recommendations': ['suggestion1', 'suggestion2']
        }
    
    def get_name(self):
        return "MyCustomPlugin"

# エージェントに追加
agent.add_plugin(MyCustomPlugin())
```

## 出力例

### Markdown形式
```markdown
# Database Investigation Report

**Database:** ecommerce_sample.db
**Investigation Time:** 2025-07-09 00:50:00

## Summary
- **Total Tables:** 10
- **Total Columns:** 78
- **Total Rows:** 58,550
- **Data Quality Issues:** 12

## Tables Overview
### products
- **Rows:** 5,000
- **Columns:** 12
- **Primary Keys:** id
- **Anomalies:** 価格列で異常に大きな値が検出されました
```

### JSON形式
```json
{
  "database_path": "ecommerce_sample.db",
  "investigation_time": "2025-07-09T00:50:00",
  "summary": {
    "total_tables": 10,
    "total_columns": 78,
    "total_rows": 58550
  },
  "data_quality_issues": [
    "products.price: 価格列で異常に大きな値が検出されました"
  ]
}
```

## 拡張性

### 新しい分析タイプの追加
1. `AnalysisPlugin`を継承したクラスを作成
2. `analyze()`メソッドを実装
3. エージェントに登録

### データベース対応の拡張
- PostgreSQL, MySQL対応
- NoSQL対応
- クラウドデータベース対応

### AI機能の強化
- 異常検出アルゴリズムの改善
- 自然言語による推奨事項生成
- 機械学習による品質予測

## 制限事項

- 現在はSQLiteのみ対応
- 大きなデータベースでは処理時間が長くなる可能性
- 複雑なビジネスロジックの検証は限定的

## ライセンス

MIT License