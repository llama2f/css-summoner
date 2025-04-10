/**
 * PostCSS plugin to extract component annotations from CSS files
 * Based on the existing css-parser.js functionality
 */

// --- Constants ---
const PLUGIN_NAME = 'postcss-css-annotations'
const MESSAGE_TYPE = 'css-annotations-data'
const DEFAULT_CATEGORY = 'other'

const TAGS = {
	COMPONENT: '@component:',
	VARIANT: '@variant:',
	DESCRIPTION: '@description:',
	CATEGORY: '@category:',
	EXAMPLE: '@example:',
}

const DEFAULT_RECOGNIZED_TAGS = Object.values(TAGS)
const DEFAULT_REQUIRED_TAGS = [TAGS.COMPONENT, TAGS.VARIANT, TAGS.DESCRIPTION]
// --- End Constants ---

/**
 * 特定のタグの値を抽出するヘルパー関数
 * @param {string} comment コメントテキスト
 * @param {string} tag タグ名（@component: など）
 * @param {Array} allTags 認識する全タグのリスト
 * @returns {string|null} 抽出した値、またはnull
 */
function extractTagValue(comment, tag, allTags) {
	const tagIndex = comment.indexOf(tag)
	if (tagIndex === -1) return null

	// タグの後の内容を取得
	const afterTag = comment.substring(tagIndex + tag.length)

	// 次のタグまたはコメント終了までの内容を取得
	const nextTagIndex = getNextTagIndex(afterTag, allTags)
	const valueRaw =
		nextTagIndex > -1
			? afterTag.substring(0, nextTagIndex)
			: afterTag.substring(
					0,
					afterTag.indexOf('*/') !== -1
						? afterTag.indexOf('*/')
						: afterTag.length
				)

	// 行頭の*や空白を削除して整形
	return valueRaw
		.split('\n')
		.map((line) => line.replace(/^\s*\*?\s*/, '').trim())
		.join('\n')
		.trim()
}

/**
 * 次のアノテーションタグの位置を見つける
 * @param {string} text テキスト
 * @param {Array} tags 認識するタグのリスト
 * @returns {number} 次のタグの位置、またはタグがない場合は-1
 */
function getNextTagIndex(text, tags) {
	const indices = tags
		.map((tag) => {
			const index = text.indexOf(tag)
			return index > -1 ? index : Infinity
		})
		.filter((index) => index !== Infinity)

	return indices.length > 0 ? Math.min(...indices) : -1
}

/**
 * コンポーネントデータを整理して構造化する
 * @param {Array} classes 抽出したクラス情報の配列
 * @returns {Object} 構造化したデータ
 */
function structureComponentData(classes) {
	// データ構造の初期化
	const componentTypes = {}
	const baseClasses = {}
	const componentVariants = {}
	const classDescriptions = {}
	const componentExamples = {}
	const classRuleDetails = {}

	// データの集約
	classes.forEach((cls) => {
		const {
			component,
			variant,
			className,
			description,
			category,
			example,
			ruleText,
			selector,
			sourceFile,
		} = cls

		// componentTypesの構築
		if (!componentTypes[component]) {
			componentTypes[component] = []
		}
		if (!componentTypes[component].includes(className)) {
			componentTypes[component].push(className)
		}

		// baseClassesの構築 (variantが'base'の場合)
		if (variant === 'base') {
			baseClasses[component] = className
		}

		// componentVariantsの構築
		if (!componentVariants[component]) {
			componentVariants[component] = {}
		}
		componentVariants[component][variant] = className

		// classDescriptionsの構築
		classDescriptions[className] = {
			component,
			variant,
			description,
			category: category || null, // Keep null if explicitly null, otherwise use default later if needed
		}

		// componentExamplesの構築
		if (example) {
			if (!componentExamples[component]) {
				componentExamples[component] = []
			}
			componentExamples[component].push({
				variant,
				className,
				example,
			})
		}

		// classRuleDetailsの構築
		if (ruleText && selector) {
			classRuleDetails[className] = {
				ruleText,
				selector,
				sourceFile,
				relatedRules: [], // 関連するルール（疑似要素、子孫要素など）を格納する配列
			}
		}
	})

	return {
		componentTypes,
		baseClasses,
		componentVariants,
		classDescriptions,
		componentExamples,
		classRuleDetails,
	}
}

