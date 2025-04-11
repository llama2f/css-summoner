// css-summoner-integration.js - PostCSSプラグインとcss-summonerの連携

import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import { globSync } from 'glob'
import { fileURLToPath } from 'url'

// PostCSSプラグインをインポート
// 注意: CommonJSモジュールをESMで使用
import cssAnnotationsPlugin from './postcss-annotations/src/index.js'

// css-summonerの既存の型生成関数や設定をインポート
import config from './css-summoner/scripts/config.js'

// 型生成機能
import typeGenerator from './css-summoner/scripts/generators/type-generator.js'

// Astroドキュメント生成
import docGenerator from './css-summoner/scripts/generate-docs.js'

// コンポーネント生成機能は generate-astro.js に移行

// プラグインオプション
const pluginOptions = {
	recognizedTags: config.cssParser.recognizedTags,
	requiredTags: config.cssParser.requiredTags,
	verbose: config.logging.verbose,
}

/**
 * CSSファイルからアノテーションを抽出する
 * @param {Array} cssFiles CSSファイルパスの配列
 * @param {Object} options オプション
 * @returns {Promise<Object>} 抽出したデータと統計情報
 */
async function extractAnnotations(cssFiles, options = {}) {
	const allExtractedData = {
		componentTypes: {},
		baseClasses: {},
		componentVariants: {},
		classDescriptions: {},
		componentExamples: {},
		classRuleDetails: {},
		meta: {
			totalFiles: cssFiles.length,
			totalClasses: 0,
			errors: [],
			sources: [],
		},
	}

	console.log(`CSSファイルからアノテーションを抽出中...`)

	for (const cssFile of cssFiles) {
		try {
			const css = fs.readFileSync(cssFile, 'utf8')
			const relativePath = path.relative(config.paths.stylesDir, cssFile)

			// PostCSSプラグインでアノテーションを抽出
			const result = await postcss([
				cssAnnotationsPlugin(pluginOptions),
			]).process(css, { from: relativePath })

			// 抽出データを取得
			const dataMessage = result.messages.find(
				(msg) => msg.type === 'css-annotations-data'
			)
			if (!dataMessage) {
				console.warn(
					`警告: ${relativePath} からアノテーションデータが抽出できませんでした`
				)
				continue
			}

			const data = dataMessage.data

			// データをマージ
			mergeExtractedData(allExtractedData, data)

			// メタ情報を更新
			allExtractedData.meta.totalClasses += data.meta.totalClasses
			allExtractedData.meta.errors.push(...data.meta.errors)
			allExtractedData.meta.sources.push(data.meta.source)

			// ログ出力
			if (data.meta.totalClasses > 0) {
				console.log(
					`${relativePath} から ${data.meta.totalClasses} 個のクラスを抽出しました`
				)
			}
		} catch (error) {
			console.error(`エラー: ${cssFile} の処理中にエラーが発生しました:`, error)
			allExtractedData.meta.errors.push(`${cssFile}: ${error.message}`)
		}
	}

	// componentTypesをフォーマット変換（配列→オブジェクト形式へ）
	// css-summonerの既存コードとの互換性のため
	convertComponentTypesFormat(allExtractedData)

	// JSONファイルに保存（デバッグ用）
	if (options.outputPath) {
		const outputDir = path.dirname(options.outputPath)
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true })
		}

		fs.writeFileSync(
			options.outputPath,
			JSON.stringify(allExtractedData, null, 2)
		)

		console.log(`抽出データを ${options.outputPath} に保存しました`)
	}

	return allExtractedData
}

/**
 * 2つの抽出データをマージする
 * @param {Object} target マージ先のデータ
 * @param {Object} source マージ元のデータ
 */
