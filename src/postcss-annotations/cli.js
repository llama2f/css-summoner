#!/usr/bin/env node

/**
 * postcss-css-annotations CLI
 * CSSファイルからアノテーションを抽出するコマンドラインツール
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const plugin = require('./src/index');
const glob = require('glob');

// コマンドライン引数の解析
const args = process.argv.slice(2);
const options = {
  input: null,
  output: './annotations.json',
  verbose: false,
};

// 引数を解析
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  } else if (arg === '--output' || arg === '-o') {
    options.output = args[++i];
  } else if (arg === '--verbose' || arg === '-v') {
    options.verbose = true;
  } else if (!arg.startsWith('-')) {
    options.input = arg;
  }
}

// 入力が指定されているか確認
if (!options.input) {
  console.error('エラー: 入力ファイルまたはパターンを指定してください');
  printHelp();
  process.exit(1);
}

// ヘルプを表示
function printHelp() {
  console.log(`
postcss-css-annotations CLI
CSSファイルからアノテーションを抽出するコマンドラインツール

使い方:
  npx postcss-css-annotations <input-path> [options]

引数:
  <input-path>             入力CSSファイルまたはglobパターン

オプション:
  -o, --output <path>      出力JSONファイルのパス（デフォルト: ./annotations.json）
  -v, --verbose            詳細なログを表示
  -h, --help               ヘルプを表示

例:
  npx postcss-css-annotations ./src/styles/**/*.css --output ./annotations.json
  npx postcss-css-annotations ./src/styles/button.css --verbose
  `);
}

// メイン処理
async function main() {
  try {
    if (options.verbose) {
      console.log(`入力パターン: ${options.input}`);
      console.log(`出力ファイル: ${options.output}`);
    }

    // 入力ファイルを検索
    const inputFiles = glob.sync(options.input);

    if (inputFiles.length === 0) {
      console.error(
        `エラー: パターン "${options.input}" に一致するファイルが見つかりませんでした`,
      );
      process.exit(1);
    }

    console.log(`${inputFiles.length}個のCSSファイルを処理します...`);

    // 各ファイルを処理
    const mergedData = {
      componentTypes: {},
      baseClasses: {},
      componentVariants: {},
      classDescriptions: {},
      componentExamples: {},
      classRuleDetails: {},
      meta: {
        totalFiles: inputFiles.length,
        totalClasses: 0,
        errors: [],
        sources: [],
      },
    };

    for (const file of inputFiles) {
      if (options.verbose) {
        console.log(`処理中: ${file}`);
      }

      const css = fs.readFileSync(file, 'utf8');

      // PostCSSプラグインを実行
      const result = await postcss([
        plugin({ verbose: options.verbose }),
      ]).process(css, { from: file });

      // 抽出データを取得
      const dataMessage = result.messages.find(
        (msg) => msg.type === 'css-annotations-data',
      );

      if (dataMessage && dataMessage.data) {
        const data = dataMessage.data;

        // マージ処理
        mergeData(mergedData, data);

        // メタ情報を更新
        mergedData.meta.totalClasses += data.meta.totalClasses;
        mergedData.meta.errors.push(...data.meta.errors);
        mergedData.meta.sources.push(data.meta.source);

        if (options.verbose) {
          console.log(`  ${data.meta.totalClasses}個のクラスを抽出しました`);
        }
      }
    }

    // 結果を出力
    console.log(
      `抽出完了: 合計${mergedData.meta.totalClasses}個のクラスを抽出しました`,
    );

    if (mergedData.meta.errors.length > 0) {
      console.warn(`${mergedData.meta.errors.length}件のエラーがありました:`);
      for (const error of mergedData.meta.errors) {
        console.warn(`  - ${error}`);
      }
    }

    // ディレクトリを作成
    const outputDir = path.dirname(options.output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // JSONファイルに保存
    fs.writeFileSync(options.output, JSON.stringify(mergedData, null, 2));

    console.log(`抽出データを ${options.output} に保存しました`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

/**
 * 抽出データをマージする
 * @param {Object} target マージ先のデータ
 * @param {Object} source マージ元のデータ
 */
function mergeData(target, source) {
  // componentTypes のマージ
  for (const [component, classes] of Object.entries(source.componentTypes)) {
    if (!target.componentTypes[component]) {
      target.componentTypes[component] = [];
    }

    for (const className of classes) {
      if (!target.componentTypes[component].includes(className)) {
        target.componentTypes[component].push(className);
      }
    }
  }

  // baseClasses のマージ
  Object.assign(target.baseClasses, source.baseClasses);

  // componentVariants のマージ
  for (const [component, variants] of Object.entries(
    source.componentVariants,
  )) {
    if (!target.componentVariants[component]) {
      target.componentVariants[component] = {};
    }
    Object.assign(target.componentVariants[component], variants);
  }

  // classDescriptions のマージ
  Object.assign(target.classDescriptions, source.classDescriptions);

  // componentExamples のマージ
  if (source.componentExamples) {
    for (const [component, examples] of Object.entries(
      source.componentExamples,
    )) {
      if (!target.componentExamples[component]) {
        target.componentExamples[component] = [];
      }
      target.componentExamples[component].push(...examples);
    }
  }

  // classRuleDetails のマージ
  if (source.classRuleDetails) {
    Object.assign(target.classRuleDetails, source.classRuleDetails);
  }
}

// 実行
main().catch(console.error);
