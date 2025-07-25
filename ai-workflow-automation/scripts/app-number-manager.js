#!/usr/bin/env node

/**
 * アプリナンバー自動管理システム
 * published-appsリポジトリから最新番号を取得し、次の番号を採番
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AppNumberManager {
    constructor(publishedAppsRepoUrl) {
        this.publishedAppsRepoUrl = publishedAppsRepoUrl;
        this.tempDir = './temp-published-apps';
    }

    /**
     * 最新のアプリ番号を取得
     * @returns {number} 次に使用すべきアプリ番号
     */
    async getNextAppNumber() {
        try {
            // 一時的にREADME.mdのみ取得（容量対策）
            this.fetchAppList();
            
            const readmePath = path.join(this.tempDir, 'README.md');
            
            if (!fs.existsSync(readmePath)) {
                console.log('README.mdが見つかりません。最初のアプリとして001を返します。');
                return 1;
            }

            const readmeContent = fs.readFileSync(readmePath, 'utf8');
            const appNumbers = this.extractAppNumbers(readmeContent);
            
            if (appNumbers.length === 0) {
                return 1;
            }

            const maxNumber = Math.max(...appNumbers);
            const nextNumber = maxNumber + 1;

            console.log(`現在の最大アプリ番号: ${maxNumber}`);
            console.log(`次のアプリ番号: ${nextNumber}`);

            return nextNumber;

        } catch (error) {
            console.error('アプリ番号取得エラー:', error.message);
            console.log('エラーのため001を返します。');
            return 1;
        } finally {
            this.cleanup();
        }
    }

    /**
     * published-appsのREADME.mdのみを取得
     */
    fetchAppList() {
        try {
            // 既存の一時ディレクトリを削除
            if (fs.existsSync(this.tempDir)) {
                execSync(`rm -rf ${this.tempDir}`);
            }

            // sparse-checkoutでREADME.mdのみクローン
            execSync(`git clone --no-checkout --depth 1 ${this.publishedAppsRepoUrl} ${this.tempDir}`, 
                     { stdio: 'pipe' });
            
            process.chdir(this.tempDir);
            execSync('git sparse-checkout init --cone');
            execSync('git sparse-checkout set README.md');
            execSync('git checkout');
            process.chdir('..');

            console.log('README.md取得完了');

        } catch (error) {
            console.error('リポジトリ取得エラー:', error.message);
            // リポジトリが存在しない場合は新規作成として扱う
            if (!fs.existsSync(this.tempDir)) {
                fs.mkdirSync(this.tempDir, { recursive: true });
            }
        }
    }

    /**
     * README.mdからアプリ番号を抽出
     * @param {string} content README.mdの内容
     * @returns {number[]} アプリ番号の配列
     */
    extractAppNumbers(content) {
        // app-001-abc123 形式からアプリ番号を抽出
        const appPattern = /app-(\d{3})-[a-z0-9]{6}/g;
        const numbers = [];
        let match;

        while ((match = appPattern.exec(content)) !== null) {
            numbers.push(parseInt(match[1], 10));
        }

        return [...new Set(numbers)]; // 重複除去
    }

    /**
     * 一時ディレクトリを削除
     */
    cleanup() {
        try {
            if (fs.existsSync(this.tempDir)) {
                execSync(`rm -rf ${this.tempDir}`);
            }
        } catch (error) {
            console.error('クリーンアップエラー:', error.message);
        }
    }

    /**
     * アプリ番号を3桁ゼロパディング形式で返す
     * @param {number} number アプリ番号
     * @returns {string} 3桁ゼロパディング番号
     */
    formatAppNumber(number) {
        return String(number).padStart(3, '0');
    }
}

// CLI実行時の処理
if (require.main === module) {
    const repoUrl = process.argv[2] || 'https://github.com/[USERNAME]/published-apps';
    const manager = new AppNumberManager(repoUrl);
    
    manager.getNextAppNumber().then(number => {
        const formatted = manager.formatAppNumber(number);
        console.log(`Next app number: ${formatted}`);
        process.exit(0);
    }).catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
}

module.exports = AppNumberManager;