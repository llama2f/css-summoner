// [非推奨] このスクリプトは非推奨です。代わりに node src/css-summoner-integration.js を使用してください。
// css-summonerへの移行完了後に削除予定です。

// index.js - メインスクリプト (ESM版)
import fs from 'fs'; // fsモジュールをインポート
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import { logger, fileUtils } from './utils.js';
import cssParser from './css-parser.js';
import typeGenerator from './type-generator.js';
import docGenerator from './generate-docs.js';

// ESMでは__dirnameは使えないため、import.meta.urlから取得
const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename); // 必要であれば

/**
 * コマンドラインオプションを環境変数に基づいて設定
 */
function configureOptions() {
	// 環境変数からオプションを読み取る
	config.fileOperations.force = process.env.CSS_BUILDER_FORCE === 'true';
	config.logging.verbose = process.env.CSS_BUILDER_VERBOSE === 'true';
	config.logging.silent = process.env.CSS_BUILDER_SILENT === 'true';

	// コマンドライン引数からオプションを読み取る
	const args = process.argv.slice(2);
	if (args.includes('--force') || args.includes('-f')) {
		config.fileOperations.force = true;
	}
	if (args.includes('--verbose') || args.includes('-v')) {
		config.logging.verbose = true;
	}
	if (args.includes('--silent') || args.includes('-s')) {
		config.logging.silent = true;
	}

	// 出力先の上書き（環境変数から） - 注意: このロジックは全ての出力先を同じパスにする
	if (process.env.CSS_BUILDER_OUTPUT_PATH) {
	    logger.warn(`環境変数 CSS_BUILDER_OUTPUT_PATH により、全ての出力先が ${process.env.CSS_BUILDER_OUTPUT_PATH} に設定されます。`);
		Object.keys(config.paths.output).forEach((key) => {
			// config.paths.output[key] = process.env.CSS_BUILDER_OUTPUT_PATH; // パス解決が必要な場合があるため、単純代入は危険かも
            // より安全な方法を検討するか、この機能を削除/変更する
            logger.error('環境変数による出力先の一括上書きは現在サポートされていません。config.jsを編集してください。');
		});
	}
}

/**
 * メイン実行関数
 */
