// index.cjs - メインスクリプト
const config = require('./config.cjs')
const { logger, fileUtils } = require('./utils.cjs')
const cssParser = require('./css-parser.cjs')
const typeGenerator = require('./type-generator.cjs')
const astroGenerator = require('./astro-generator.cjs')

/**
 * コマンドラインオプションを環境変数に基づいて設定
 */
function configureOptions() {
	// 環境変数からオプションを読み取る
	config.fileOperations.force = process.env.CSS_BUILDER_FORCE === 'true'
	config.logging.verbose = process.env.CSS_BUILDER_VERBOSE === 'true'
	config.logging.silent = process.env.CSS_BUILDER_SILENT === 'true'

	// コマンドライン引数からオプションを読み取る
	const args = process.argv.slice(2)
	if (args.includes('--force') || args.includes('-f')) {
		config.fileOperations.force = true
	}
	if (args.includes('--verbose') || args.includes('-v')) {
		config.logging.verbose = true
	}
	if (args.includes('--silent') || args.includes('-s')) {
		config.logging.silent = true
	}

	// 出力先の上書き（環境変数から）
	if (process.env.CSS_BUILDER_OUTPUT_PATH) {
		Object.keys(config.paths.output).forEach((key) => {
			config.paths.output[key] = process.env.CSS_BUILDER_OUTPUT_PATH
		})
	}
}

/**
 * メイン実行関数
 */
async function main() {
	try {
		// オプション設定
		configureOptions()

		logger.info('CSS解析とドキュメント生成を開始します...')

		// コマンドライン引数の解析
		const args = process.argv.slice(2)
		
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
				(args.includes('--astro')) || (!hasSpecificCommand),
			generateComponents: args.includes('--components') || args.includes('-c'),
			generateTypes: args.includes('--types') || args.includes('-t') || (!hasSpecificCommand),
			generateAll: args.includes('--all') || args.includes('-a'),
		}

		// --allオプションが指定された場合は全て生成
		if (options.generateAll) {
			options.generateDocs = true
			options.generateComponents = true
			options.generateTypes = true
		}

		// オプション情報をログに出力
		logger.verbose(`生成オプション: ドキュメント=${options.generateDocs}, コンポーネント=${options.generateComponents}, 型定義=${options.generateTypes}, 全て=${options.generateAll}`)

		// CSSファイルからクラス情報を抽出
		logger.info('CSSファイルの解析を開始します...')
		const allClasses = cssParser.parseAllCssFiles(config.paths.styles)

		if (allClasses.length === 0) {
			logger.error(
				'CSSからクラス情報を抽出できませんでした。処理を中止します。'
			)
			return false
		}

		// クラス情報から構造化データを生成
		logger.info('構造化データを生成します...')
		const componentData = cssParser.structureComponentData(allClasses)

		// autoMappings.jsファイルを生成
		const autoMappingsPath =
			config.paths.output.cssBuilder + config.paths.files.autoMappings
		const autoOutput = `// 自動生成されたコード - ${new Date().toISOString()}
export const componentTypes = ${JSON.stringify(componentData.componentTypes, null, 2)};

export const baseClasses = ${JSON.stringify(componentData.baseClasses, null, 2)};

export const componentVariants = ${JSON.stringify(componentData.componentVariants, null, 2)};

export const classDescriptions = ${JSON.stringify(componentData.classDescriptions, null, 2)};
`

		fileUtils.writeFileSafely(autoMappingsPath, autoOutput)

		// classMappingsConfig.jsファイルを生成（最初の実行時のみ）
		const configMappingsPath =
			config.paths.output.cssBuilder + config.paths.files.configMappings
		if (!fileUtils.readFileSafely(configMappingsPath)) {
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
    { value: 'btn-md', label: 'Medium' },
    { value: 'btn-lg', label: 'Large' },
    { value: 'btn-xl', label: 'XL' }
  ]
};

export const borderRadiusOptions = [
  { value: 'none', label: 'なし' },
  { value: 'sm', label: '小' },
  { value: 'md', label: '中' },
  { value: 'lg', label: '大' },
  { value: 'full', label: '完全な丸み' }
];

export const modifiers = {
  // 全般的なモディファイア
  'common': [
    { value: 'shadow', label: '影付き', description: '要素に影を付けます' },
    { value: 'hover-lift', label: 'ホバー時浮上', description: 'ホバー時に要素が少し上に浮き上がります' }
  ],
  
  // コンポーネント固有のモディファイア（必要に応じて追加）
  'button': [
    { value: 'btn-shadow', label: '影付き', description: 'ボタンに影を付けます' },
    { value: 'btn-icon-left', label: '左アイコン', description: 'アイコンを左側に配置' },
    { value: 'btn-icon-right', label: '右アイコン', description: 'アイコンを右側に配置' },
    { value: 'btn-icon-only', label: 'アイコンのみ', description: 'アイコンのみのボタン' },
    { value: 'btn-rounded-full', label: '完全な丸み', description: '完全な丸みを持たせたボタン' },
    { value: 'btn-animate-up', label: 'アニメーション（上）', description: 'ホバー時に上に動くアニメーション' },
    { value: 'btn-animate-down', label: 'アニメーション（下）', description: 'ホバー時に下に動くアニメーション' }
  ]
};

