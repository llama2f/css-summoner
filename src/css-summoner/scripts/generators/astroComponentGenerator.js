// astroComponentGenerator.js - ハンドラからAstroコンポーネントを生成するモジュール
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import componentInterface from './componentInterface.js' // 共通インターフェース定義モジュール

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * JSXファイルからメタデータを抽出する
 * @param {string} filePath JSXファイルのパス
 * @returns {Object} 抽出されたメタデータ
 */
async function extractMetadataFromJSX(filePath) {
	try {
		// ファイルをテキストとして読み込む
		const content = fs.readFileSync(filePath, 'utf-8')
		console.log(`解析対象: ${path.basename(filePath)}`)

		let metadata = {}

		// 方法1: type定義を直接探す
		const typePattern = /type\s*:\s*['"](\w+)['"]\s*,?/
		const typeMatch = content.match(typePattern)
		if (typeMatch && typeMatch[1]) {
			metadata.type = typeMatch[1]
			console.log(`タイプ検出: ${metadata.type}`)
		}

		// 方法2: categoryを探す
		const categoryPattern = /category\s*:\s*['"](\w+)['"]\s*,?/
		const categoryMatch = content.match(categoryPattern)
		if (categoryMatch && categoryMatch[1]) {
			metadata.category = categoryMatch[1]
			console.log(`カテゴリ検出: ${metadata.category}`)
		}

		// 方法3: descriptionを探す
		const descPattern = /description\s*:\s*['"](.*?)['"]\s*,?/
		const descMatch = content.match(descPattern)
		if (descMatch && descMatch[1]) {
			metadata.description = descMatch[1]
			console.log(`説明文検出: ${metadata.description}`)
		}

		// 方法4: render関数から情報を収集
		if (content.includes('export function render')) {
			console.log(`render関数を発見`)
			// render関数の存在をフラグとして記録
			metadata.hasRender = true
		}

		// バリアントを抜き出す
		const variantsPattern = /['"]([\w-]+)['"]\s*:\s*\(props\)\s*=>\s*{/g
		let variantsMatch
		metadata.variants = {}

		while ((variantsMatch = variantsPattern.exec(content)) !== null) {
			const variantName = variantsMatch[1]
			metadata.variants[variantName] = {
				label: variantName
					.split('-')
					.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
					.join(' '),
				description: `${variantName} variant for ${metadata.type || 'component'}`,
			}
		}

		console.log(
			`抽出されたバリアント数: ${Object.keys(metadata.variants).length}`
		)

		return metadata
	} catch (error) {
		console.error(
			`JSXファイルの解析中にエラーが発生しました: ${filePath}`,
			error
		)
		return {}
	}
}

/**
 * ハンドラからAstroコンポーネントを生成
 * @param {string} handlersPath ハンドラーファイルのディレクトリパス
 * @param {string} outputDir 出力ディレクトリ
 * @param {Object} options 追加設定オプション
 */
export async function generateAstroComponents(
	handlersPath,
	outputDir,
	options = {}
) {
	console.log('Astroコンポーネント生成を開始します...')

	// 出力ディレクトリが存在しない場合は作成
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true })
	}

	// ハンドラファイルを読み込む
	const handlerFiles = fs
		.readdirSync(handlersPath)
		.filter(
			(file) =>
				file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.mjs')
		)

	let generatedCount = 0
	let errorCount = 0

	for (const handlerFile of handlerFiles) {
		try {
			const handlerPath = path.join(handlersPath, handlerFile)

			// JSXファイルの場合は静的解析を使用
			let handler = {}

			if (handlerFile.endsWith('.jsx')) {
				// JSXファイルからメタデータを抽出
				handler.metadata = await extractMetadataFromJSX(handlerPath)
				console.log(`JSX静的解析: ${handlerFile}`)
			} else {
				// 通常のJSファイルの場合は動的インポート
				try {
					const handlerModule = await import(`file://${handlerPath}`)
					handler = handlerModule.default
					console.log(`JS動的インポート: ${handlerFile}`)
				} catch (importError) {
					console.error(
						`ハンドラーファイルのインポートに失敗しました: ${handlerPath}`,
						importError
					)
					errorCount++
					continue
				}
			}

			if (!handler) {
				console.warn(
					`警告: ${handlerFile} にハンドラーが存在しません。スキップします。`
				)
				continue
			}

			// メタデータが異なる形式（metadata直接またはmetadata.type）で格納されている可能性がある
			const metadata = handler.metadata || {}
			const componentType = metadata.type || metadata.componentType || ''

			if (!componentType) {
				console.warn(
					`警告: ${handlerFile} にcomponentTypeが存在しません。スキップします。`
				)
				continue
			}

			const baseClass = metadata.baseClass || `${componentType}-base`

			// コンポーネント名をパスカルケースに変換
			const componentName = toPascalCase(componentType)

			// バリアント情報の処理
			const variants = metadata.variants || handler.variants || {}
			// バリアントの一覧を取得（オブジェクトの場合はキー、関数の場合は関数名）
			const variantKeys =
				typeof variants === 'object'
					? Object.keys(variants)
					: Object.keys(variants).filter(
							(key) => typeof variants[key] === 'function'
						)

			const variantOptions = variantKeys.map((v) => `"${v}"`).join(' | ')

			// デフォルト値を設定
			const defaultProps = handler.defaultProps || {}

			// カスタムジェネレーターが存在する場合は使用する
			if (typeof handler.generateAstroComponent === 'function') {
				const customContent = handler.generateAstroComponent()
				const outputPath = path.join(outputDir, `${componentName}.astro`)

				// 上書き確認
				if (fs.existsSync(outputPath) && !options.force) {
					const overwrite = await confirmOverwrite(outputPath, options)
					if (!overwrite) {
						console.log(`⚠️ スキップしました: ${outputPath} (上書き拒否)`)
						continue
					}
				}

				fs.writeFileSync(outputPath, customContent)
				console.log(`✅ カスタム生成したAstroコンポーネント: ${outputPath}`)
				generatedCount++
				continue
			}

			// バリアント情報をextracted-annotations.jsonから取得
			let normalizedVariants = []

			try {
				// extracted-annotations.jsonを読み込み
				const extractedAnnotationsPath = path.resolve(
					process.cwd(),
					'src/css-summoner/extracted-annotations.json'
				)

				if (fs.existsSync(extractedAnnotationsPath)) {
					const extractedAnnotations = JSON.parse(
						fs.readFileSync(extractedAnnotationsPath, 'utf-8')
					)

					// componentTypeに一致するバリアント情報を取得
					if (
						extractedAnnotations.componentVariants &&
						extractedAnnotations.componentVariants[componentType]
					) {
						// CSSから抽出されたバリアント情報をnormalizedVariantsに追加
						normalizedVariants = extractedAnnotations.componentVariants[
							componentType
						].map((variant) => ({
							value: variant.value,
							label: variant.label,
							description:
								extractedAnnotations.classDescriptions?.[variant.value]
									?.description || `${variant.value} variant`,
						}))

						console.log(
							`CSSから抽出されたバリアント数: ${normalizedVariants.length}`
						)
					}
				}
			} catch (error) {
				console.error(
					'extracted-annotations.jsonの読み込みに失敗しました:',
					error
				)
			}

			// JSXからのバリアント抽出は不要なのでコメントアウト（必要に応じて削除可能）
			/*
			if (variantKeys && variantKeys.length > 0) {
				normalizedVariants = variantKeys.map((key) => {
					const variant = typeof variants[key] === 'object' ? variants[key] : {}
					return {
						value: key,
						label: variant.label || key,
						description:
							variant.description || `${key} variant for ${componentType}`,
					}
				})
			} else if (
				typeof variants === 'object' &&
				Object.keys(variants).length > 0
			) {
				normalizedVariants = Object.entries(variants)
					.map(([key, variant]) => {
						if (typeof variant === 'function') return null
						return {
							value: key,
							label: variant.label || key,
							description:
								variant.description || `${key} variant for ${componentType}`,
						}
					})
					.filter(Boolean)
			}
			*/

			// 共通インターフェースモジュールを使用してAstroコンポーネントを生成
			const componentData = componentInterface.generateComponentProps({
				componentName,
				componentType,
				variants:
					normalizedVariants.length > 0 ? normalizedVariants : undefined,
				defaultProps: {
					variant:
						defaultProps.variant ||
						(normalizedVariants.length > 0 ? normalizedVariants[0].value : ''),
					color: defaultProps.color || 'color-neutral',
					size: defaultProps.size || '',
					radius: defaultProps.radius || '',
				},
				description: metadata.description || `${componentName} component`,
				category: metadata.category || 'UI Components',
				// 元データにsizes, borderRadius, modifiersがある場合は追加
				...(metadata.sizes && { sizes: metadata.sizes }),
				...(metadata.borderRadius && { borderRadius: metadata.borderRadius }),
				...(metadata.modifiers && { modifiers: metadata.modifiers }),
			})

			// componentDataを使用してAstroコンポーネントを生成
			const componentContent =
				componentInterface.generateAstroComponent(componentData)

			// 出力ファイルパス
			const outputPath = path.join(outputDir, `${componentName}.astro`)

			// 上書き確認
			if (fs.existsSync(outputPath) && !options.force) {
				const overwrite = await confirmOverwrite(outputPath, options)
				if (!overwrite) {
					console.log(`⚠️ スキップしました: ${outputPath} (上書き拒否)`)
					continue
				}
			}

			// ファイル書き込み
			fs.writeFileSync(outputPath, componentContent)
			console.log(`✅ Astroコンポーネントを生成しました: ${outputPath}`)
			generatedCount++
		} catch (error) {
			console.error(`❌ ${handlerFile} の処理中にエラーが発生しました:`, error)
			errorCount++
		}
	}

	console.log(
		`Astroコンポーネント生成が完了しました（成功: ${generatedCount}, エラー: ${errorCount}）`
	)
	return { generatedCount, errorCount }
}

/**
 * ファイル上書きの確認
 * 対話型環境でない場合はfalseを返す（安全のため）
 */
function confirmOverwrite(filePath, options) {
	// 非対話型環境または自動確認オプションがある場合はそれに従う
	if (options.autoConfirm === true) return Promise.resolve(true)
	if (options.autoConfirm === false) return Promise.resolve(false)

	// 実際の環境では対話的にreadlineを使って確認を取る
	// ここでは常にtrueを返す簡易実装
	console.log(`注意: 既存のファイルを上書きします: ${filePath}`)
	return Promise.resolve(true)
}

// generateAstroTemplateとformatVariantDocsは不要になったため削除
// 共通インターフェースモジュール(componentInterface.js)でこれらの機能を提供

/**
 * 文字列をパスカルケースに変換
 */
function toPascalCase(str) {
	return str
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('')
}
