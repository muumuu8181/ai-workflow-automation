#!/usr/bin/env node

/**
 * ワークヒストリー管理システム
 * 作業ログ・開始/終了時刻・実行結果を記録
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class WorkHistoryManager {
    constructor() {
        this.configDir = path.join(os.homedir(), '.ai-workflow');
        this.historyFile = path.join(this.configDir, 'work-history.json');
        this.ensureConfigDir();
    }

    /**
     * 設定ディレクトリの確保
     */
    ensureConfigDir() {
        if (!fs.existsSync(this.configDir)) {
            fs.mkdirSync(this.configDir, { recursive: true });
        }
    }

    /**
     * 現在時刻をISO形式で取得
     * @returns {string} ISO形式の現在時刻
     */
    getCurrentTimestamp() {
        return new Date().toISOString();
    }

    /**
     * 人間が読みやすい形式の現在時刻を取得
     * @returns {string} 読みやすい時刻形式
     */
    getReadableTimestamp() {
        const now = new Date();
        return now.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Tokyo'
        });
    }

    /**
     * 作業履歴を読み込み
     * @returns {object} 作業履歴データ
     */
    loadHistory() {
        if (!fs.existsSync(this.historyFile)) {
            return {
                version: '1.0.0',
                created: this.getCurrentTimestamp(),
                sessions: [],
                statistics: {
                    totalSessions: 0,
                    totalAppsGenerated: 0,
                    totalWorkTime: 0,
                    averageWorkTime: 0
                }
            };
        }

        try {
            const data = fs.readFileSync(this.historyFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.warn('⚠️ 履歴ファイル読み取りエラー、新規作成します');
            return this.loadHistory(); // 再帰的に新規作成
        }
    }

    /**
     * 作業履歴を保存
     * @param {object} history 履歴データ
     */
    saveHistory(history) {
        try {
            const jsonString = JSON.stringify(history, null, 2);
            fs.writeFileSync(this.historyFile, jsonString, 'utf8');
        } catch (error) {
            console.error('❌ 履歴保存エラー:', error.message);
        }
    }

    /**
     * 新しい作業セッションを開始
     * @param {string} terminalId 端末ID
     * @returns {string} セッションID
     */
    startSession(terminalId) {
        const history = this.loadHistory();
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        
        const newSession = {
            sessionId,
            terminalId,
            startTime: this.getCurrentTimestamp(),
            startTimeReadable: this.getReadableTimestamp(),
            endTime: null,
            endTimeReadable: null,
            duration: null,
            status: 'in_progress',
            appGenerated: null,
            appId: null,
            appTitle: null,
            logs: [],
            errors: [],
            metadata: {
                hostname: os.hostname(),
                platform: os.platform(),
                username: os.userInfo().username
            }
        };

        history.sessions.push(newSession);
        history.statistics.totalSessions++;
        
        this.saveHistory(history);
        
        console.log(`🚀 作業セッション開始: ${sessionId}`);
        console.log(`📅 開始時刻: ${newSession.startTimeReadable}`);
        
        return sessionId;
    }

    /**
     * 作業セッションを完了
     * @param {string} sessionId セッションID
     * @param {string} appId 生成されたアプリID
     * @param {string} appTitle アプリタイトル
     * @param {string} status 完了ステータス（success/error/cancelled）
     */
    completeSession(sessionId, appId, appTitle, status = 'success') {
        const history = this.loadHistory();
        const sessionIndex = history.sessions.findIndex(s => s.sessionId === sessionId);
        
        if (sessionIndex === -1) {
            console.warn('⚠️ セッションが見つかりません:', sessionId);
            return;
        }

        const session = history.sessions[sessionIndex];
        const endTime = this.getCurrentTimestamp();
        const endTimeReadable = this.getReadableTimestamp();
        
        // 作業時間計算（秒）
        const startMs = new Date(session.startTime).getTime();
        const endMs = new Date(endTime).getTime();
        const durationSeconds = Math.round((endMs - startMs) / 1000);
        const durationMinutes = Math.round(durationSeconds / 60 * 100) / 100;

        // セッション更新
        session.endTime = endTime;
        session.endTimeReadable = endTimeReadable;
        session.duration = durationSeconds;
        session.status = status;
        session.appGenerated = status === 'success';
        session.appId = appId;
        session.appTitle = appTitle;

        // 統計更新
        history.statistics.totalWorkTime += durationSeconds;
        if (status === 'success') {
            history.statistics.totalAppsGenerated++;
        }
        
        // 平均作業時間計算
        const completedSessions = history.sessions.filter(s => s.duration !== null);
        if (completedSessions.length > 0) {
            const totalTime = completedSessions.reduce((sum, s) => sum + s.duration, 0);
            history.statistics.averageWorkTime = Math.round(totalTime / completedSessions.length);
        }

        this.saveHistory(history);
        
        console.log(`✅ 作業セッション完了: ${sessionId}`);
        console.log(`📅 終了時刻: ${endTimeReadable}`);
        console.log(`⏱️  作業時間: ${durationMinutes}分 (${durationSeconds}秒)`);
        console.log(`📱 生成アプリ: ${appTitle} (${appId})`);
    }

    /**
     * セッションにログを追加
     * @param {string} sessionId セッションID
     * @param {string} message ログメッセージ
     * @param {string} level ログレベル（info/warn/error）
     */
    addLog(sessionId, message, level = 'info') {
        const history = this.loadHistory();
        const session = history.sessions.find(s => s.sessionId === sessionId);
        
        if (!session) {
            console.warn('⚠️ セッションが見つかりません:', sessionId);
            return;
        }

        const logEntry = {
            timestamp: this.getCurrentTimestamp(),
            timestampReadable: this.getReadableTimestamp(),
            level,
            message
        };

        if (level === 'error') {
            session.errors.push(logEntry);
        } else {
            session.logs.push(logEntry);
        }

        this.saveHistory(history);
    }

    /**
     * 最新のセッションIDを取得
     * @returns {string|null} 最新のセッションID
     */
    getLatestSessionId() {
        const history = this.loadHistory();
        if (history.sessions.length === 0) return null;
        
        const inProgressSession = history.sessions.find(s => s.status === 'in_progress');
        if (inProgressSession) return inProgressSession.sessionId;
        
        return history.sessions[history.sessions.length - 1].sessionId;
    }

    /**
     * 作業履歴統計を表示
     */
    showStatistics() {
        const history = this.loadHistory();
        const stats = history.statistics;
        
        console.log('📊 作業統計:');
        console.log(`   総セッション数: ${stats.totalSessions}`);
        console.log(`   生成アプリ数: ${stats.totalAppsGenerated}`);
        console.log(`   総作業時間: ${Math.round(stats.totalWorkTime / 60)}分`);
        console.log(`   平均作業時間: ${Math.round(stats.averageWorkTime / 60)}分`);
        console.log(`   成功率: ${stats.totalSessions > 0 ? Math.round(stats.totalAppsGenerated / stats.totalSessions * 100) : 0}%`);
    }

    /**
     * 最近の作業履歴を表示
     * @param {number} count 表示件数
     */
    showRecentHistory(count = 5) {
        const history = this.loadHistory();
        const recentSessions = history.sessions.slice(-count).reverse();
        
        console.log(`📋 最近の作業履歴 (${count}件):`);
        recentSessions.forEach((session, index) => {
            const status = session.status === 'success' ? '✅' : 
                          session.status === 'error' ? '❌' : '🔄';
            const duration = session.duration ? `${Math.round(session.duration / 60)}分` : '実行中';
            
            console.log(`   ${index + 1}. ${status} ${session.appTitle || 'Unknown'} (${duration})`);
            console.log(`      ${session.startTimeReadable}`);
        });
    }
}

