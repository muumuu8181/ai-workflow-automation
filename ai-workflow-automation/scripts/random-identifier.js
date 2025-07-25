#!/usr/bin/env node

/**
 * 乱数識別子付与システム
 * 6文字英数字の識別子を生成し、重複回避を実装
 */

const crypto = require('crypto');
const fs = require('fs');

class RandomIdentifier {
    constructor() {
        // 読みやすさを考慮して紛らわしい文字を除外
        this.characters = 'abcdefghijkmnpqrstuvwxyz23456789';
        this.length = 6;
    }

    /**
     * 乱数識別子を生成
     * @returns {string} 6文字の英数字識別子
     */
    generate() {
        let result = '';
        
        for (let i = 0; i < this.length; i++) {
            const randomIndex = crypto.randomInt(0, this.characters.length);
            result += this.characters.charAt(randomIndex);
        }

        return result;
    }

    /**
     * 重複チェック付き識別子生成
     * @param {string[]} existingIdentifiers 既存の識別子一覧
     * @param {number} maxAttempts 最大試行回数
     * @returns {string} 重複しない識別子
     */
    generateUnique(existingIdentifiers = [], maxAttempts = 100) {
        const existingSet = new Set(existingIdentifiers);
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const identifier = this.generate();
            
            if (!existingSet.has(identifier)) {
                console.log(`識別子生成成功: ${identifier} (試行回数: ${attempt + 1})`);
                return identifier;
            }
        }

        // 最大試行回数に達した場合のフォールバック
        const timestamp = Date.now().toString(36).slice(-6);
        console.warn(`最大試行回数に達しました。タイムスタンプベース識別子を使用: ${timestamp}`);
        return timestamp;
    }

    /**
     * README.mdから既存の識別子を抽出
     * @param {string} readmeContent README.mdの内容
     * @returns {string[]} 既存の識別子一覧
     */
    extractExistingIdentifiers(readmeContent) {
        // app-001-abc123 形式から識別子部分を抽出
        const identifierPattern = /app-\d{3}-([a-z0-9]{6})/g;
        const identifiers = [];
        let match;

        while ((match = identifierPattern.exec(readmeContent)) !== null) {
            identifiers.push(match[1]);
        }

        return [...new Set(identifiers)]; // 重複除去
    }

    /**
     * 完全なアプリID（番号+識別子）を生成
     * @param {string} appNumber 3桁ゼロパディング番号（例: "001"）
     * @param {string[]} existingIdentifiers 既存の識別子一覧
     * @returns {object} アプリ情報オブジェクト
     */
    generateAppId(appNumber, existingIdentifiers = []) {
        const identifier = this.generateUnique(existingIdentifiers);
        const appId = `app-${appNumber}-${identifier}`;
        
        return {
            appNumber,
            identifier,
            appId,
            folderName: appId,
            url: `https://[username].github.io/published-apps/${appId}/`
        };
    }

    /**
     * 識別子の検証
     * @param {string} identifier 検証対象の識別子
     * @returns {boolean} 有効かどうか
     */
    validate(identifier) {
        if (typeof identifier !== 'string') return false;
        if (identifier.length !== this.length) return false;
        
        return [...identifier].every(char => 
            this.characters.includes(char.toLowerCase())
        );
    }

    /**
     * 複数の識別子を一括生成（デバッグ用）
     * @param {number} count 生成数
     * @returns {string[]} 識別子の配列
     */
    generateBatch(count = 10) {
        const batch = [];
        const existing = [];

        for (let i = 0; i < count; i++) {
            const identifier = this.generateUnique(existing);
            batch.push(identifier);
            existing.push(identifier);
        }

        return batch;
    }
}

// CLI実行時の処理
if (require.main === module) {
    const generator = new RandomIdentifier();
    
    const command = process.argv[2] || 'generate';
    
    switch (command) {
        case 'generate':
            console.log(generator.generate());
            break;
            
        case 'batch':
            const count = parseInt(process.argv[3]) || 10;
            const batch = generator.generateBatch(count);
            console.log('Generated identifiers:');
            batch.forEach((id, index) => {
                console.log(`${index + 1}: ${id}`);
            });
            break;
            
        case 'validate':
            const testId = process.argv[3];
            const isValid = generator.validate(testId);
            console.log(`${testId} is ${isValid ? 'valid' : 'invalid'}`);
            break;
            
        default:
            console.log('Usage:');
            console.log('  node random-identifier.js generate    # 識別子を1つ生成');
            console.log('  node random-identifier.js batch [n]   # n個の識別子を生成');
            console.log('  node random-identifier.js validate <id> # 識別子を検証');
            break;
    }
}

module.exports = RandomIdentifier;