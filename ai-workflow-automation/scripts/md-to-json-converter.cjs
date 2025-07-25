#!/usr/bin/env node

/**
 * Markdown形式のアプリ要求をJSON形式に変換
 * 自然言語 → 構造化データ変換システム
 */

const fs = require('fs');
const crypto = require('crypto');

class MarkdownToJsonConverter {
    constructor() {
        this.priorityKeywords = ['最優先', 'urgent', '高優先度', 'ASAP'];
        this.techKeywords = ['HTML', 'JavaScript', 'CSS', 'React', 'Vue', 'Python', 'Node.js'];
    }

    /**
     * Markdownファイルを読み込んでJSON形式に変換
     * @param {string} mdFilePath Markdownファイルのパス
     * @returns {object} JSON形式のアプリ要求データ
     */
    convertFile(mdFilePath) {
        if (!fs.existsSync(mdFilePath)) {
            throw new Error(`File not found: ${mdFilePath}`);
        }

        const content = fs.readFileSync(mdFilePath, 'utf8');
        return this.convertText(content);
    }

    /**
     * Markdownテキストを解析してJSON形式に変換
     * @param {string} content Markdownテキスト
     * @returns {object} JSON形式データ
     */
    convertText(content) {
        const lines = content.split('\n');
        const requests = [];
        let currentApp = null;

        for (let line of lines) {
            line = line.trim();

            // アプリ名の検出（## で始まる行）
            if (line.startsWith('## ') && !line.includes('書き方') && !line.includes('例')) {
                // 前のアプリを保存
                if (currentApp) {
                    requests.push(this.finalizeApp(currentApp));
                }

                // 新しいアプリを開始
                currentApp = this.parseAppHeader(line);
            }
            // 要件の検出（- で始まる行）
            else if (line.startsWith('- ') && currentApp) {
                const requirement = line.substring(2).trim();
                if (requirement && !requirement.startsWith('[') && !requirement.includes('要件')) {
                    currentApp.requirements.push(requirement);
                }
            }
        }

        // 最後のアプリを保存
        if (currentApp) {
            requests.push(this.finalizeApp(currentApp));
        }

        return {
            requests,
            metadata: {
                version: "1.0.0",
                last_updated: new Date().toISOString().split('T')[0],
                total_requests: requests.length,
                converted_from: "markdown",
                description: "AI自動化ワークフロー用アプリ要求リスト（Markdown変換）"
            }
        };
    }

    /**
     * アプリヘッダーを解析（## アプリ名）
     * @param {string} line ヘッダー行
     * @returns {object} アプリオブジェクトの初期状態
     */
    parseAppHeader(line) {
        const fullTitle = line.substring(3).trim(); // "## " を除去
        
        // 優先度とテクノロジーの抽出
        const priority = this.extractPriority(fullTitle);
        const techPreferences = this.extractTechPreferences(fullTitle);
        const cleanTitle = this.cleanTitle(fullTitle);

        return {
            id: this.generateId(cleanTitle),
            title: cleanTitle,
            priority: priority || "medium",
            requirements: [],
            tech_preferences: techPreferences,
            estimated_complexity: "medium",
            created_date: new Date().toISOString().split('T')[0],
            notes: ""
        };
    }

    /**
     * タイトルから優先度を抽出
     * @param {string} title タイトル文字列
     * @returns {string|null} 優先度
     */
    extractPriority(title) {
        for (const keyword of this.priorityKeywords) {
            if (title.includes(`[${keyword}]`)) {
                return keyword === '最優先' ? '最優先' : 
                       keyword === 'urgent' ? 'urgent' :
                       keyword === '高優先度' ? 'high' : 'ASAP';
            }
        }
        return null;
    }

    /**
     * タイトルから技術設定を抽出
     * @param {string} title タイトル文字列 
     * @returns {string[]} 技術配列
     */
    extractTechPreferences(title) {
        const techs = [];
        for (const tech of this.techKeywords) {
            if (title.includes(`[${tech}]`)) {
                techs.push(tech);
            }
        }
        return techs.length > 0 ? techs : ["HTML", "JavaScript", "CSS"];
    }

    /**
     * タイトルから[...]を除去してクリーンアップ
     * @param {string} title 元のタイトル
     * @returns {string} クリーンなタイトル
     */
    cleanTitle(title) {
        return title.replace(/\[.*?\]/g, '').trim();
    }

    /**
     * アプリ名からIDを自動生成
     * @param {string} title アプリ名
     * @returns {string} 一意なID
     */
    generateId(title) {
        const baseId = title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        const randomSuffix = crypto.randomBytes(2).toString('hex');
        return `${baseId}-${randomSuffix}`;
    }

    /**
     * アプリオブジェクトを最終化
     * @param {object} app アプリオブジェクト
     * @returns {object} 完成したアプリオブジェクト
     */
    finalizeApp(app) {
        // 複雑度を要件数から推定
        if (app.requirements.length <= 2) {
            app.estimated_complexity = "low";
        } else if (app.requirements.length >= 5) {
            app.estimated_complexity = "high";
        }

        // 簡単なメモを自動生成
        app.notes = `${app.requirements.length}件の要件を含むアプリ`;

        return app;
    }

    /**
     * JSON結果をファイルに保存
     * @param {object} jsonData JSON データ
     * @param {string} outputPath 出力ファイルパス
     */
    saveToFile(jsonData, outputPath) {
        const jsonString = JSON.stringify(jsonData, null, 2);
        fs.writeFileSync(outputPath, jsonString, 'utf8');
        console.log(`✅ JSON変換完了: ${outputPath}`);
        console.log(`📊 変換されたアプリ数: ${jsonData.requests.length}`);
    }
}

// CLI実行時の処理
if (require.main === module) {
    const converter = new MarkdownToJsonConverter();
    
    const mdFile = process.argv[2] || './app-requests.md';
    const outputFile = process.argv[3] || './app-requests.json';

    try {
        console.log('🔄 Markdown → JSON 変換開始...');
        const jsonData = converter.convertFile(mdFile);
        converter.saveToFile(jsonData, outputFile);
        
        // プレビュー表示
        console.log('\n📋 変換されたアプリ一覧:');
        jsonData.requests.forEach((app, index) => {
            console.log(`${index + 1}. ${app.title} (${app.priority}) - ${app.requirements.length}件の要件`);
        });
        
    } catch (error) {
        console.error('❌ 変換エラー:', error.message);
        process.exit(1);
    }
}

module.exports = MarkdownToJsonConverter;