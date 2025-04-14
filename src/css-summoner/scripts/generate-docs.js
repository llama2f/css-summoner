// astro-generator.js - Astroコンポーネントを生成するモジュール (ESM版)
import path from 'path'
import config from './config.js' // config.js をインポート
import { logger, fileUtils, stringUtils } from './utils.js' // utils.js をインポート

/**
 * Astroコンポーネント生成モジュール
 */
const docGenerator = {
	/**
	 * Astroコンポーネントのドキュメントページを生成する
	 * @param {string} componentType コンポーネントタイプ
	 * @param {Array} classes コンポーネントのクラス情報
	 * @param {Object} componentData コンポーネントデータ
	 * @param {string} outputDir 出力ディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateAstroDocPage: (
		componentType,
		classes = [],
		componentData = {},
		outputDir
	) => {
		// デフォルト値追加
		try {
			// componentData は extractAnnotations から渡される想定
			const {
				baseClasses = {},
				componentVariants = {},
				componentExamples = {},
				componentsByType = {},
			} = componentData

			const componentLabel = componentType
				.replace(/-/g, ' ')
				.replace(/\b[a-z]/g, (c) => c.toUpperCase())

			// componentData.componentsByType からバリアント情報を取得
			const componentClasses = componentsByType[componentType] || []
			const variants = componentClasses
				.filter((cls) => cls.variant !== 'base') // baseクラスは除く
				.map((cls) => ({
					variant: cls.variant,
					className: cls.className,
					description: cls.description || '説明なし',
				}))
				.sort((a, b) => a.variant.localeCompare(b.variant)) // バリアント名でソート

			// ベースクラスの情報
			const baseClassInfo = componentClasses.find(
				(cls) => cls.variant === 'base'
			)
			const baseClassName = baseClassInfo?.className || ''
			const baseClassDescription =
				baseClassInfo?.description || `${componentLabel} の基本スタイル`

			// ソースファイルの特定 (重複排除)
			const sourceFiles = [
				...new Set(
					componentClasses.map((cls) => cls.sourceFile).filter(Boolean)
				),
			]

			// バリアントデータをフロントマターに渡すために準備
			const variantsData = variants.map((v) => {
				const exampleData = componentExamples[componentType]?.find(
					(ex) => ex.className === v.className
				)
				const previewHtml = exampleData
					? exampleData.example
					: `<span class='text-neutral-500'>プレビューなし (${v.className})</span>`
				return {
					variant: v.variant,
					className: v.className,
					description: v.description,
					previewHtml: previewHtml,
				}
			})

			// 使用例データをフロントマターに渡すために準備
			// Optional chaining を追加して componentExamples が undefined の場合も考慮
			const examplesData = (componentExamples?.[componentType] || []).map(
				(ex, index) => ({
					exampleHtml: ex.example,
					index: index,
				})
			)

			// Astroページテンプレートの作成
			const astroContent = `---
/**
	* ${componentLabel} コンポーネント ドキュメント
	*
	* このファイルはスクリプトによって自動生成されました。
	* 元のCSSファイルのアノテーション、または generate-astro.js を編集してください。
	* ソース: ${sourceFiles.join(', ') || '不明'}
	*/
import DocLayout from '@layouts/DocLayout.astro'; // 正しいエイリアスを使用
import VariantPreview from '@components/astro/VariantPreview.astro';
import ExamplePreview from '@components/astro/ExamplePreview.astro'; // 使用例コンポーネントをインポート

const pageTitle = "${componentLabel} コンポーネント";
const pageDesc = "${componentLabel} コンポーネントのスタイルバリエーションと使用例。";

// --- フロントマターに変数を渡す ---
const baseClassName = ${JSON.stringify(baseClassName)}; // baseClassName を文字列として渡す
const variantsData = ${JSON.stringify(variantsData)}; // バリアントデータの配列を渡す
const examplesData = ${JSON.stringify(examplesData)}; // 使用例データの配列を渡す
---

<DocLayout title={pageTitle} desc={pageDesc}>
		<div class="container mx-auto px-4 py-8">
			 <h1 class="text-3xl font-bold mb-4">{pageTitle}</h1>
			 <p class="text-lg mb-6">
			   ${baseClassDescription}
			   {/* フロントマターの baseClassName を参照 */}
			   {baseClassName && <code class="ml-2 text-sm p-1 border border-neutral-500/40 rounded">.{baseClassName}</code>}
			 </p>
			

			 {/* バリアントデータをループして VariantPreview コンポーネントを表示 */}
			 {variantsData.length > 0 && (
			   <section class="mb-12">
			     <h2 class="text-2xl font-semibold mb-6 border-b pb-2">バリアント</h2>
			     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			       {variantsData.map(variantProps => (
			         <VariantPreview {...variantProps} />
			       ))}
			     </div>
			   </section>
			 )}

			 <section class="mb-12">
			   <h2 class="text-2xl font-semibold mb-6 border-b pb-2">使用例</h2>
			   {/* ExamplePreviewコンポーネントに examplesData 配列全体を渡す */}
			   <ExamplePreview examples={examplesData} />
			 </section>

			 
		</div>
</DocLayout>
` // astroContent テンプレートリテラルの終了

			// ドキュメント用の上書き設定を使用
			const useForce =
				config.fileOperations.forceByType?.docs ?? config.fileOperations.force
			const useBackup = config.fileOperations.backup?.enabled ?? true

			// ページを保存
			const filePath = path.join(outputDir, `${componentType}.astro`)
			const success = fileUtils.safeWriteFile(filePath, astroContent, {
				// 正しい変数名に修正
				force: useForce,
				backup: useBackup,
			})

			if (success) {
				logger.verbose(
					`${componentType}.astro ドキュメントページを生成/更新しました。`
				)
			}

			return success
		} catch (error) {
			logger.error(
				`${componentType}のAstroドキュメントページ生成中にエラーが発生しました:`,
				error
			)
			return false
		}
	},

	/**
	 * すべてのコンポーネントのAstroドキュメントページを生成する
	 * @param {Object} componentData コンポーネントデータ
	 * @param {Object} configData 設定データ (現在は未使用だが将来的に使う可能性)
	 * @param {string} outputDir 出力ディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateAstroDocPages: (
		componentData,
		configData, // 引数は維持するが、現在は未使用
		outputDir = config.paths.output.docs
	) => {
		try {
			logger.info('Astroドキュメントページ生成を開始します...')

			// 出力ディレクトリの存在確認
			if (!fileUtils.ensureDirectoryExists(outputDir)) {
				logger.error(`ドキュメント出力ディレクトリの作成に失敗: ${outputDir}`)
				return false
			}

			// 各コンポーネントタイプごとにページを作成
			let successCount = 0
			const { componentsByType = {} } = componentData // デフォルト値
			const componentKeys = Object.keys(componentsByType)
			const totalComponents = componentKeys.length

			if (totalComponents === 0) {
				logger.warn(
					'ドキュメントを生成するコンポーネントが見つかりませんでした。'
				)
				return true // エラーではない
			}

			componentKeys.forEach((componentType) => {
				try {
					const classes = componentsByType[componentType]
					const success = docGenerator.generateAstroDocPage(
						componentType,
						classes,
						componentData, // componentData全体を渡す
						outputDir
					)

					if (success) {
						successCount++
					}
				} catch (error) {
					logger.error(
						`${componentType}のAstroドキュメントページ生成中にエラーが発生しました:`,
						error
					)
				}
			})

			logger.info(
				`Astroドキュメントページ生成が完了しました (${successCount}/${totalComponents}件成功)`
			)

			return successCount > 0
		} catch (error) {
			logger.error(
				'Astroドキュメントページ生成プロセス全体でエラーが発生しました。',
				error
			)
			return false
		}
	},
}

export default docGenerator
