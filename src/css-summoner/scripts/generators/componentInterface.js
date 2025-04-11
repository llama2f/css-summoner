/**
 * componentInterface.js - 型定義とAstroコンポーネントで共通のインターフェース定義を提供
 * このモジュールを利用することで型定義とコンポーネント生成の一貫性を確保します
 */

/**
 * コンポーネントのプロパティ定義を生成する
 * @param {Object} componentData コンポーネントに関する情報
 * @returns {Object} プロパティ定義情報
 */
export function generateComponentProps(componentData) {
	const {
		componentName,
		componentType,
		variants = [],
		sizes = [],
		borderRadius = [],
		modifiers = [],
		defaultProps = {},
		description = '',
		category = 'UI Components',
	} = componentData

	// バリアント型の生成 (値が存在する場合のみ)
	const variantKeys = Array.isArray(variants)
		? variants.map((v) => v.value || v)
		: Object.keys(variants || {})

	const variantType =
		variantKeys.length > 0
			? variantKeys
					.map(
						(v) => `"${typeof v === 'string' ? v.replace(/^[\w-]+-/, '') : v}"`
					)
					.join(' | ')
			: 'string'

	// サイズ型の生成
	const sizeKeys = Array.isArray(sizes) ? sizes.map((s) => s.value || s) : []

	const sizeType =
		sizeKeys.length > 0 ? sizeKeys.map((s) => `"${s}"`).join(' | ') : 'string'

	// 角丸型の生成
	const radiusKeys = Array.isArray(borderRadius)
		? borderRadius.map((r) => r.value || r)
		: []

	const radiusType =
		radiusKeys.length > 0
			? radiusKeys.map((r) => `"${r}"`).join(' | ')
			: 'string'

	// モディファイア型の生成
	const modifierKeys = Array.isArray(modifiers)
		? modifiers.map((m) => m.value || m)
		: []

	const modifierType =
		modifierKeys.length > 0
			? modifierKeys.map((m) => `"${m}"`).join(' | ')
			: 'string'

	// バリアントの説明文生成
	const variantDescriptions = Array.isArray(variants)
		? variants
				.map((v) => {
					const value = v.value || v
					const desc = v.description || `${value} variant`
					return `* - \`${value}\`: ${desc}`
				})
				.join('\n   ')
		: Object.entries(variants || {})
				.map(([key, variant]) => {
					const description = variant?.description || `${key} variant`
					return `* - \`${key}\`: ${description}`
				})
				.join('\n   ')

	// デフォルト値の取得
	const defaultVariant =
		defaultProps.variant || (variantKeys.length > 0 ? variantKeys[0] : '')
	const defaultSize =
		defaultProps.size || (sizeKeys.length > 0 ? sizeKeys[0] : '')
	const defaultRadius =
		defaultProps.radius || (radiusKeys.length > 0 ? radiusKeys[0] : '')
	const defaultColor = defaultProps.color || 'color-neutral'

	// 共通のプロパティ定義オブジェクト
	return {
		// コンポーネント情報
		componentName,
		componentType,
		description: description || `${componentName} component`,
		category,

		// 型定義情報
		variantType,
		sizeType,
		radiusType,
		modifierType,
		variantDescriptions,

		// デフォルト値
		defaultVariant,
		defaultSize,
		defaultRadius,
		defaultColor,

		// その他の設定
		baseClass: `${componentType}-base`,
		element: 'div',

		// インターフェースプロパティ定義
		props: [
			{
				name: 'variant',
				type: variantType || 'string',
				description: 'コンポーネントの視覚的なスタイルバリアント',
				detail: variantDescriptions,
				default: defaultVariant,
			},
			{
				name: 'color',
				type: 'string',
				description: 'カラースキーム (例: color-primary, color-secondary)',
				default: defaultColor,
			},
			{
				name: 'size',
				type: sizeType || 'string',
				description: 'コンポーネントのサイズ',
				default: defaultSize,
			},
			{
				name: 'radius',
				type: radiusType || 'string',
				description: '角丸の設定',
				default: defaultRadius,
			},
			{
				name: 'modifiers',
				type: `Array<${modifierType || 'string'}>`,
				description: '追加のスタイル修飾子 (例: shadow, animate-up)',
				default: '[]',
			},
			{
				name: 'class',
				type: 'string',
				description: '追加のCSSクラス名',
				default: '""',
			},
			{
				name: '[key: string]',
				type: 'any',
				description: 'その他のHTML属性',
				isIndexSignature: true,
			},
		],
	}
}

