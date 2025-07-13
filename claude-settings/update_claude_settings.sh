#!/bin/bash
# CLAUDE.md設定を自動更新するスクリプト

REPO_DIR=~/claude-settings

# リポジトリが存在しない場合はクローン
if [ ! -d "$REPO_DIR" ]; then
    git clone https://github.com/muumuu8181/claude-settings.git $REPO_DIR
fi

cd $REPO_DIR

# 最新版を取得
git pull

# ファイルを適用
cp CLAUDE.md /mnt/c/Users/kakar/
cp CLAUDE.md ~/.claude/
cp .claude_aliases ~/
chmod +x cdg claude-dg

echo "✅ CLAUDE設定を更新しました"