import fs from 'fs'
import path from 'path'
import config from '../config.js'
import { logger, fileUtils, stringUtils } from '../utils.js'
import componentInterface from './componentInterface.js'
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
		variants = [],
		modifiers = [],
		category = 'UI Components'
	) => {
		const { toPascalCase } = stringUtils
		const componentName = toPascalCase(componentType)

		const componentData = componentInterface.generateComponentProps({
			componentName,
			componentType,
			variants,
			modifiers,
			category,
			defaultProps: {},
			description: `${componentName} コンポーネントのプロパティ型定義`,
		})

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

			Object.keys(componentTypesMap)
				.sort()
				.forEach((type) => {
					const name = stringUtils.toPascalCase(type)
					const interfaceName = `${name}${config.typeGenerator.interfaceNameSuffix}`
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
				return true
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
			)
			return false
		}
	},

	/**
	 * すべてのコンポーネントの型定義ファイルを生成
	 * @param {Object} componentData 構造化されたコンポーネントデータ (extracted-annotations.json の内容)
	 * @param {Object} configData 設定データ (config.js の内容)
	 * @param {string} typesDir 型定義ファイルを出力するディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateTypeDefinitions: (
		componentData,
		configData, // config.js から取得した設定全体
		typesDir = config.paths.output.types
	) => {
		try {
			logger.info('型定義ファイル生成を開始します...')

			if (!fileUtils.ensureDirectoryExists(typesDir)) {
				logger.error(`型定義ディレクトリの作成に失敗しました: ${typesDir}`)
				return false
			}

			const useForce =
				config.fileOperations.forceByType?.types ?? config.fileOperations.force
			const useBackup = config.fileOperations.backup?.enabled ?? true

			let successCount = 0
			const componentKeys = Object.keys(componentData.componentsByType || {})
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

					const modifiers =
						configData.modifiers?.[componentType] ||
						configData.modifiers?.common ||
						[]

					const typeDefinition = typeGenerator.createTypeDefinition(
						componentType,
						variants,
						[],
						[],
						modifiers,
						componentInfo.category
					)

					const typeName = stringUtils.toPascalCase(componentType)
					const typeFilePath = path.join(typesDir, `${typeName}.d.ts`)

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

			// インデックス型定義ファイルを生成
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
