// astro-generator.cjs - Astroコンポーネントを生成するモジュール
const path = require('path')
const config = require('./config.cjs')
const { logger, fileUtils, stringUtils } = require('./utils.cjs')

/**
 * Astroコンポーネント生成モジュール
 */
const astroGenerator = {
	/**
	 * コンポーネントタイプに応じたプレビューHTMLを生成する
	 * @param {string} type コンポーネントタイプ
	 * @param {string} className クラス名
	 * @param {Object} baseClasses ベースクラスのマップ
	 * @returns {string} HTMLコード
	 */
	getComponentPreviewHtml: (type, className, baseClasses) => {
		const baseClass = baseClasses[type] || ''
		const combinedClass = baseClass ? `${baseClass} ${className}` : className

		switch (type) {
			case 'button':
				return `<button class="${combinedClass}">ボタンテキスト</button>`
			case 'card':
				return `<div class="${combinedClass}" style="width: 100%">
        <div class="card-header">
          <h3 class="card-title">カードタイトル</h3>
        </div>
        <div class="card-body">
          <p>カードコンテンツ</p>
        </div>
      </div>`
			case 'heading-formal':
			case 'heading-casual':
			case 'heading-technical':
			case 'heading-accent':
			case 'heading':
				return `<h2 class="${combinedClass}">見出しサンプル</h2>`
			case 'text':
			case 'text-quote':
				return `<p class="${combinedClass}">テキストサンプル</p>`
			case 'infobox':
				return `<div class="${combinedClass}" style="width: 100%">
        <p>インフォメーションメッセージ</p>
      </div>`
			case 'form-input':
				return `<input type="text" class="${combinedClass}" placeholder="テキスト入力" />`
			// 他のコンポーネントタイプに応じたHTMLを追加
			default:
				return `<div class="${combinedClass}">サンプル: ${type}</div>`
		}
	},

	/**
	 * コンポーネント例のコードを生成する
	 * @param {string} type コンポーネントタイプ
	 * @param {Object} componentExamples コンポーネント例のマップ
	 * @param {Object} baseClasses ベースクラスのマップ
	 * @param {Object} componentVariants コンポーネントバリアントのマップ
	 * @returns {string} 例コード
	 */
	getComponentExampleCode: (
		type,
		componentExamples,
		baseClasses,
		componentVariants
	) => {
		const examples = componentExamples[type] || []

		if (examples.length > 0) {
			return examples.map((ex) => ex.example).join('\n\n')
		}

		// デフォルトの例
		const baseClass = baseClasses[type] || ''
		const variants = componentVariants[type] || []

		switch (type) {
			case 'button':
				return `<!-- 基本的な使い方 -->
<button class="${baseClass} ${variants[0]?.value || ''}">ボタンテキスト</button>

<!-- サイズバリエーション -->
<button class="${baseClass} ${variants[0]?.value || ''} btn-sm">小さいボタン</button>
<button class="${baseClass} ${variants[0]?.value || ''} btn-lg">大きいボタン</button>`
			case 'card':
				return `<div class="${baseClass} ${variants[0]?.value || ''}">
  <div class="card-header">
    <h3 class="card-title">カードタイトル</h3>
  </div>
  <div class="card-body">
    <p>カードのコンテンツがここに入ります。</p>
  </div>
  <div class="card-footer">
    <button class="btn-base btn-primary">詳細を見る</button>
  </div>
</div>`
			// 他のコンポーネントタイプに応じた例を追加
			default:
				if (variants.length > 0) {
					return `<!-- 基本的な使い方 -->
<div class="${baseClass} ${variants[0]?.value || ''}">
  サンプルコンテンツ
</div>`
				}
				return `<!-- 使用例が提供されていません -->`
		}
	},

	/**
	 * Astroコンポーネントのドキュメントページを生成する
	 * @param {string} componentType コンポーネントタイプ
	 * @param {Array} classes コンポーネントのクラス情報
	 * @param {Object} componentData コンポーネントデータ
	 * @param {string} outputDir 出力ディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateAstroDocPage: (componentType, classes, componentData, outputDir) => {
		try {
			const { baseClasses, componentVariants, componentExamples } =
				componentData

			const componentLabel = componentType
				.replace(/-/g, ' ')
				.replace(/\b[a-z]/g, (c) => c.toUpperCase())

			// バリアントをグループ化
			const variants = classes
				.filter((cls) => cls.variant !== 'base')
				.map((cls) => ({
					variant: cls.variant,
					className: cls.className,
					description: cls.description,
				}))

			// ベースクラスの取得
			const baseClass = classes.find((cls) => cls.variant === 'base')

			// ソースファイルの特定
			const sourceFiles = [...new Set(classes.map((cls) => cls.sourceFile))]

			// Astroページテンプレートの作成
			const astroContent = `---
/**
 * ${componentLabel} コンポーネント
 * 
 * このファイルは自動生成されています。直接編集せず、元のCSSファイル、scripts/css-builder/astro-generator.cjsを編集してください。
 * ソース: ${sourceFiles.join(', ')}
 */
import DocLayout from '@layouts/DocLayout.astro';
import Menu from '@projects/core/DocMenu.astro'

// スタイルシートのインポート

import '@design/css-builder/styles/all-components.css'
import '@design/css-builder/styles/styles.css'
---

<DocLayout pageTitle="${componentLabel} コンポーネント" desc="${componentLabel}のスタイルとバリエーション">
  <div class="content-width py-8">
    <p class="text-lg mb-8">
      ${baseClass ? baseClass.description : ''}
    </p>
		 <div class="mt-4">
      <a href="/docs/class-builder" class="text-primary hover:text-primary-dark">
        ← カスタムクラスビルダーに戻る
      </a>
    </div>
    <Menu />
   

    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">variant</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${variants
					.map(
						(v) => `
        <div class="p-4 bg-neutral-50 rounded-lg">
          <h3 class="text-lg font-medium mb-2">${v.variant.replace(/-/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase())}</h3>
          <p class="text-sm text-neutral-600 mb-4">${v.description}</p>
          <div class="bg-white p-6 rounded border flex items-center justify-center">
            ${astroGenerator.getComponentPreviewHtml(componentType, v.className, baseClasses)}
          </div>
          <div class="mt-3">
            <code class="text-sm bg-neutral-200 p-1 rounded">${v.className}</code>
          </div>
        </div>
        `
					)
					.join('\n')}
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">使用例</h2>
      <div class="bg-neutral-50 p-6 rounded-lg">
        <pre class="text-sm overflow-x-auto">${astroGenerator.getComponentExampleCode(componentType, componentExamples, baseClasses, componentVariants)}</pre>
      </div>
    </div>
    <Menu />
    <div class="mt-4">
      <a href="/docs/class-builder" class="text-primary hover:text-primary-dark">
        ← カスタムクラスビルダーに戻る
      </a>
    </div>
  </div>
