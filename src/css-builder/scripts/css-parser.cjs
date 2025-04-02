// css-parser.cjs - CSSファイルからアノテーション情報を抽出するモジュール
const glob = require('glob')
const fs = require('fs')
const path = require('path')
const config = require('./config.cjs') // configをインポート

/**
 * CSS解析モジュール
 */
const cssParser = {
	/**
	 * 特定のタグの値を抽出するヘルパー関数
	 * @param {string} comment コメントテキスト
	 * @param {string} tag タグ名（@component: など）
	 * @returns {string|null} 抽出した値、またはnull
	 */
	extractTagValue: (comment, tag) => {
		const tagIndex = comment.indexOf(tag)
		if (tagIndex === -1) return null

		// タグの後の内容を取得
		const afterTag = comment.substring(tagIndex + tag.length)

		// 次のタグまたはコメント終了までの内容を取得
		const nextTagIndex = cssParser.getNextTagIndex(afterTag)
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
	},

	/**
	 * 次のアノテーションタグの位置を見つける
	 * @param {string} text テキスト
	 * @returns {number} 次のタグの位置、またはタグがない場合は-1
	 */
	getNextTagIndex: (text) => {
		const tags = [
			'@component:',
			'@variant:',
			'@description:',
			'@category:',
			'@example:',
		]
		const indices = tags
			.map((tag) => {
				const index = text.indexOf(tag)
				return index > -1 ? index : Infinity
			})
			.filter((index) => index !== Infinity)

		return indices.length > 0 ? Math.min(...indices) : -1
	},

	/**
	 * CSSファイルからアノテーション情報を抽出する（段階的パース方式）
	 * @param {string} cssContent CSSファイルの内容
	 * @param {string} filename ファイル名（ソース参照用）
	 * @returns {Array} クラス情報の配列
	 */
	extractMetadata: (cssContent, filename) => {
		const classes = []
		const errors = []

		// ステップ1: コメントブロック全体を抽出
		const commentRegex = /\/\*[\s\S]*?\*\//g
		let commentMatch
		let commentIndex = 0

		while ((commentMatch = commentRegex.exec(cssContent)) !== null) {
			commentIndex++
			const comment = commentMatch[0]

			// ステップ2: 必須アノテーションタグの存在チェック
			const hasComponent = comment.includes('@component:')
			const hasVariant = comment.includes('@variant:')
			const hasDescription = comment.includes('@description:')

			// 必須タグがない場合はエラーログを記録してスキップ
			if (!hasComponent || !hasVariant || !hasDescription) {
				const missingTags = []
				if (!hasComponent) missingTags.push('@component')
				if (!hasVariant) missingTags.push('@variant')
				if (!hasDescription) missingTags.push('@description')

				// アノテーションっぽい場合のみエラー報告（false positiveを減らす）
				if (
					comment.includes('@') &&
					(hasComponent || hasVariant || hasDescription)
				) {
					errors.push(
						`${filename}内のコメントブロック#${commentIndex}に必須タグがありません: ${missingTags.join(', ')}`
					)
				}
				continue
			}

			// ステップ3: 各アノテーションの値を抽出
			const component = cssParser.extractTagValue(comment, '@component:')
			const variant = cssParser.extractTagValue(comment, '@variant:')
			const description = cssParser.extractTagValue(comment, '@description:')
			const category =
				cssParser.extractTagValue(comment, '@category:') || 'other'
			const example = cssParser.extractTagValue(comment, '@example:')

			// 値の検証
			if (!component || !variant || !description) {
				const emptyTags = []
				if (!component) emptyTags.push('@component')
				if (!variant) emptyTags.push('@variant')
				if (!description) emptyTags.push('@description')

				errors.push(
					`${filename}内のコメントブロック#${commentIndex}にタグの値がありません: ${emptyTags.join(', ')}`
				)
				continue
			}

			// ステップ4: アノテーション直後のクラスセレクタを検出
			const afterComment = cssContent.substring(
				commentMatch.index + comment.length
			)
			const classNameMatch = afterComment.match(/\.([\w-]+)\s*[\{,]/)

			if (classNameMatch) {
				classes.push({
					component,
					variant,
					className: classNameMatch[1],
					description,
					category,
					example,
					sourceFile: filename,
				})
			} else {
				errors.push(
					`${filename}内のコンポーネント「${component}」のアノテーション直後にクラスセレクタが見つかりません。`
				)
			}
		}

		// エラーがあれば表示
		if (errors.length > 0) {
			console.warn(
				`${filename}の解析中に${errors.length}件の問題が見つかりました：`
			)
			errors.forEach((error) => console.warn(`- ${error}`))
		}

		return classes
	},

	/**
	 * 指定されたディレクトリ内のすべてのCSSファイルからクラス情報を抽出する
	 
	 * @returns {Array} すべてのCSSファイルから抽出されたクラス情報
	 */
	parseAllCssFiles: () => {
		try {
			// スタイルファイルのパスを取得
			const cssFiles = config.paths.getStyleFiles()

			if (cssFiles.length === 0) {
				console.warn(`CSSファイルが見つかりませんでした。`)
				return []
			}

			console.log(`${cssFiles.length}個のCSSファイルを見つけました。`)

			// 各CSSファイルを解析
			let allClasses = []
			let totalErrors = 0

			cssFiles.forEach((filePath) => {
				try {
					const cssContent = fs.readFileSync(filePath, 'utf8')
					const fileName = path.basename(path.dirname(filePath)) + '/index.css'

					if (cssContent) {
						const classes = cssParser.extractMetadata(cssContent, fileName)
						console.log(
							`${fileName}から${classes.length}個のクラスを抽出しました。`
						)
						allClasses = allClasses.concat(classes)
					}
				} catch (error) {
					console.error(`${filePath}の解析中にエラーが発生しました。`, error)
					totalErrors++
				}
			})

			// 結果の集計
			console.log(
				`合計${allClasses.length}個のクラスを抽出しました。${totalErrors > 0 ? `${totalErrors}件のエラーがありました。` : ''}`
			)
			return allClasses
		} catch (error) {
			console.error(`CSSファイルの解析に失敗しました。`, error)
			return []
		}
	},

	/**
	 * 抽出したクラス情報から構造化データを生成する
	 * @param {Array} allClasses 抽出したクラス情報の配列
	 * @returns {Object} 構造化されたコンポーネントデータ
	 */
	structureComponentData: (allClasses) => {
		// 初期化
		const componentTypes = []
		const baseClasses = {}
		const componentVariants = {}
		const classDescriptions = {}
		const componentExamples = {}
		const componentsByType = {}

		// データの集約
		allClasses.forEach((cls) => {
			// componentTypesの構築
			if (!componentTypes.find((c) => c.value === cls.component)) {
				componentTypes.push({
					value: cls.component,
					label: cls.component
						.replace(/-/g, ' ')
						.replace(/\b[a-z]/g, (c) => c.toUpperCase()),
					category: cls.category,
				})
			}

			// コンポーネントタイプごとにクラスを整理
			if (!componentsByType[cls.component]) {
				componentsByType[cls.component] = []
			}
			componentsByType[cls.component].push(cls)

			// baseClassesの構築
			if (cls.variant === 'base') {
				baseClasses[cls.component] = cls.className
			}

			// componentVariantsの構築
			if (!componentVariants[cls.component]) {
				componentVariants[cls.component] = []
			}
			if (cls.variant !== 'base') {
				componentVariants[cls.component].push({
					value: cls.className,
					label: cls.variant
						.replace(/-/g, ' ')
						.replace(/\b[a-z]/g, (c) => c.toUpperCase()),
				})
			}

			// classDescriptionsの構築
			classDescriptions[cls.className] = cls.description

			// 例を保存
			if (cls.example) {
				if (!componentExamples[cls.component]) {
					componentExamples[cls.component] = []
				}
				componentExamples[cls.component].push({
					variant: cls.variant,
					className: cls.className,
					example: cls.example,
				})
			}
		})

		// baseClassが見つからないコンポーネントの警告
		const missingBaseClasses = componentTypes
			.map((c) => c.value)
			.filter((component) => !baseClasses[component])

		if (missingBaseClasses.length > 0) {
			console.warn(
				`以下のコンポーネントにベースクラス（variant: base）が見つかりませんでした: ${missingBaseClasses.join(', ')}`
			)
		}

		return {
			componentTypes,
			baseClasses,
			componentVariants,
			classDescriptions,
			componentExamples,
			componentsByType,
		}
	},
}

module.exports = cssParser