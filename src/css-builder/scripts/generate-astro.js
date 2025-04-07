// scripts/generate-astro.js - Astroコンポーネント生成用スクリプト
import { generateAstroComponents } from '../generators/astroComponentGenerator.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import config from './config.js'; // 設定ファイルをインポート

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// コマンドライン引数解析
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    handlersPath: null,
    outputDir: null,
    force: false,
    verbose: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--handlers' || arg === '-h') {
      options.handlersPath = args[++i];
    }
    else if (arg === '--output' || arg === '-o') {
      options.outputDir = args[++i];
    }
    else if (arg === '--force' || arg === '-f') {
      options.force = true;
    }
    else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    }
  }
  
  return options;
}

// メイン処理
async function main() {
  try {
    const options = parseArgs();
    
    // デフォルトパス設定
    const handlersPath = options.handlersPath || 
                        config.paths.handlersDir || 
                        path.resolve(projectRoot, 'templates/handlers/auto');
    
    const outputDir = options.outputDir || 
                     config.paths.output.components || 
                     path.resolve(projectRoot, 'dist/components');
    
    // ハンドラーディレクトリの存在確認
    if (!fs.existsSync(handlersPath)) {
      console.error(`エラー: ハンドラーディレクトリが見つかりません: ${handlersPath}`);
      console.log('--handlers オプションで正しいパスを指定してください');
      process.exit(1);
    }
    
    // ディレクトリ内のハンドラーファイルを確認
    const files = fs.readdirSync(handlersPath);
    const handlerFiles = files.filter(file => 
      file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.mjs')
    );
    
    if (handlerFiles.length === 0) {
      console.warn(`警告: ハンドラーファイルが見つかりません: ${handlersPath}`);
      console.log('有効なハンドラーファイル (.js, .jsx, .mjs) が必要です');
    } else {
      console.log(`${handlerFiles.length}個のハンドラーファイルを処理します:`);
      handlerFiles.forEach(file => console.log(`- ${file}`));
    }
    
    // Astroコンポーネント生成の実行
    const genOptions = {
      force: options.force || config.fileOperations.forceByType.components, // 設定ファイルから上書き設定を取得
      verbose: options.verbose,
      autoConfirm: options.force // forceが指定されている場合は自動確認
    };
    
    const result = await generateAstroComponents(handlersPath, outputDir, genOptions);
    
    if (result.errorCount === 0) {
      console.log(`✅ すべての処理が完了しました。${result.generatedCount}個のコンポーネントを生成しました。`);
    } else {
      console.warn(`⚠️ 処理完了: ${result.generatedCount}個のコンポーネントを生成、${result.errorCount}個のエラーがありました。`);
      process.exit(1);
    }
  } catch (error) {
    console.error('予期せぬエラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
main();
