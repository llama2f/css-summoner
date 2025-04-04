#!/usr/bin/env node
// css-builder.cjs - コマンドラインインターフェース

const { program } = require('commander');
const { main } = require('./index.js');
const { version } = require('./package.json');

// コマンドラインオプションの設定
program
  .name('css-builder')
  .description('CSSファイルからコンポーネント情報を抽出し、型定義やドキュメントを生成します')
  .version(version || '1.0.0')
  .option('-t, --types', '型定義ファイルのみを生成する')
  .option('-d, --docs', 'ドキュメントページのみを生成する')
  .option('-c, --components', 'Astroコンポーネントのみを生成する')
  .option('-a, --all', '全てのファイルを生成する（型定義、ドキュメント、コンポーネント）')
  .option('-f, --force', '既存のファイルを確認なしに上書きする')
  .option('-v, --verbose', '詳細なログ出力を表示する')
  .option('-s, --silent', '最小限のログ出力のみを表示する')
  .option('--astro', 'Astroドキュメントページを生成する（従来のオプション）')
  .option('-o, --output <path>', '出力先ディレクトリを指定する');

// ヘルプコマンドの追加例
program
  .command('init')
  .description('CSS Builderの初期設定ファイルを生成します')
  .action(() => {
    console.log('初期設定ファイルを生成します...');
    // 初期化処理を実装
  });

// コマンドラインを解析
program.parse(process.argv);

// メイン処理を実行
async function runCli() {
  const options = program.opts();
  
  // コマンドライン引数を環境変数に変換
  process.env.CSS_BUILDER_FORCE = options.force ? 'true' : 'false';
  process.env.CSS_BUILDER_VERBOSE = options.verbose ? 'true' : 'false';
  process.env.CSS_BUILDER_SILENT = options.silent ? 'true' : 'false';
  
  if (options.output) {
    process.env.CSS_BUILDER_OUTPUT_PATH = options.output;
  }
  
  // メイン処理を実行
  const success = await main();
  process.exit(success ? 0 : 1);
}

runCli().catch(err => {
  console.error('予期せぬエラーが発生しました:', err);
  process.exit(1);
});
