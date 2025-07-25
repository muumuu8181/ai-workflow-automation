#!/usr/bin/env node

/**
 * 端末ID管理システム
 * 各端末に一意なIDを生成・管理し、重複処理を防止
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

class TerminalIdManager {
    constructor() {
        this.configDir = path.join(os.homedir(), '.ai-workflow');
        this.terminalIdFile = path.join(this.configDir, 'terminal-id.json');
        this.completedAppsFile = path.join(this.configDir, 'completed-apps.json');
    }

    /**
     * 端末IDを取得または生成
     * @returns {string} 端末ID
     */
    getOrCreateTerminalId() {
        // 設定ディレクトリを作成
        if (!fs.existsSync(this.configDir)) {
            fs.mkdirSync(this.configDir, { recursive: true });
        }

        // 既存の端末IDを確認
        if (fs.existsSync(this.terminalIdFile)) {
            try {
                const config = JSON.parse(fs.readFileSync(this.terminalIdFile, 'utf8'));
                if (config.terminalId && this.validateTerminalId(config.terminalId)) {
                    console.log(`✅ 既存端末ID: ${config.terminalId}`);
                    return config.terminalId;
                }
            } catch (error) {
                console.warn('⚠️ 端末ID設定ファイル読み取りエラー、新規生成します');
            }
        }

        // 新しい端末IDを生成
        const terminalId = this.generateTerminalId();
        this.saveTerminalId(terminalId);
        console.log(`🆕 新規端末ID生成: ${terminalId}`);
        return terminalId;
    }

    /**
     * 端末IDを生成
     * @returns {string} 一意な端末ID
     */
    generateTerminalId() {
        // ホスト名 + ユーザー名 + タイムスタンプ + ランダム
        const hostname = os.hostname().toLowerCase().replace(/[^a-z0-9]/g, '');
        const username = os.userInfo().username.toLowerCase().replace(/[^a-z0-9]/g, '');
        const timestamp = Date.now().toString(36);
        const random = crypto.randomBytes(3).toString('hex');
        
        return `${hostname}-${username}-${timestamp}-${random}`;
    }

    /**
     * 端末IDの妥当性確認
     * @param {string} terminalId 確認対象の端末ID
     * @returns {boolean} 有効かどうか
     */
    validateTerminalId(terminalId) {
        return typeof terminalId === 'string' && 
               terminalId.length > 10 && 
               /^[a-z0-9\-]+$/.test(terminalId);
    }

    /**
     * 端末IDを保存
     * @param {string} terminalId 端末ID
     */
    saveTerminalId(terminalId) {
        const config = {
            terminalId,
            created: new Date().toISOString(),
            hostname: os.hostname(),
            username: os.userInfo().username,
            platform: os.platform(),
            version: '1.0.0'
        };

        fs.writeFileSync(this.terminalIdFile, JSON.stringify(config, null, 2));
    }

    /**
     * アプリ完了記録を追加
     * @param {string} appId アプリID
     * @param {string} appTitle アプリタイトル
     */
    markAppCompleted(appId, appTitle) {
        const terminalId = this.getOrCreateTerminalId();
        let completedApps = [];

        // 既存の完了記録を読み込み
        if (fs.existsSync(this.completedAppsFile)) {
            try {
                const data = JSON.parse(fs.readFileSync(this.completedAppsFile, 'utf8'));
                completedApps = data.completed || [];
            } catch (error) {
                console.warn('⚠️ 完了記録読み取りエラー');
            }
        }

        // 新しい完了記録を追加
        const completedRecord = {
            appId,
            appTitle,
            terminalId,
            completedAt: new Date().toISOString()
        };

        completedApps.push(completedRecord);

        // 保存
        const data = {
            terminalId,
            completed: completedApps,
            lastUpdated: new Date().toISOString()
        };

        fs.writeFileSync(this.completedAppsFile, JSON.stringify(data, null, 2));
        console.log(`✅ アプリ完了記録: ${appTitle} (${appId})`);
    }

    /**
     * この端末で完了済みのアプリIDリストを取得
     * @returns {string[]} 完了済みアプリIDの配列
     */
    getCompletedAppIds() {
        const terminalId = this.getOrCreateTerminalId();

        if (!fs.existsSync(this.completedAppsFile)) {
            return [];
        }

        try {
            const data = JSON.parse(fs.readFileSync(this.completedAppsFile, 'utf8'));
            if (data.terminalId !== terminalId) {
                return []; // 異なる端末の記録
            }

            return (data.completed || []).map(record => record.appId);
        } catch (error) {
            console.warn('⚠️ 完了記録読み取りエラー');
            return [];
        }
    }

    /**
     * 指定のアプリがこの端末で完了済みかチェック
     * @param {string} appId アプリID
     * @returns {boolean} 完了済みかどうか
     */
    isAppCompleted(appId) {
        const completedIds = this.getCompletedAppIds();
        return completedIds.includes(appId);
    }

    /**
     * 端末情報を表示
     */
    showTerminalInfo() {
        const terminalId = this.getOrCreateTerminalId();
        const completedIds = this.getCompletedAppIds();

        console.log('🖥️  端末情報:');
        console.log(`   端末ID: ${terminalId}`);
        console.log(`   ホスト名: ${os.hostname()}`);
        console.log(`   ユーザー: ${os.userInfo().username}`);
        console.log(`   完了済みアプリ数: ${completedIds.length}`);
        
        if (completedIds.length > 0) {
            console.log('   完了済みアプリ:');
            completedIds.forEach((id, index) => {
                console.log(`     ${index + 1}. ${id}`);
            });
        }
    }
}

// CLI実行時の処理
if (require.main === module) {
    const manager = new TerminalIdManager();
    
    const command = process.argv[2] || 'get';
    
    switch (command) {
        case 'get':
            console.log(manager.getOrCreateTerminalId());
            break;
            
        case 'info':
            manager.showTerminalInfo();
            break;
            
        case 'complete':
            const appId = process.argv[3];
            const appTitle = process.argv[4] || 'Unknown App';
            if (appId) {
                manager.markAppCompleted(appId, appTitle);
            } else {
                console.error('使用方法: node terminal-id-manager.cjs complete <appId> [appTitle]');
            }
            break;
            
        case 'check':
            const checkAppId = process.argv[3];
            if (checkAppId) {
                const isCompleted = manager.isAppCompleted(checkAppId);
                console.log(isCompleted ? 'completed' : 'not-completed');
            } else {
                console.error('使用方法: node terminal-id-manager.cjs check <appId>');
            }
            break;
            
        default:
            console.log('使用方法:');
            console.log('  node terminal-id-manager.cjs get      # 端末ID取得');
            console.log('  node terminal-id-manager.cjs info     # 端末情報表示');
            console.log('  node terminal-id-manager.cjs complete <appId> [title] # 完了記録');
            console.log('  node terminal-id-manager.cjs check <appId>    # 完了チェック');
            break;
    }
}

module.exports = TerminalIdManager;