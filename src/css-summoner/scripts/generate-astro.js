import { generateDefaultAstroComponent } from './generators/astroComponentGenerator.js'
import componentInterface from './generators/componentInterface.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import config from './config.js'
import { dynamicImport } from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

function parseArgs() {
	const args = process.argv.slice(2)
	const options = {
		handlersPath: null,
		outputDir: null,
		force: false,
		verbose: false,
		autoConfirm: undefined,
	}

	for (let i = 0; i < args.length; i++) {
		const arg = args[i]

		if (arg === '--handlers' || arg === '-h') {
			options.handlersPath = args[++i]
		} else if (arg === '--output' || arg === '-o') {
			options.outputDir = args[++i]
		} else if (arg === '--force' || arg === '-f') {
			options.force = true
			options.autoConfirm = true
		} else if (arg === '--verbose' || arg === '-v') {
			options.verbose = true
		}
	}

	return options
}

/**
 * 文字列をパスカルケースに変換
 * @param {string} str 変換する文字列
 * @returns {string} パスカルケースに変換された文字列
 */
function toPascalCase(str) {
	if (!str) return ''
	return str
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('')
}

/**
 * ファイル上書きの確認
 * @param {string} filePath 確認するファイルパス
 * @param {object} options コマンドラインオプション
 * @returns {Promise<boolean>} 上書きする場合はtrue
 */
async function confirmOverwrite(filePath, options) {
	if (options.force) {
		return true
	}
	if (options.autoConfirm === true) return true
	if (options.autoConfirm === false) return false

	// TODO: 必要であればreadlineを使った対話的確認を実装
	console.log(
		`⚠️ 注意: 既存のファイルを上書きします: ${path.basename(filePath)}`
	)
	return true
}

