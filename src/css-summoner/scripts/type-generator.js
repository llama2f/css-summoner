// type-generator.js - TypeScript型定義を生成するモジュール (ESM版)
import fs from 'fs' // fsモジュールをインポート
import path from 'path'
import config from './config.js' // config.js をインポート
import { logger, fileUtils, stringUtils } from './utils.js' // utils.js をインポート
import componentInterface from './generators/componentInterface.js' // 共通インターフェース定義モジュール

/**
 * 型定義生成モジュール
 */
const typeGenerator = {
	/**
	 * コンポーネントの型定義を生成する
	 * @param {string} componentType コンポーネントタイプ
	 * @param {Array} variants バリアントの配列 [{ value: string, label: string }]
	 * @param {Array} sizes サイズオプションの配列 [{ value: string, label: string }]
	 * @param {Array} borderRadius 角丸オプションの配列 [{ value: string, label: string }]
	 * @param {Array} modifiers モディファイアの配列 [{ value: string, label: string }]
	 * @param {string} category コンポーネントのカテゴリ
	 * @returns {string} TypeScript型定義の内容
	 */
	createTypeDefinition: (
		componentType,
		variants = [], // デフォルト値を空配列に
		sizes = [],
		borderRadius = [],
		modifiers = [],
		category = 'UI Components' // デフォルトカテゴリ
	) => {
		const { toPascalCase } = stringUtils
		const componentName = toPascalCase(componentType)

		// 共通インターフェースモジュールを使用してコンポーネントのプロパティ定義を生成
		const componentData = componentInterface.generateComponentProps({
			componentName,
			componentType,
			variants,
			sizes,
			borderRadius,
			modifiers,
			category,
			defaultProps: {
				// デフォルト値があれば設定
				variant: variants.length > 0 ? variants[0].value || variants[0] : '',
				size: sizes.length > 0 ? sizes[0].value || sizes[0] : '',
				radius:
					borderRadius.length > 0
						? borderRadius[0].value || borderRadius[0]
						: '',
				color: 'color-neutral',
			},
			description: `${componentName} コンポーネントのプロパティ型定義`,
		})

		// 共通インターフェースモジュールを使用してTypeScript型定義を生成
		return componentInterface.generateTypeDefinition(componentData, {
			interfaceNameSuffix: config.typeGenerator.interfaceNameSuffix,
		})
	},

	/**
	 * すべてのコンポーネントのインデックス型定義ファイルを生成
	 * @param {Object} componentTypesMap コンポーネントタイプ名をキーとするオブジェクト (例: baseClasses)
	 * @param {string} typesDir 型定義ファイルを出力するディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateIndexTypes: (
		componentTypesMap,
		typesDir = config.paths.output.types
	) => {
		try {
			const imports = []
			const exports = []

			// componentTypesMap のキー (コンポーネントタイプ名) をソートして処理
			Object.keys(componentTypesMap)
				.sort()
				.forEach((type) => {
					const name = stringUtils.toPascalCase(type)
					const interfaceName = `${name}${config.typeGenerator.interfaceNameSuffix}`
					// ファイルが存在するか確認してからインポート文を生成 (より安全に)
					const typeFilePath = path.join(typesDir, `${name}.d.ts`)
					if (fs.existsSync(typeFilePath)) {
						imports.push(`import type { ${interfaceName} } from './${name}';`)
						exports.push(`  ${interfaceName},`)
					} else {
						logger.warn(
							`インデックス生成スキップ: 型定義ファイルが見つかりません - ${typeFilePath}`
						)
					}
				})

			if (exports.length === 0) {
				logger.warn(
					'エクスポートする型定義が見つからないため、インデックスファイルを生成しませんでした。'
				)
				return true // エラーではないのでtrueを返す
			}

			const content = `/**
 * 自動生成されたコンポーネント型定義のインデックスファイル。
 * このファイルは直接編集しないでください。変更はスクリプトによって上書きされます。
 */
${imports.join('\n')}

export type {
${exports.join('\n')}
};
`

			// 型定義用の上書き設定を使用
			const useForce =
				config.fileOperations.forceByType?.types ?? config.fileOperations.force
			const useBackup = config.fileOperations.backup?.enabled ?? true

			const filePath = path.join(typesDir, 'index.d.ts')
			const success = fileUtils.safeWriteFile(filePath, content, {
				force: useForce,
				backup: useBackup,
			})

			if (success) {
				logger.info(
					`インデックス型定義ファイルを生成/更新しました: ${filePath}`
				)
			}

			return success
		} catch (error) {
			logger.error(
				'インデックス型定義ファイルの生成中にエラーが発生しました。エラー詳細:',
				error
			) // エラーオブジェクト全体を出力
			return false
		}
	},

	/**
	 * すべてのコンポーネントの型定義ファイルを生成
	 * @param {Object} componentData 構造化されたコンポーネントデータ
	 * @param {Object} configData 設定データ (sizes, borderRadiusOptions, modifiers を含む)
	 * @param {string} typesDir 型定義ファイルを出力するディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateTypeDefinitions: (
		componentData,
		configData, // config.js から取得した設定全体を渡す想定
		typesDir = config.paths.output.types
	) => {
		try {
			logger.info('型定義ファイル生成を開始します...')

			// 型定義ディレクトリの存在確認
			if (!fileUtils.ensureDirectoryExists(typesDir)) {
				logger.error(`型定義ディレクトリの作成に失敗しました: ${typesDir}`)
				return false
			}

			// 型定義用の上書き設定を使用
			const useForce =
				config.fileOperations.forceByType?.types ?? config.fileOperations.force
			const useBackup = config.fileOperations.backup?.enabled ?? true

			// 各コンポーネントタイプの型定義を生成
			let successCount = 0
			const componentKeys = Object.keys(componentData.componentsByType || {}) // componentsByType を使用
			const totalComponents = componentKeys.length

			if (totalComponents === 0) {
				logger.warn('型定義を生成するコンポーネントが見つかりませんでした。')
				return true // エラーではない
			}

			componentKeys.forEach((componentType) => {
				try {
					const componentInfo =
						componentData.componentTypes.find(
							(c) => c.value === componentType
						) || {}
					const variants = componentData.componentVariants[componentType] || []

					// サイズオプション取得 (configDataから取得)
					const sizes =
						configData.sizes?.[componentType] || configData.sizes?.common || []

					// 角丸オプション取得 (configDataから取得)
					// config.js の borderRadiusOptions を参照するように修正が必要かもしれない
					// ここでは仮に configData.borderRadiusOptions を参照
					const borderRadius =
						configData.borderRadiusOptions?.[componentType] ||
						configData.borderRadiusOptions?.common ||
						[]

					// モディファイア取得 (configDataから取得)
					const modifiers =
						configData.modifiers?.[componentType] ||
						configData.modifiers?.common ||
						[]

					// 型定義を生成
					const typeDefinition = typeGenerator.createTypeDefinition(
						componentType,
						variants,
						sizes,
						borderRadius,
						modifiers,
						componentInfo.category
					)

					// ファイル名はPascalCaseに変換
					const typeName = stringUtils.toPascalCase(componentType)
					const typeFilePath = path.join(typesDir, `${typeName}.d.ts`)

					// 型定義ファイルを保存
					const success = fileUtils.safeWriteFile(
						typeFilePath,
						typeDefinition,
						{
							force: useForce,
							backup: useBackup,
						}
					)

					if (success) {
						logger.verbose(`型定義ファイルを生成/更新しました: ${typeFilePath}`)
						successCount++
					}
				} catch (error) {
					logger.error(
						`${componentType}の型定義生成中にエラーが発生しました:`,
						error
					)
				}
			})

			// インデックス型定義ファイルを生成 (baseClassesではなくcomponentsByTypeを渡す方が確実かも)
			const indexSuccess = typeGenerator.generateIndexTypes(
				componentData.componentsByType || {},
				typesDir
			)

			logger.info(
				`型定義ファイル生成が完了しました (${successCount}/${totalComponents}件成功)`
			)

			return successCount > 0 && indexSuccess
		} catch (error) {
			logger.error(
				'型定義ファイル生成プロセス全体でエラーが発生しました。',
				error
			)
			return false
		}
	},
}

export default typeGenerator