function mergeExtractedData(target, source) {
	// componentTypes のマージ
	for (const [component, classes] of Object.entries(source.componentTypes)) {
		if (!target.componentTypes[component]) {
			target.componentTypes[component] = []
		}

		for (const className of classes) {
			if (!target.componentTypes[component].includes(className)) {
				target.componentTypes[component].push(className)
			}
		}
	}

	// baseClasses のマージ
	Object.assign(target.baseClasses, source.baseClasses)

	// componentVariants のマージ
	for (const [component, variants] of Object.entries(
		source.componentVariants
	)) {
		if (!target.componentVariants[component]) {
			target.componentVariants[component] = {}
		}
		Object.assign(target.componentVariants[component], variants)
	}

	// classDescriptions のマージ
	Object.assign(target.classDescriptions, source.classDescriptions)

	// componentExamples のマージ（存在する場合）
	if (source.componentExamples) {
		for (const [component, examples] of Object.entries(
			source.componentExamples
		)) {
			if (!target.componentExamples[component]) {
				target.componentExamples[component] = []
			}
			target.componentExamples[component].push(...examples)
		}
	}

	// classRuleDetails のマージ（存在する場合）
	if (source.classRuleDetails) {
		Object.assign(target.classRuleDetails, source.classRuleDetails)
	}
}

/**
 * componentTypesをフォーマット変換（配列→オブジェクト形式へ）
 * css-summonerの既存コードとの互換性のため
 * @param {Object} data 抽出データ
 */
function convertComponentTypesFormat(data) {
	const formattedComponentTypes = []

	for (const [component, classes] of Object.entries(data.componentTypes)) {
		// カテゴリの決定（最初のクラスのカテゴリを使用）
		let category = 'other'
		for (const className of classes) {
			if (
				data.classDescriptions[className] &&
				data.classDescriptions[className].category
			) {
				category = data.classDescriptions[className].category
				break
			}
		}

		formattedComponentTypes.push({
			value: component,
			label: component
				.replace(/-/g, ' ')
				.replace(/\b[a-z]/g, (c) => c.toUpperCase()),
			category: category,
		})
	}

	// カテゴリと名前でソート
	formattedComponentTypes.sort((a, b) => {
		if (a.category < b.category) return -1
		if (a.category > b.category) return 1
		if (a.label < b.label) return -1
		if (a.label > b.label) return 1
		return 0
	})

	// 変換したデータで置き換え
	data.originalComponentTypes = data.componentTypes // 元のデータを保持
	data.componentTypes = formattedComponentTypes

	// componentVariantsもフォーマット変換
	for (const component in data.componentVariants) {
		const variants = data.componentVariants[component]
		const formattedVariants = []

		for (const [variant, className] of Object.entries(variants)) {
			if (variant !== 'base') {
				// baseはbaseClassesに含まれるのでスキップ
				formattedVariants.push({
					value: className,
					label: variant
						.replace(/-/g, ' ')
						.replace(/\b[a-z]/g, (c) => c.toUpperCase()),
				})
			}
		}

		// ラベルでソート
		formattedVariants.sort((a, b) => a.label.localeCompare(b.label))

		// 変換したデータで置き換え
		data.componentVariants[component] = formattedVariants
	}

	// componentsByTypeを追加（既存の型生成・ドキュメント生成との互換性のため）
	data.componentsByType = {}

	// originalComponentTypesを利用してcomponentsByTypeを構築
	for (const [component, classes] of Object.entries(
		data.originalComponentTypes
	)) {
		data.componentsByType[component] = classes.map((className) => {
			// クラス情報をcomponentsByType用に構築
			const descriptionData = data.classDescriptions[className] // classDescriptionsから情報を取得
			const variant = descriptionData?.variant || 'base' // classDescriptionsからvariantを取得、なければbase

			return {
				component,
				variant, // 正しいvariantを設定
				className,
				description: descriptionData?.description || '',
				category: descriptionData?.category || 'other',
				sourceFile: data.classRuleDetails?.[className]?.sourceFile || 'unknown',
			}
		})
	}
}

/**
 * 抽出データをAutoClassMappingsとして書き出す
 * @param {Object} data 抽出データ
 * @param {string} outputPath 出力先パス
 */