async function main() {
	try {
		const options = parseArgs()

		// デフォルトパス設定
		const handlersPath =
			options.handlersPath ||
			config.paths.handlersDir ||
			path.resolve(projectRoot, 'ui/templates/handlers/auto')

		const outputDir =
			options.outputDir ||
			config.paths.output.components ||
			path.resolve(projectRoot, 'dist/components')

		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true })
			console.log(`📂 出力ディレクトリを作成しました: ${outputDir}`)
		}

		if (!fs.existsSync(handlersPath)) {
			console.error(
				`❌ エラー: ハンドラーディレクトリが見つかりません: ${handlersPath}`
			)
			console.log('--handlers オプションで正しいパスを指定してください')
			process.exit(1)
		}

		const files = fs.readdirSync(handlersPath)
		const handlerFiles = files.filter(
			(file) =>
				(file.endsWith('.js') ||
					file.endsWith('.jsx') ||
					file.endsWith('.mjs')) &&
				!file.startsWith('_')
		)

		if (handlerFiles.length === 0) {
			console.warn(
				`⚠️ 警告: ハンドラーファイルが見つかりません: ${handlersPath}`
			)
			console.log('有効なハンドラーファイル (.js, .jsx, .mjs) が必要です')
			return
		} else {
			console.log(
				`🔍 ${handlerFiles.length}個のハンドラーファイルを検出しました:`
			)
			if (options.verbose) {
				handlerFiles.forEach((file) => console.log(`  - ${file}`))
			}
		}

		let generatedCount = 0
		let errorCount = 0

		console.log('\n🚀 Astroコンポーネント生成を開始します...')

		for (const handlerFile of handlerFiles) {
			const handlerPath = path.join(handlersPath, handlerFile)
			const componentType = path.basename(
				handlerFile,
				path.extname(handlerFile)
			)
			const componentName = toPascalCase(componentType)
			const outputPath = path.join(outputDir, `${componentName}.astro`)

			try {
				console.log(`\n🔄 ${componentName} の処理を開始...`)

				const handlerModule = await dynamicImport(handlerPath)
				const handler = handlerModule.default || handlerModule

				if (!handler || typeof handler !== 'object') {
					console.warn(
						`⚠️ 警告: ${handlerFile} に有効なハンドラーオブジェクトが見つかりません。スキップします。`
					)
					continue
				}

				const metadata = handler.metadata || {}
				let normalizedVariants = []
				try {
					const extractedAnnotationsPath = path.resolve(
						projectRoot,
						'extracted-annotations.json'
					)
					if (fs.existsSync(extractedAnnotationsPath)) {
						const extractedAnnotations = JSON.parse(
							fs.readFileSync(extractedAnnotationsPath, 'utf-8')
						)
						if (
							extractedAnnotations.componentVariants &&
							extractedAnnotations.componentVariants[componentType]
						) {
							normalizedVariants = extractedAnnotations.componentVariants[
								componentType
							].map((variant) => ({
								value: variant.value,
								label: variant.label,
								description:
									extractedAnnotations.classDescriptions?.[variant.value]
										?.description || `${variant.value} variant`,
							}))
							if (options.verbose) {
								console.log(
									`  📊 CSSから ${normalizedVariants.length} 個のバリアント情報を取得`
								)
							}
						}
					}
				} catch (error) {
					console.error(
						`  ❌ extracted-annotations.json の読み込み/解析エラー:`,
						error
					)
				}

				const componentData = componentInterface.generateComponentProps({
					componentName,
					componentType,
					variants:
						normalizedVariants.length > 0 ? normalizedVariants : undefined,
					defaultProps: handler.defaultProps || {},
					description: metadata.description || `${componentName} component`,
					category: metadata.category || 'UI Components',
					...(metadata.sizes && { sizes: metadata.sizes }),
					...(metadata.borderRadius && { borderRadius: metadata.borderRadius }),
					...(metadata.modifiers && { modifiers: metadata.modifiers }),
				})

				let componentContent = ''

				if (typeof handler.generateAstroTemplate === 'function') {
					console.log(
						`  ✨ カスタムテンプレート (generateAstroTemplate) を使用します。`
					)
					try {
						componentContent = await handler.generateAstroTemplate(
							componentData,
							{}
						)
						if (
							typeof componentContent !== 'string' ||
							!componentContent.trim()
						) {
							throw new Error(
								'generateAstroTemplate must return a non-empty string.'
							)
						}
					} catch (customGenError) {
						console.error(
							`  ❌ カスタムテンプレート (${componentName}) の実行中にエラー:`,
							customGenError
						)
						errorCount++
						continue
					}
				} else {
					if (options.verbose) {
						console.log(`  ⚙️ デフォルトテンプレートを使用します。`)
					}
					componentContent = generateDefaultAstroComponent(componentData)
				}

				if (typeof componentContent !== 'string' || !componentContent.trim()) {
					console.error(
						`  ❌ 生成されたコンポーネントコンテンツが無効です (${componentName})。スキップします。`
					)
					errorCount++
					continue
				}

				if (fs.existsSync(outputPath)) {
					const overwrite = await confirmOverwrite(outputPath, options)
					if (!overwrite) {
						console.log(
							`  ⚠️ スキップしました: ${path.basename(outputPath)} (上書き拒否)`
						)
						continue
					}
				}

				fs.writeFileSync(outputPath, componentContent)
				console.log(
					`  ✅ Astroコンポーネントを生成/更新しました: ${path.basename(outputPath)}`
				)
				generatedCount++
			} catch (error) {
				console.error(
					`❌ ${componentName} の処理中に予期せぬエラーが発生しました:`,
					error
				)
				errorCount++
			}
		}

		console.log('\n🏁 Astroコンポーネント生成が完了しました。')
		if (errorCount === 0) {
			console.log(
				`✨ 成功: ${generatedCount}個のコンポーネントを生成/更新しました。`
			)
		} else {
			console.warn(
				`⚠️ 完了 (一部エラー): ${generatedCount}個のコンポーネントを生成/更新、${errorCount}個のエラーが発生しました。`
			)
			// エラーがあった場合は終了コード1で終了
			// process.exit(1);
		}
	} catch (error) {
		console.error(
			'💥 スクリプト全体の実行中に致命的なエラーが発生しました:',
			error
		)
		process.exit(1)
	}
}

main()