export async function main() { // async に変更
	try {
		// オプション設定
		configureOptions();

		logger.info('CSS解析とドキュメント生成を開始します...');

		// コマンドライン引数の解析
		const args = process.argv.slice(2);

		// コマンドオプションを除外したコマンド引数のみを取得（--force, --verbose, --silentを除く）
		const commandArgs = args.filter(arg =>
			!['--force', '-f', '--verbose', '-v', '--silent', '-s'].includes(arg)
		);

		// 特定のコマンドが指定されているかチェック
		const hasSpecificCommand = commandArgs.length > 0;

		const options = {
			// コマンドなしの場合はデフォルトでCSS抽出、ドキュメント、型定義を生成
			// 特定のコマンドが指定されている場合はそれに従う
			generateDocs: args.includes('--docs') || args.includes('-d') ||
				(args.includes('--astro')) || (!hasSpecificCommand), // --astro は --docs と同じ扱い？
			generateComponents: args.includes('--components') || args.includes('-c'), // 非推奨機能
			generateTypes: args.includes('--types') || args.includes('-t') || (!hasSpecificCommand),
			generateAll: args.includes('--all') || args.includes('-a'),
		};

		// --allオプションが指定された場合は全て生成 (非推奨の components も含む)
		if (options.generateAll) {
			options.generateDocs = true;
			options.generateComponents = true; // 非推奨だが --all では実行
			options.generateTypes = true;
		}

		// オプション情報をログに出力
		logger.verbose(`生成オプション: ドキュメント=${options.generateDocs}, コンポーネント=${options.generateComponents}, 型定義=${options.generateTypes}, 全て=${options.generateAll}`);
        if (options.generateComponents) {
            logger.warn('Astroコンポーネント生成 (--components, -c, --all, -a) は非推奨です。ドキュメントページ生成 (--docs, -d) を推奨します。');
        }

		// CSSファイルからクラス情報を抽出
		logger.info('CSSファイルの解析を開始します...');
		const allClasses = cssParser.parseAllCssFiles(); // 引数不要 (configから取得するため)

		if (!allClasses || allClasses.length === 0) {
			logger.error(
				'CSSからクラス情報を抽出できませんでした。処理を中止します。'
			);
			return false; // エラーを示すために false を返す
		}

		// クラス情報から構造化データを生成
		logger.info('構造化データを生成します...');
		const componentData = cssParser.structureComponentData(allClasses);

		// autoMappings.jsファイルを生成
		const autoMappingsPath = path.join( // path.join を使用
			config.paths.output.cssBuilder,
			config.paths.files.autoMappings
		);
		// 出力内容をESM形式に
		const autoOutput = `// 自動生成されたコード - ${new Date().toISOString()}
export const componentTypes = ${JSON.stringify(componentData.componentTypes, null, 2)};

export const baseClasses = ${JSON.stringify(componentData.baseClasses, null, 2)};

export const componentVariants = ${JSON.stringify(componentData.componentVariants, null, 2)};

export const classDescriptions = ${JSON.stringify(componentData.classDescriptions, null, 2)};

// componentExamples もエクスポートすると便利かもしれない
export const componentExamples = ${JSON.stringify(componentData.componentExamples, null, 2)};

// 追加: クラス名ごとのルール詳細
export const classRuleDetails = ${JSON.stringify(componentData.classRuleDetails, null, 2)};
`;

		fileUtils.writeFileSafely(autoMappingsPath, autoOutput); // writeFileSafely はバックアップも考慮

		// classMappingsConfig.jsファイルを生成（最初の実行時のみ）
		const configMappingsPath = path.join( // path.join を使用
			config.paths.output.cssBuilder,
			config.paths.files.configMappings
		);
		if (!fs.existsSync(configMappingsPath)) { // readFileSafelyではなくexistsSyncでチェック
			// 出力内容をESM形式に
			const configOutput = `// 手動管理する設定 - 編集可能
export const sizes = {
  // 全般的なサイズ
  'common': [
    { value: 'xs', label: 'XS' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'XL' }
  ],

  // コンポーネント固有のサイズ（必要に応じて追加）
  'button': [
    { value: 'btn-xs', label: 'XS' },
    { value: 'btn-sm', label: 'Small' },
    { value: 'btn-md', label: 'Medium' }, // デフォルトはmdかもしれない
    { value: 'btn-lg', label: 'Large' },
    { value: 'btn-xl', label: 'XL' }
  ],
  // heading など他のコンポーネントも追加可能
};

// 共通の角丸オプション (コンポーネント固有は componentBorderRadius で)
export const borderRadiusOptions = [
  { value: 'none', label: 'なし' },
  { value: 'sm', label: '小 (sm)' },
  { value: 'md', label: '中 (md)' }, // Tailwindのデフォルトに合わせる
  { value: 'lg', label: '大 (lg)' },
  { value: 'xl', label: '特大 (xl)' }, // 必要なら追加
  { value: 'full', label: '完全な丸み (full)' }
];

export const modifiers = {
  // 全般的なモディファイア
  'common': [
    { value: 'shadow', label: '影', description: '要素に影を付けます (Tailwind shadow-md相当)' },
    { value: 'shadow-lg', label: '影(大)', description: '要素に大きな影を付けます (Tailwind shadow-lg相当)' },
    // { value: 'hover-lift', label: 'ホバー時浮上', description: 'ホバー時に要素が少し上に浮き上がります' } // 実装依存
  ],

  // コンポーネント固有のモディファイア（必要に応じて追加）
  'button': [
    { value: 'btn-disabled', label: '無効', description: 'ボタンを無効化状態にします' },
    { value: 'btn-active', label: 'アクティブ', description: 'ボタンをアクティブ状態にします' },
    // { value: 'btn-icon-left', label: '左アイコン', description: 'アイコンを左側に配置' }, // 実装依存
    // { value: 'btn-icon-right', label: '右アイコン', description: 'アイコンを右側に配置' }, // 実装依存
  ],
  'card': [
      { value: 'card-bordered', label: '枠線付き', description: 'カードに枠線を追加します' },
      { value: 'card-hover', label: 'ホバー効果', description: 'ホバー時に影や浮き上がり効果を追加します' },
  ]
};

// 特殊効果クラス (主にアニメーションなど)
export const specialClasses = [
  { value: 'animate-pulse', label: 'パルス', description: '要素がゆっくりと点滅します' },
  { value: 'animate-bounce', label: 'バウンス', description: '要素が上下にバウンスします' },
  { value: 'animate-spin', label: '回転', description: '要素が回転します' },
  { value: 'animate-ping', label: 'ピング', description: '要素が波紋のように広がります' },
];

// 各コンポーネントの枠線半径の設定 (borderRadiusOptions の値を参照)
// キーはコンポーネントタイプ、値は borderRadiusOptions の value の配列
export const componentBorderRadius = {
  'button': ['none', 'sm', 'md', 'lg', 'full'], // ボタンで利用可能な角丸
  'card': ['none', 'sm', 'md', 'lg', 'xl'],    // カードで利用可能な角丸
  'infobox': ['none', 'sm', 'md', 'lg'], // Infoboxで利用可能な角丸
  // 他のコンポーネントも必要に応じて追加
};
`;

			// writeFileSafely の第3引数は boolean ではなく options オブジェクト
			fileUtils.safeWriteFile(configMappingsPath, configOutput, { force: false, backup: false }); // 初回生成なので force: false, backup: false
			logger.info(`設定ファイル ${configMappingsPath} を作成しました。必要に応じて編集してください。`);
		} else {
			logger.info(
				`設定ファイル ${configMappingsPath} はすでに存在するため、スキップしました。`
			);
		}

		// インポート設定の解析とindexファイルの生成
		const generateDynamicImportExport = () => {
			// 設定ファイルから変数名を抽出 (ファイル読み込みと正規表現)
			const configContent = fileUtils.readFileSafely(configMappingsPath);
			const exportMatches = configContent.match(/export\s+const\s+(\w+)/g) || [];
			const exportNames = exportMatches
				.map((match) => match.match(/export\s+const\s+(\w+)/)?.[1]) // Optional chaining
				.filter(Boolean);

			logger.verbose(
				`設定ファイルから検出されたエクスポート変数: ${exportNames.join(', ')}`
			);

			// インポート文の生成 (拡張子 .js を追加)
			const configBaseName = config.paths.files.configMappings; // .js 拡張子付き
			const autoBaseName = config.paths.files.autoMappings;     // .js 拡張子付き

			const importFromConfig = exportNames.length > 0
				? `import { ${exportNames.join(', ')} } from './${configBaseName}';`
				: `// 設定ファイル (${configBaseName}) からのエクスポートはありませんでした。`;

			const importFromAuto = `import { componentTypes, baseClasses, componentVariants, classDescriptions, componentExamples, classRuleDetails } from './${autoBaseName}';`; // classRuleDetails もインポート

			// エクスポート文の生成
			const allExports = [
				'componentTypes',
				'baseClasses',
				'componentVariants',
				'classDescriptions',
                'componentExamples',
                'classRuleDetails', // classRuleDetails もエクスポート
   ...exportNames,
			];

			const exportStatement = `export {\n  ${allExports.join(',\n  ')}\n};`;

			// 完全な内容を生成
			return `// クラスマッピングのインデックスファイル - 自動生成 ${new Date().toISOString()}
// このファイルは直接編集しないでください。スクリプト実行時に上書きされます。
${importFromAuto}
${importFromConfig}

${exportStatement}
`;
		};

		// indexファイルの生成
		const indexMappingsPath = path.join( // path.join を使用
			config.paths.output.cssBuilder,
			config.paths.files.indexMappings
		);
		const indexOutput = generateDynamicImportExport();
		// インデックスファイルは常に上書き (force: true), バックアップは設定に従う
		fileUtils.safeWriteFile(indexMappingsPath, indexOutput, { force: true });

		// 設定データの読み込み (動的インポートを使用)
		let configData;
		try {
		    // configs/index.js を動的にインポート
            // 注意: 動的インポートのパスは実行時のカレントディレクトリに依存しないようにする
            // ここでは index.js から見た相対パスを使用
            const configModule = await import('../configs/index.js'); // 相対パスを修正
			configData = configModule.default || configModule; // default export または 名前付き export を想定
			logger.verbose('設定データ (configs/index.js) を読み込みました。');
		} catch (error) {
			logger.error(
				'設定データ (configs/index.js) の読み込みに失敗しました。デフォルト設定を使用します。',
				error
			);
			// フォールバック用の最小限の設定
			configData = {
				sizes: { common: [] },
				borderRadiusOptions: [],
				modifiers: { common: [] },
				specialClasses: [],
                componentBorderRadius: {},
			};
		}

		// 型定義ファイルの生成（オプション）
		if (options.generateTypes) {
			logger.info('型定義ファイル生成を開始します...');
			const typeSuccess = typeGenerator.generateTypeDefinitions(
				componentData,
				configData, // 読み込んだ設定データを渡す
				config.paths.output.types
			);

			if (typeSuccess) {
				logger.info('型定義ファイル生成が完了しました。');
			} else {
				logger.warn('型定義ファイル生成に一部失敗または問題がありました。');
			}
		}

		// Astroドキュメントページの生成（オプション）
		if (options.generateDocs) {
			logger.info('Astroドキュメントページの生成を開始します...');
			const docsSuccess = docGenerator.generateAstroDocPages(
				componentData,
				configData, // 設定データを渡す (現在は未使用だが将来のため)
				config.paths.output.docs
			);

			if (docsSuccess) {
				logger.info('Astroドキュメントページの生成が完了しました。');
			} else {
				logger.warn('Astroドキュメントページの生成に一部失敗または問題がありました。');
			}
		}

		// Astroコンポーネントの生成（オプション、非推奨）
		/* if (options.generateComponents) {
			// logger.info('Astroコンポーネントの生成を開始します...'); // 既に警告済み
			const componentsSuccess = docGenerator.generateAstroComponents(
				componentData,
				configData,
				config.paths.output.components
			);

			if (componentsSuccess) {
				logger.info('Astroコンポーネントの生成が完了しました。');
			} else {
				logger.warn('Astroコンポーネントの生成に一部失敗または問題がありました。');
			}
		}
 */
		logger.info('すべての処理が完了しました。');
		return true; // 成功を示すために true を返す
	} catch (error) {
		logger.error('処理中に予期せぬエラーが発生しました。エラー詳細:', error); // エラーオブジェクト全体を出力
		return false; // エラーを示すために false を返す
	}
}

// スクリプトが直接実行されたかどうかを判定 (ESM版)
// process.argv[1] は実行されたスクリプトのフルパス
// import.meta.url は 'file:///...' 形式のURL
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	main().then((success) => {
		// エラーカウントに基づいて終了コードを設定することも検討
		const errorCount = logger.getErrorCount();
		const warningCount = logger.getWarningCount();
		if (errorCount > 0) {
		    logger.error(`処理中に ${errorCount} 件のエラーが発生しました。`);
		    process.exit(1);
		} else if (warningCount > 0) {
		    logger.warn(`処理中に ${warningCount} 件の警告が発生しました。`);
		    process.exit(0); // 警告は成功とする場合
		} else {
		    process.exit(0); // 成功
        }
	}).catch(err => {
	    // main 関数内で catch されなかった予期せぬエラー
	    logger.error('スクリプト実行中に致命的なエラーが発生しました。', err);
	    process.exit(1);
	});
}