export const specialClasses = [
  { value: 'animate-pulse', label: '点滅', description: '要素がゆっくりと点滅します' },
  { value: 'animate-bounce', label: 'バウンス', description: '要素が上下にバウンスします' },
  { value: 'animate-spin', label: '回転', description: '要素が回転します' }
];

// 各コンポーネントの枠線半径の設定
export const componentBorderRadius = {
  'button': [
    { value: 'none', label: 'なし' },
    { value: 'btn-rounded-sm', label: '小' },
    { value: 'btn-rounded-md', label: '中' },
    { value: 'btn-rounded-lg', label: '大' },
    { value: 'btn-rounded-full', label: '完全な丸み' }
  ]
};
`

			fileUtils.writeFileSafely(configMappingsPath, configOutput, false)
			logger.info(`設定ファイルを ${configMappingsPath} に作成しました。`)
		} else {
			logger.info(
				`設定ファイル ${configMappingsPath} はすでに存在するため、上書きしません。`
			)
		}

		// インポート設定の解析とindexファイルの生成
		const generateDynamicImportExport = () => {
			// 設定ファイルから変数名を抽出
			const configContent = fileUtils.readFileSafely(configMappingsPath)
			const exportMatches = configContent.match(/export\s+const\s+(\w+)/g) || []
			const exportNames = exportMatches
				.map((match) => {
					const result = match.match(/export\s+const\s+(\w+)/)
					return result ? result[1] : null
				})
				.filter(Boolean)

			logger.verbose(
				`設定ファイルから検出されたエクスポート変数: ${exportNames.join(', ')}`
			)

			// インポート文の生成
			const configBaseName = config.paths.files.configMappings
			const autoBaseName = config.paths.files.autoMappings

			const importFromConfig =
				exportNames.length > 0
					? `import { ${exportNames.join(', ')} } from './${configBaseName.replace('.js', '')}';`
					: `import {} from './${configBaseName.replace('.js', '')}';`

			const importFromAuto = `import { componentTypes, baseClasses, componentVariants, classDescriptions } from './${autoBaseName.replace('.js', '')}';`

			// エクスポート文の生成
			const allExports = [
				'componentTypes',
				'baseClasses',
				'componentVariants',
				'classDescriptions',
				...exportNames,
			]

			const exportStatement = `export {\n  ${allExports.join(',\n  ')}\n};`

			// 完全な内容を生成
			return `// クラスマッピングのインデックスファイル - 自動生成 ${new Date().toISOString()}
${importFromAuto}
${importFromConfig}

${exportStatement}`
		}

		// indexファイルの生成
		const indexMappingsPath =
			config.paths.output.cssBuilder + config.paths.files.indexMappings
		const indexOutput = generateDynamicImportExport()
		fileUtils.writeFileSafely(indexMappingsPath, indexOutput)

		// 設定ファイルの読み込み
		let configData
		try {
			const cssBuilderPath = config.paths.output.cssBuilder.replace(
				/[\\/]$/,
				''
			)
			const configsPath = `${cssBuilderPath}/configs`
			const configs = require(`${configsPath}`)
			configData = configs
			logger.verbose('設定データを読み込みました。')
		} catch (error) {
			logger.error(
				'設定データの読み込みに失敗しました。デフォルト設定を使用します。',
				error
			)
			configData = {
				sizes: { common: [] },
				borderRadiusOptions: [],
				modifiers: { common: [] },
				specialClasses: [],
			}
		}

		// 型定義ファイルの生成（オプション）
		if (options.generateTypes) {
			logger.info('型定義ファイル生成を開始します...')
			const typeSuccess = typeGenerator.generateTypeDefinitions(
				componentData,
				configData,
				config.paths.output.types
			)

			if (typeSuccess) {
				logger.info('型定義ファイル生成が完了しました。')
			} else {
				logger.warn('型定義ファイル生成に一部失敗しました。')
			}
		}

		// Astroドキュメントページの生成（オプション）
		if (options.generateDocs) {
			logger.info('Astroドキュメントページの生成を開始します...')
			const docsSuccess = astroGenerator.generateAstroDocPages(
				componentData,
				configData,
				config.paths.output.docs
			)

			if (docsSuccess) {
				logger.info('Astroドキュメントページの生成が完了しました。')
			} else {
				logger.warn('Astroドキュメントページの生成に一部失敗しました。')
			}
		}

		// Astroコンポーネントの生成（オプション）
		if (options.generateComponents) {
			logger.info('Astroコンポーネントの生成を開始します...')
			const componentsSuccess = astroGenerator.generateAstroComponents(
				componentData,
				configData,
				config.paths.output.components
			)

			if (componentsSuccess) {
				logger.info('Astroコンポーネントの生成が完了しました。')
			} else {
				logger.warn('Astroコンポーネントの生成に一部失敗しました。')
			}
		}

		logger.info('すべての処理が完了しました。')
		return true
	} catch (error) {
		logger.error('処理中に予期せぬエラーが発生しました。', error)
		return false
	}
}

// スクリプトが直接実行された場合に実行
if (require.main === module) {
	main().then((success) => {
		process.exit(success ? 0 : 1)
	})
}

module.exports = {
	main,
}