</DocLayout>
`

			// ドキュメント用の上書き設定を使用
			const useForce =
				config.fileOperations.forceByType?.docs ?? config.fileOperations.force
			const useBackup = config.fileOperations.backup?.enabled ?? true

			// ページを保存
			const filePath = path.join(outputDir, `${componentType}.astro`)
			const success = fileUtils.safeWriteFile(filePath, astroContent, {
				force: useForce,
				backup: useBackup,
			})

			if (success) {
				logger.verbose(
					`${componentType}.astro ドキュメントページを生成しました。`
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
	 * Astroコンポーネントを生成する
	 * @param {string} componentType コンポーネントタイプ
	 * @param {Object} componentData コンポーネントのデータ
	 * @param {Object} configData 設定データ
	 * @param {string} outputDir 出力ディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateAstroComponent: (
		componentType,
		componentData,
		configData,
		outputDir
	) => {
		try {
			const { baseClasses, componentVariants } = componentData
			const baseClass = baseClasses[componentType]
			const variants = componentVariants[componentType] || []

			// サイズオプション取得
			const sizes =
				configData.sizes[componentType] || configData.sizes.common || []

			// 角丸オプション取得
			const borderRadius =
				configData.componentBorderRadius?.[componentType] ||
				configData.borderRadiusOptions ||
				[]

			// モディファイア取得
			const modifiers =
				configData.modifiers[componentType] || configData.modifiers.common || []

			// コンポーネント名（PascalCase）
			const componentName = stringUtils.toPascalCase(componentType)

			// Astroコンポーネントテンプレートの作成
			const astroComponentContent = `---
/**
 * ${componentName} コンポーネント（自動生成）
 * 
 * このファイルは自動生成されています。必要に応じてカスタマイズしてください。
 */

export interface Props {
  /**
   * コンポーネントのバリアント
   * @default "${variants.length > 0 ? stringUtils.extractVariantName(variants[0].value) : 'primary'}"
   */
  variant?: ${variants.map((v) => `"${stringUtils.extractVariantName(v.value)}"`).join(' | ') || '"primary"'};
  
  /**
   * コンポーネントのサイズ
   * @default "${sizes.length > 0 ? stringUtils.extractSizeName(sizes[0].value) : 'md'}"
   */
  size?: ${sizes.map((s) => `"${stringUtils.extractSizeName(s.value)}"`).join(' | ') || '"md"'};
  
  /**
   * 角丸の設定
   * @default "${borderRadius.length > 0 ? borderRadius[0].value : ''}"
   */
  radius?: ${borderRadius.map((r) => `"${r.value}"`).join(' | ') || 'string'};
  