function writeAutoClassMappings(data, outputPath) {
	try {
		const content = `// このファイルは自動生成されています。手動で編集しないでください。
// css-summonerによって生成 - ${new Date().toISOString()}

// コンポーネントタイプ一覧
export const componentTypes = ${JSON.stringify(data.componentTypes, null, 2)};

// ベースクラス（コンポーネントタイプごとの基本クラス）
export const baseClasses = ${JSON.stringify(data.baseClasses, null, 2)};

// コンポーネントバリアント
export const componentVariants = ${JSON.stringify(data.componentVariants, null, 2)};

// クラスの説明
export const classDescriptions = ${JSON.stringify(data.classDescriptions, null, 2)};
`

		fs.writeFileSync(outputPath, content)
		console.log(`AutoClassMappingsを${outputPath}に保存しました`)
	} catch (error) {
		console.error(`AutoClassMappingsの保存中にエラーが発生しました:`, error)
	}
}

/**
 * メイン処理: CSSファイルからデータを抽出し、指定した形式で出力する
 * @param {Object} options オプション
 */
export async function processCssFiles(options = {}) {
	// オプションのデフォルト値
	const opts = {
		cssPattern: config.paths.getStylesPattern(),
		outputPath: path.join(
			config.paths.output.cssBuilder,
			'extracted-annotations.json'
		), // extracted-annotations.json のパス
		// autoMappingsPath: path.join(config.paths.output.cssBuilder, config.paths.files.autoMappings), // autoMappings.js は不要になったため削除
		generateTypes: false,
		generateDocs: false,
		generateComponents: false,
		force: config.fileOperations.force, // デフォルト値をconfigから取得（修正：falseからconfig.fileOperations.forceに変更）
		...options,
	}

	console.log('CSSファイルからアノテーションを抽出します...')

	// CSSファイルを検索
	const cssFiles = globSync(opts.cssPattern).filter(
		(file) => !file.endsWith('/index.css')
	)

	if (cssFiles.length === 0) {
		console.error('エラー: マッチするCSSファイルが見つかりませんでした')
		return null
	}

	console.log(`${cssFiles.length}個のCSSファイルを処理します...`)

	// アノテーションを抽出
	const extractedData = await extractAnnotations(cssFiles, {
		outputPath: opts.outputPath,
	})

	console.log(
		`合計 ${extractedData.meta.totalClasses} 個のクラスを抽出しました`
	)

	// エラーがあれば表示
	if (extractedData.meta.errors.length > 0) {
		console.warn(`${extractedData.meta.errors.length} 件のエラーがありました:`)
		extractedData.meta.errors.forEach((error) => {
			console.warn(`- ${error}`)
		})
	}

	// AutoClassMappingsを生成
	// writeAutoClassMappings(extractedData, opts.autoMappingsPath); // autoMappings.js は不要になったため削除 (行をコメントアウト)

	// 型定義の生成
	if (opts.generateTypes) {
		console.log('TypeScript型定義を生成します...')
		await typeGenerator.generateTypeDefinitions(extractedData, {
			...config,
			fileOperations: {
				...config.fileOperations,
				force: opts.force, // force 設定はoptsのものを優先
			},
		})
	}

	// ドキュメントの生成
	if (opts.generateDocs) {
		console.log('ドキュメントページを生成します...')
		await docGenerator.generateAstroDocPages(
			extractedData,
			{
				...config,
				fileOperations: {
					...config.fileOperations,
					force: opts.force, // force 設定はoptsのものを優先
				},
			},
			config.paths.output.docs
		)
	}

	// コンポーネント生成は generate-astro.js スクリプトに移行されました

	return extractedData
}

// コマンドラインから実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
	// コマンドライン引数の解析
	const args = process.argv.slice(2)
	const options = {
		generateTypes: args.includes('--types') || args.includes('-t'),
		generateDocs: args.includes('--docs') || args.includes('-d'),
		// generateComponents: args.includes('--components') || args.includes('-c'), // 移行済み
		all: args.includes('--all') || args.includes('-a'),
		force: args.includes('--force') || args.includes('-f'),
	}

	// --all オプションが指定された場合は全て生成
	if (options.all) {
		options.generateTypes = true
		options.generateDocs = true
		// options.generateComponents = true; // 移行済み
		options.force = options.force || config.fileOperations.force // --all でも明示的に指定されていなければconfigの値を使用
	}

	// 処理実行
	processCssFiles(options).catch((error) => {
		console.error('エラーが発生しました:', error)
		process.exit(1)
	})
}