/**
 * TypeScript型定義用の文字列を生成する
 * @param {Object} propsData generateComponentPropsの戻り値
 * @param {Object} options 追加オプション
 * @returns {string} TypeScript型定義の文字列
 */
export function generateTypeDefinition(propsData, options = {}) {
	const { interfaceNameSuffix = 'Props' } = options

	const props = propsData.props
		.map((prop) => {
			if (prop.isIndexSignature) {
				return `  /**
   * ${prop.description}
   */
  ${prop.name}: ${prop.type};`
			}

			let comment = `  /**
   * ${prop.description}`

			if (prop.default !== undefined && prop.default !== '') {
				comment += `
   * @default "${prop.default}"`
			}

			if (prop.detail) {
				comment += `
   * ${prop.detail}`
			}

			comment += `
   */`

			return `${comment}
  ${prop.name}?: ${prop.type};`
		})
		.join('\n\n')

	return `/**
 * ${propsData.description}
 * 
 * カテゴリ: ${propsData.category}
 * 自動生成されたインターフェース定義 - ${new Date().toISOString()}
 */
export interface ${propsData.componentName}${interfaceNameSuffix} {
${props}
}
`
}

/**
 * Astroコンポーネント用の文字列を生成する
 * @param {Object} propsData generateComponentPropsの戻り値
 * @returns {string} Astroコンポーネントの文字列
 */
export function generateAstroComponent(propsData) {
	// デフォルト値を持つプロパティの抽出と、デフォルト値の文字列化
	const propDefaults = propsData.props
		.filter(
			(prop) =>
				!prop.isIndexSignature &&
				prop.default !== undefined &&
				prop.name !== 'class'
		)
		.map((prop) => {
			let defaultValue = prop.default
			// 配列の場合
			if (prop.default === '[]') return `  ${prop.name} = [],`
			// 通常の文字列の場合
			return `  ${prop.name} = "${prop.default}",`
		})
		.join('\n')

	// class名は特別扱い（classNameとして処理）
	const hasClassProp = propsData.props.find((prop) => prop.name === 'class')

	return `---
/**
 * ${propsData.description}
 * 
 * 自動生成されたコンポーネント - ${new Date().toISOString()}
 * このファイルは自動生成されています。直接編集せずにハンドラを更新してください。
 */

export interface ${propsData.componentName}Props {
${propsData.props
	.map((prop) => {
		if (prop.isIndexSignature) {
			return `  /**
   * ${prop.description}
   */
  ${prop.name}: ${prop.type};`
		}

		let comment = `  /**
   * ${prop.description}`

		if (prop.detail) {
			comment += `
   * ${prop.detail}`
		}

		comment += `
   */`

		return `${comment}
  ${prop.name}?: ${prop.type};`
	})
	.join('\n\n')}
}

const {
${propDefaults}
  class: className = "${hasClassProp?.default?.replace(/"/g, '') || ''}",
  ...props
} = Astro.props as ${propsData.componentName}Props;

// クラス文字列の生成
const baseClass = "${propsData.baseClass}";
const classes = [
  baseClass,
  variant,
  color,
  size,
  radius,
  ...(Array.isArray(modifiers) ? modifiers : []),
  className
].filter(Boolean).join(" ");
---

<${propsData.element} class={classes} {...props}>
  <slot />
</${propsData.element}>
`
}

// デフォルトエクスポート
export default {
	generateComponentProps,
	generateTypeDefinition,
	generateAstroComponent,
}
