#!/usr/bin/env node
/**
 * extract-jsx.js - JSXファイルからメタデータを抽出して表示するツール
 * 特定のJSXファイルまたはディレクトリを指定して、含まれるJSXファイルのメタデータを解析
 * 
 * 使用方法:
 *   node extract-jsx.js path/to/file.jsx          # 単一ファイルの解析
 *   node extract-jsx.js path/to/directory         # ディレクトリ内のすべてのJSXファイルを解析
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * JSXファイルからメタデータを抽出
 */
async function extractMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(`\n=== 解析: ${path.basename(filePath)} ===`);
    
    // ファイル全体から必要な情報を正規表現で抽出
    // type定義を抽出（複数の書き方に対応）
    let componentType = null;
    
    // 方法1: metadata内のtype定義を探す
    const typePattern = /type\s*:\s*['"]([^'"]*)['"]/;
    const typeMatch = content.match(typePattern);
    if (typeMatch && typeMatch[1]) {
      componentType = typeMatch[1];
      console.log(`✅ タイプ定義発見: "${componentType}"`);
    }
    
    // 方法2: デフォルトエクスポートのmetadata.typeを探す
    if (!componentType) {
      const defaultExportPattern = /export\s+default\s*\{([\s\S]*?)\};/;
      const defaultMatch = content.match(defaultExportPattern);
      if (defaultMatch) {
        const defaultContent = defaultMatch[1];
        if (defaultContent.includes('metadata')) {
          console.log('✅ デフォルトエクスポート内にmetadataを発見');
        }
      }
    }
    
    // メタデータブロックの抽出
    console.log('\n--- メタデータブロック ---');
    const metadataPattern = /export\s+const\s+metadata\s*=\s*\{([\s\S]*?)\};/;
    const metadataMatch = content.match(metadataPattern);
    if (metadataMatch) {
      console.log(metadataMatch[0]);
    } else {
      console.log('❌ メタデータブロックが見つかりません');
    }
    
    // バリアントブロックの抽出
    console.log('\n--- バリアント定義 ---');
    const variantsPattern = /export\s+const\s+variants\s*=\s*\{([\s\S]*?)\};/;
    const variantsMatch = content.match(variantsPattern);
    if (variantsMatch) {
      // 関数定義を抽出
      const functionPattern = /['"]([^'"]+)['"]\s*:/g;
      const variantContent = variantsMatch[1];
      let variantMatch;
      let variantCount = 0;
      
      console.log('バリアント一覧:');
      while ((variantMatch = functionPattern.exec(variantContent)) !== null) {
        console.log(`- ${variantMatch[1]}`);
        variantCount++;
      }
      
      console.log(`合計: ${variantCount}バリアント`);
    } else {
      console.log('❌ バリアント定義が見つかりません');
    }
    
    // 関数リファレンスの抽出
    console.log('\n--- 関数リファレンス ---');
    // render関数
    if (content.includes('export function render')) {
      console.log('✅ render関数あり');
    } else {
      console.log('❌ render関数なし');
    }
    
    // デフォルトエクスポート
    if (content.includes('export default {')) {
      console.log('✅ デフォルトエクスポートあり');
      
      // デフォルトエクスポートの内容を確認
      const defaultExportPattern = /export\s+default\s*\{([^{}]*(?:\{[^{}]*\})*[^{}]*)\};/;
      const defaultMatch = content.match(defaultExportPattern);
      if (defaultMatch) {
        const props = defaultMatch[1].split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
        console.log('エクスポートプロパティ:');
        props.forEach(prop => console.log(`- ${prop}`));
      }
    } else {
      console.log('❌ デフォルトエクスポートなし');
    }
    
    console.log('\n=== 解析終了 ===\n');
    
  } catch (err) {
    console.error(`エラー: ${filePath} の解析中にエラーが発生しました`);
    console.error(err);
  }
}

/**
 * ディレクトリ内のJSXファイルを処理
 */
async function processDirectory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.jsx'))
      .map(file => path.join(dirPath, file));
    
    console.log(`${files.length}個のJSXファイルを検出しました。\n`);
    
    for (const file of files) {
      await extractMetadata(file);
    }
  } catch (err) {
    console.error(`エラー: ${dirPath} の処理中にエラーが発生しました`);
    console.error(err);
  }
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('使用方法:');
    console.log('  node extract-jsx.js path/to/file.jsx     # 単一ファイルの解析');
    console.log('  node extract-jsx.js path/to/directory    # ディレクトリの解析');
    process.exit(1);
  }
  
  const target = args[0];
  
  try {
    const stats = fs.statSync(target);
    
    if (stats.isFile() && target.endsWith('.jsx')) {
      // 単一ファイルの処理
      await extractMetadata(target);
    } else if (stats.isDirectory()) {
      // ディレクトリの処理
      await processDirectory(target);
    } else {
      console.error('エラー: 指定されたパスはJSXファイルまたはディレクトリではありません。');
      process.exit(1);
    }
  } catch (err) {
    console.error(`エラー: ${target} を開けませんでした。`);
    console.error(err);
    process.exit(1);
  }
}

// スクリプト実行
main();