// CLI実行時の処理
if (require.main === module) {
    const manager = new WorkHistoryManager();
    
    const command = process.argv[2] || 'help';
    
    switch (command) {
        case 'start':
            const terminalId = process.argv[3] || 'unknown-terminal';
            const sessionId = manager.startSession(terminalId);
            console.log(sessionId); // パイプで取得用
            break;
            
        case 'complete':
            const completeSessionId = process.argv[3];
            const appId = process.argv[4];
            const appTitle = process.argv[5] || 'Unknown App';
            const status = process.argv[6] || 'success';
            
            if (completeSessionId && appId) {
                manager.completeSession(completeSessionId, appId, appTitle, status);
            } else {
                console.error('使用方法: node work-history-manager.cjs complete <sessionId> <appId> [appTitle] [status]');
            }
            break;
            
        case 'log':
            const logSessionId = process.argv[3];
            const message = process.argv[4];
            const level = process.argv[5] || 'info';
            
            if (logSessionId && message) {
                manager.addLog(logSessionId, message, level);
            } else {
                console.error('使用方法: node work-history-manager.cjs log <sessionId> <message> [level]');
            }
            break;
            
        case 'latest':
            const latestId = manager.getLatestSessionId();
            if (latestId) {
                console.log(latestId);
            } else {
                console.log('no-session');
            }
            break;
            
        case 'stats':
            manager.showStatistics();
            break;
            
        case 'history':
            const count = parseInt(process.argv[3]) || 5;
            manager.showRecentHistory(count);
            break;
            
        default:
            console.log('📝 ワークヒストリー管理システム');
            console.log('');
            console.log('使用方法:');
            console.log('  node work-history-manager.cjs start <terminalId>     # セッション開始');
            console.log('  node work-history-manager.cjs complete <sessionId> <appId> [title] [status] # セッション完了');
            console.log('  node work-history-manager.cjs log <sessionId> <message> [level] # ログ追加');
            console.log('  node work-history-manager.cjs latest                 # 最新セッションID取得');
            console.log('  node work-history-manager.cjs stats                  # 統計表示');
            console.log('  node work-history-manager.cjs history [count]        # 履歴表示');
            break;
    }
}

module.exports = WorkHistoryManager;