#!/bin/bash
# claude-sync自体をどのPCでも使えるようにするセットアップ

echo "claude-syncをインストールします..."

# claude-syncをダウンロード
curl -o ~/claude-sync https://raw.githubusercontent.com/muumuu8181/claude-settings/main/claude-sync.sh
chmod +x ~/claude-sync

# PATHに追加
if ! grep -q "alias claude-sync" ~/.bashrc; then
    echo "alias claude-sync='~/claude-sync'" >> ~/.bashrc
fi

source ~/.bashrc

echo "✅ インストール完了"
echo "使い方:"
echo "  claude-sync setup   - 初回セットアップ"
echo "  claude-sync pull    - 最新版を取得" 
echo "  claude-sync push    - 変更をアップロード"