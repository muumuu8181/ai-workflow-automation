#!/bin/bash
# 超簡単インストーラー
git clone https://github.com/muumuu8181/claude-settings.git ~/claude-settings
echo 'alias cs="~/claude-settings/claude-sync.sh"' >> ~/.bashrc
source ~/.bashrc
echo "✅ 完了！'cs pull'や'cs push'が使えます"