  /**
   * 追加のモディファイア
   */
  modifiers?: string[];
  
  /**
   * 追加のCSSクラス
   */
  addClass?: string;
}

const {
  variant = "${variants.length > 0 ? stringUtils.extractVariantName(variants[0].value) : 'primary'}",
  size = "${sizes.length > 0 ? stringUtils.extractSizeName(sizes[0].value) : 'md'}",
  radius = "${borderRadius.length > 0 ? borderRadius[0].value : ''}",
  modifiers = [],
  addClass = "",
} = Astro.props;

// マッピングオブジェクトの定義
const variantClasses = {
${variants.map((v) => `  ${stringUtils.extractVariantName(v.value)}: "${v.value}",`).join('\n')}
};

const sizeClasses = {
${sizes.map((s) => `  ${stringUtils.extractSizeName(s.value)}: "${s.value}",`).join('\n')}
};

const radiusClasses = {
${borderRadius.map((r) => `  ${r.value}: "${r.value}",`).join('\n')}
};

// クラスの構築
const componentClasses = [
  "${baseClass || 'REPLACE_WITH_BASE_CLASS'}", // ベースクラス
  variantClasses[variant],                  // バリアントクラス
  sizeClasses[size],                        // サイズクラス
  radius ? radiusClasses[radius] : null,    // 角丸クラス（条件付き）
  ...modifiers,                             // モディファイア
  addClass                                  // 追加クラス
].filter(Boolean); // nullやundefinedを除去
---

<!-- ${componentName}コンポーネント -->
<div class:list={componentClasses}>
  <slot />
</div>
`

			// コンポーネント用の上書き設定を使用
			const useForce =
				config.fileOperations.forceByType?.components ??
				config.fileOperations.force
			const useBackup = config.fileOperations.backup?.enabled ?? true

			// コンポーネントを保存
			const filePath = path.join(outputDir, `${componentName}.astro`)
			const success = fileUtils.safeWriteFile(filePath, astroComponentContent, {
				force: useForce,
				backup: useBackup,
			})

			if (success) {
				logger.verbose(`${componentName}.astro コンポーネントを生成しました。`)
			}

			return success
		} catch (error) {
			logger.error(
				`${componentType}のAstroコンポーネント生成中にエラーが発生しました:`,
				error
			)
			return false
		}
	},

	/**
	 * すべてのコンポーネントのAstroドキュメントページを生成する
	 * @param {Object} componentData コンポーネントデータ
	 * @param {Object} configData 設定データ
	 * @param {string} outputDir 出力ディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateAstroDocPages: (
		componentData,
		configData,
		outputDir = config.paths.output.docs
	) => {
		try {
			logger.info('Astroドキュメントページ生成を開始します...')

			// 出力ディレクトリの存在確認
			if (!fileUtils.ensureDirectoryExists(outputDir)) {
				return false
			}

			// 各コンポーネントタイプごとにページを作成
			let successCount = 0
			const { componentsByType } = componentData
			const totalComponents = Object.keys(componentsByType).length

			Object.keys(componentsByType).forEach((componentType) => {
				try {
					const classes = componentsByType[componentType]
					const success = astroGenerator.generateAstroDocPage(
						componentType,
						classes,
						componentData,
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
			logger.error('Astroドキュメントページ生成に失敗しました。', error)
			return false
		}
	},

	/**
	 * すべてのコンポーネントのAstroコンポーネントを生成する
	 * @param {Object} componentData コンポーネントデータ
	 * @param {Object} configData 設定データ
	 * @param {string} outputDir 出力ディレクトリ
	 * @returns {boolean} 成功したかどうか
	 */
	generateAstroComponents: (
		componentData,
		configData,
		outputDir = config.paths.output.components
	) => {
		try {
			logger.info('Astroコンポーネント生成を開始します...')

			// 出力ディレクトリの存在確認
			if (!fileUtils.ensureDirectoryExists(outputDir)) {
				return false
			}

			// 各コンポーネントタイプごとにコンポーネントを作成
			let successCount = 0
			const totalComponents = Object.keys(componentData.baseClasses).length

			Object.keys(componentData.baseClasses).forEach((componentType) => {
				try {
					const success = astroGenerator.generateAstroComponent(
						componentType,
						componentData,
						configData,
						outputDir
					)

					if (success) {
						successCount++
					}
				} catch (error) {
					logger.error(
						`${componentType}のAstroコンポーネント生成中にエラーが発生しました:`,
						error
					)
				}
			})

			logger.info(
				`Astroコンポーネント生成が完了しました (${successCount}/${totalComponents}件成功)`
			)

			return successCount > 0
		} catch (error) {
			logger.error('Astroコンポーネント生成に失敗しました。', error)
			return false
		}
	},
}

module.exports = astroGenerator