/**
 * セレクタからクラス名を抽出する
 * @param {string} selector CSSセレクタ
 * @returns {string|null} 抽出したクラス名またはnull
 */
function extractClassName(selector) {
	// Match the first class name, handling potential pseudo-classes/elements
	const firstClassMatch = selector.match(/^\s*\.([\w-]+)/)
	return firstClassMatch ? firstClassMatch[1] : null
}

/**
 * PostCSSプラグイン
 */
module.exports = (opts = {}) => {
	// デフォルトオプションとマージ
	const options = {
		outputPath: null,
		recognizedTags: DEFAULT_RECOGNIZED_TAGS,
		requiredTags: DEFAULT_REQUIRED_TAGS,
		verbose: false,
		...opts,
	}

	return {
		postcssPlugin: PLUGIN_NAME,

		Once(root, { result }) {
			// 抽出したクラス情報
			const classes = []
			const errors = []

			let commentIndex = 0

			// すべてのコメントノードを走査
			root.walkComments((comment) => {
				commentIndex++
				const commentText = comment.text // コメント内容 (/* */ は含まない)
				const fullCommentText = `/*${commentText}*/` // アノテーション抽出用に復元

				// ステップ1: 認識するアノテーションタグが一つでも含まれるかチェック
				const hasAnyRecognizedTag = options.recognizedTags.some((tag) =>
					fullCommentText.includes(tag)
				)
				if (!hasAnyRecognizedTag) {
					return // アノテーションコメントでなければスキップ
				}

				// ステップ2: 必須アノテーションタグの存在チェック
				const missingTags = options.requiredTags.filter(
					(tag) => !fullCommentText.includes(tag)
				)
				if (missingTags.length > 0) {
					const errorMsg = `${
						result.opts.from || 'unknown'
					} 内のコメントブロック #${commentIndex} (line ${
						comment.source.start.line
					}) に必須タグがありません: ${missingTags.join(', ')}`
					errors.push(errorMsg)
					// Don't return here, allow extracting other tags if present
				}

				// ステップ3: 各アノテーションの値を抽出
				const component = extractTagValue(
					fullCommentText,
					TAGS.COMPONENT,
					options.recognizedTags
				)
				const variant = extractTagValue(
					fullCommentText,
					TAGS.VARIANT,
					options.recognizedTags
				)
				const description = extractTagValue(
					fullCommentText,
					TAGS.DESCRIPTION,
					options.recognizedTags
				)
				const category =
					extractTagValue(
						fullCommentText,
						TAGS.CATEGORY,
						options.recognizedTags
					) || DEFAULT_CATEGORY // Use default if not found
				const example = extractTagValue(
					fullCommentText,
					TAGS.EXAMPLE,
					options.recognizedTags
				)

				// 値の検証 (必須タグの値が空でないか) - missingTagsチェックの後に行う
				const emptyRequiredValues = []
				if (options.requiredTags.includes(TAGS.COMPONENT) && !component)
					emptyRequiredValues.push(TAGS.COMPONENT)
				if (options.requiredTags.includes(TAGS.VARIANT) && !variant)
					emptyRequiredValues.push(TAGS.VARIANT)
				if (options.requiredTags.includes(TAGS.DESCRIPTION) && !description)
					emptyRequiredValues.push(TAGS.DESCRIPTION)

				if (emptyRequiredValues.length > 0) {
					const errorMsg = `${
						result.opts.from || 'unknown'
					} 内のコメントブロック #${commentIndex} (line ${
						comment.source.start.line
					}) に必須タグの値がありません: ${emptyRequiredValues.join(', ')}`
					errors.push(errorMsg)
					return // If required values are missing, skip this annotation block
				}

				// If component or variant couldn't be extracted (even if not required), skip
				if (!component || !variant) {
					if (
						options.verbose &&
						!missingTags.length &&
						!emptyRequiredValues.length
					) {
						// Log only if it wasn't already reported as a missing/empty required tag
						console.warn(
							`Skipping annotation block #${commentIndex} in ${result.opts.from || 'unknown'} due to missing component or variant tag value.`
						)
					}
					return
				}

				// ステップ4: アノテーションコメントの直後のルールノードを取得
				let nextNode = comment.next()
				// コメントとルールの間の空白ノードなどをスキップ
				while (nextNode && nextNode.type !== 'rule') {
					// Allow whitespace nodes between comment and rule
					if (nextNode.type === 'text' && nextNode.text.trim() === '') {
						nextNode = nextNode.next()
					} else if (nextNode.type === 'comment') {
						// Allow other comments, but log if verbose
						if (options.verbose) {
							console.log(
								`Skipping intermediate comment at line ${nextNode.source.start.line} in ${result.opts.from || 'unknown'}`
							)
						}
						nextNode = nextNode.next()
					} else {
						// If it's not whitespace or another comment, break
						nextNode = null
						break
					}
				}

				if (nextNode && nextNode.type === 'rule') {
					const rule = nextNode
					const ruleText = rule.toString()
					const selector = rule.selector

					// セレクタからクラス名を抽出
					const className = extractClassName(selector)

					if (className) {
						classes.push({
							component,
							variant,
							className,
							description,
							category, // Already has default applied
							example,
							sourceFile: result.opts.from || 'unknown',
							ruleText,
							selector,
						})

						if (options.verbose) {
							console.log(`クラス抽出: ${className} (${component}/${variant})`)
						}
					} else {
						const errorMsg = `${
							result.opts.from || 'unknown'
						} 内のコンポーネント「${component}」(line ${
							comment.source.start.line
						}) のアノテーション直後のルール (${selector}) からクラス名を抽出できませんでした。`
						errors.push(errorMsg)
					}
				} else {
					const errorMsg = `${
						result.opts.from || 'unknown'
					} 内のコンポーネント「${component}」(line ${
						comment.source.start.line
					}) のアノテーション直後にCSSルールが見つかりません。`
					errors.push(errorMsg)
				}
			})

			// 抽出したデータを構造化
			const structuredData = structureComponentData(classes)

			// 関連ルールの収集（hover、子孫セレクタなど）
			// 各クラスに関連するすべてのセレクタを探して関連付ける
			if (structuredData.classRuleDetails) {
				const classNames = Object.keys(structuredData.classRuleDetails)

				// root内のすべてのルールを走査して関連セレクタを探す
				root.walkRules((rule) => {
					const ruleSelector = rule.selector
					const ruleText = rule.toString()

					// 各登録済みクラスについて、関連する可能性のあるセレクタをチェック
					classNames.forEach((className) => {
						// 1. 完全一致のセレクタは既にclassRuleDetailsに登録済みなので除外
						if (ruleSelector === `.${className}`) {
							return
						}

						// 2. 関連するセレクタをチェック (疑似要素、子孫、ネストなど)
						const isPseudoSelector =
							ruleSelector.startsWith(`.${className}:`) || // 疑似クラス: .btn:hover
							ruleSelector.includes(`:${className}`) || // 特殊疑似クラス: :not(.btn)
							ruleSelector.match(new RegExp(`\\.${className}::?[\\w-]+`)) // 疑似要素: .btn::before

						const isChildSelector =
							ruleSelector.includes(` .${className}`) || // 子要素: .parent .btn
							ruleSelector.includes(`>.${className}`) || // 直接の子: .parent>.btn
							ruleSelector.includes(`+.${className}`) || // 隣接要素: .sibling+.btn
							ruleSelector.includes(`~.${className}`) // 兄弟要素: .sibling~.btn

						const isParentSelector =
							ruleSelector.includes(`.${className} `) || // 親要素: .btn .icon
							ruleSelector.includes(`.${className}>`) // 直接の親: .btn>span

						const isCompoundSelector =
							ruleSelector.includes(`.${className}.`) || // 複合クラス: .btn.large
							ruleSelector.includes(`[class*=${className}]`) // 属性セレクタ

						// いずれかの条件に一致したら関連ルールとして登録
						if (
							isPseudoSelector ||
							isChildSelector ||
							isParentSelector ||
							isCompoundSelector
						) {
							// 既に同じルールが登録されていないことを確認
							const isRuleAlreadyAdded = structuredData.classRuleDetails[
								className
							].relatedRules.some((r) => r.ruleText === ruleText)

							if (!isRuleAlreadyAdded) {
								structuredData.classRuleDetails[className].relatedRules.push({
									selector: ruleSelector,
									ruleText: ruleText,
									sourceFile: result.opts.from || 'unknown',
								})
							}
						}
					})
				})
			}

			// 追加情報
			structuredData.meta = {
				totalClasses: classes.length,
				errors: errors, // Include errors found during parsing
				source: result.opts.from || 'unknown',
			}

			// ベースクラスが見つからないコンポーネントの警告 (構造化後に行う)
			const missingBaseClasses = Object.keys(
				structuredData.componentTypes
			).filter((component) => !structuredData.baseClasses[component])

			if (missingBaseClasses.length > 0) {
				const warningMsg = `以下のコンポーネントにベースクラス（variant: base）が見つかりませんでした: ${missingBaseClasses.join(
					', '
				)}`
				// Add to meta errors and also emit PostCSS warning
				structuredData.meta.errors.push(warningMsg)
				result.warn(warningMsg, { plugin: PLUGIN_NAME })
			}

			// 結果をPostCSSのメッセージとして追加
			result.messages.push({
				type: MESSAGE_TYPE, // Use constant
				plugin: PLUGIN_NAME,
				data: structuredData,
			})

			// エラーがあればワーニングとして追加 (重複を避けるため meta.errors を参照)
			structuredData.meta.errors.forEach((error) => {
				// Avoid duplicating the base class warning
				if (
					!error.includes('ベースクラス（variant: base）が見つかりませんでした')
				) {
					result.warn(error, { plugin: PLUGIN_NAME })
				}
			})

			// ログ出力
			if (options.verbose) {
				console.log(
					`抽出完了: ${structuredData.meta.totalClasses}個のクラスと${structuredData.meta.errors.length}個のエラーが見つかりました`
				)
			}

			// オプションで出力先が指定されていれば、JSONとして保存
			if (options.outputPath && typeof options.outputPath === 'string') {
				try {
					// Use require inside the function only when needed
					const fs = require('node:fs')
					const path = require('node:path')

					// 出力ディレクトリが存在しない場合は作成
					const outputDir = path.dirname(options.outputPath)
					if (!fs.existsSync(outputDir)) {
						fs.mkdirSync(outputDir, { recursive: true })
					}

					fs.writeFileSync(
						options.outputPath,
						JSON.stringify(structuredData, null, 2)
					)

					if (options.verbose) {
						console.log(`JSONファイルを保存しました: ${options.outputPath}`)
					}
				} catch (error) {
					const errorMsg = `JSONファイルの出力に失敗しました: ${error.message}`
					result.warn(errorMsg, { plugin: PLUGIN_NAME }) // Add plugin name to warning
				}
			}
		},
	}
}

// PostCSSプラグインとして登録
module.exports.postcss = true
