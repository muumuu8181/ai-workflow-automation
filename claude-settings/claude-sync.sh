#!/bin/bash
# CLAUDE設定の同期スクリプト

REPO_DIR=~/claude-settings
GITHUB_USER="muumuu8181"
REPO_NAME="claude-settings"

# 色付き出力
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 初回セットアップ
setup() {
    echo -e "${YELLOW}初回セットアップを開始します...${NC}"
    
    # リポジトリをクローン
    git clone https://github.com/$GITHUB_USER/$REPO_NAME.git $REPO_DIR
    cd $REPO_DIR
    
    # ローカルファイルを適用
    apply_settings
    
    echo -e "${GREEN}✅ セットアップ完了${NC}"
}

# 設定を適用
apply_settings() {
    cp CLAUDE.md ~/.claude/ 2>/dev/null || true
    cp CLAUDE.md ~/プロジェクトディレクトリ/ 2>/dev/null || true
    cp .claude_aliases ~/ 2>/dev/null || true
    chmod +x cdg claude-dg 2>/dev/null || true
    
    # bashrcに追加（重複チェック付き）
    if ! grep -q "claude-settings" ~/.bashrc; then
        echo "export PATH=\$PATH:$REPO_DIR" >> ~/.bashrc
        echo "source ~/.claude_aliases" >> ~/.bashrc
    fi
}

# GitHubから最新版を取得
pull() {
    echo -e "${YELLOW}最新版を取得しています...${NC}"
    cd $REPO_DIR
    git pull
    apply_settings
    echo -e "${GREEN}✅ 更新完了${NC}"
}

# ローカルの変更をGitHubにプッシュ
push() {
    echo -e "${YELLOW}変更をアップロードしています...${NC}"
    
    # 最新のファイルをリポジトリにコピー
    cp ~/.claude/CLAUDE.md $REPO_DIR/ 2>/dev/null || \
    cp /mnt/c/Users/kakar/CLAUDE.md $REPO_DIR/ 2>/dev/null || \
    cp ~/CLAUDE.md $REPO_DIR/ 2>/dev/null
    
    cp ~/.claude_aliases $REPO_DIR/ 2>/dev/null || true
    cp ~/cdg $REPO_DIR/ 2>/dev/null || \
    cp /mnt/c/Users/kakar/cdg $REPO_DIR/ 2>/dev/null || true
    cp ~/claude-dg $REPO_DIR/ 2>/dev/null || \
    cp /mnt/c/Users/kakar/claude-dg $REPO_DIR/ 2>/dev/null || true
    
    cd $REPO_DIR
    git add .
    git commit -m "Update claude settings from $(hostname) - $(date '+%Y-%m-%d %H:%M')"
    git push
    echo -e "${GREEN}✅ アップロード完了${NC}"
}

# 状態確認
status() {
    cd $REPO_DIR
    echo -e "${YELLOW}=== 現在の状態 ===${NC}"
    git status
    echo ""
    echo -e "${YELLOW}=== 最新のコミット ===${NC}"
    git log --oneline -5
}

# メイン処理
case "$1" in
    "setup")
        setup
        ;;
    "pull"|"update")
        pull
        ;;
    "push"|"upload")
        push
        ;;
    "status")
        status
        ;;
    *)
        echo "使い方:"
        echo "  claude-sync setup   - 初回セットアップ"
        echo "  claude-sync pull    - 最新版を取得"
        echo "  claude-sync push    - 変更をアップロード"
        echo "  claude-sync status  - 状態確認"
        ;;
esac