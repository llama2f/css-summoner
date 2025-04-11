/**
 * componentInterface.js - 型定義とAstroコンポーネントで共通のインターフェース定義を提供
 * このモジュールを利用することで型定義とコンポーネント生成の一貫性を確保します
 */
import { colorRegistry } from '../../configs/colors.js'
import sizesConfig from '../../configs/sizes.mjs'
import borderRadiusConfig from '../../configs/borderRadius.mjs'

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
		modifiers = [],
		defaultProps = {},
		description = '',
		category = 'UI Components',
	} = componentData

	const variantValues = Array.isArray(variants)
		? variants.map((v) => v.value || v)
		: Object.keys(variants || {})
	const uniqueVariantValues = [...new Set(variantValues)]

	const variantType =
		uniqueVariantValues.length > 0
			? uniqueVariantValues
					.map(
						(v) => `"${typeof v === 'string' ? v.replace(/^[\w-]+-/, '') : v}"`
					)
					.join(' | ')
			: 'string'

	const componentSizeOptions =
		sizesConfig[componentType] || sizesConfig.common || []
	const sizeKeys = componentSizeOptions.map((s) => s.value || s)

	const sizeType =
		sizeKeys.length > 0 ? sizeKeys.map((s) => `"${s}"`).join(' | ') : 'string'

	const commonRadiusOptions = borderRadiusConfig.common || []
	const radiusKeys = commonRadiusOptions.map((r) => r.value || r)

	const radiusType =
		radiusKeys.length > 0
			? radiusKeys.map((r) => `"${r}"`).join(' | ')
			: 'string'

	const colorKeys = Object.values(colorRegistry).map((c) => c.value)
	const colorType =
		colorKeys.length > 0 ? colorKeys.map((c) => `"${c}"`).join(' | ') : 'string'

	const modifierKeys = Array.isArray(modifiers)
		? modifiers.map((m) => m.value || m)
		: []

	const modifiersType =
		modifierKeys.length > 0
			? modifierKeys.map((m) => `"${m}"`).join(' | ')
			: 'string'

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

	const defaultVariant =
		defaultProps.variant ||
		(uniqueVariantValues.length > 0 ? uniqueVariantValues[0] : '')
	const componentDefaultSizeMap = {
		button: 'btn-md',
		badge: 'badge-md',
		form: 'form-md',
		infobox: 'infobox-md',
		tooltip: 'tooltip-md',
	}
	const defaultSizeValue = componentDefaultSizeMap[componentType] || 'text-md'

	const defaultSize =
		defaultProps.size ||
		(sizeKeys.length > 0
			? sizeKeys.find((s) => s === defaultSizeValue) || sizeKeys[0]
			: '')
	const defaultRadius =
		defaultProps.radius ||
		(radiusKeys.length > 0
			? radiusKeys.find((r) => r === 'rounded') || radiusKeys[0]
			: '')
	const defaultColor = defaultProps.color || colorRegistry.themeNeutral.value

	return {
		componentName,
		componentType,
		description: description || `${componentName} component`,
		category,

		variantType,
		sizeType,
		radiusType,
		colorType,
		modifiersType,
		variantDescriptions,

		defaultVariant,
		defaultSize,
		defaultRadius,
		defaultColor,

		baseClass: `${componentType}-base`,
		element: 'div',

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
				type: colorType || 'string',
				description: 'カラースキーム',
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
				type: `Array<${modifiersType || 'string'}>`,
				description: '追加のスタイル修飾子 (例: shadow, animate-up)',
				default: '[]',
			},
			{
				name: 'modifier',
				type: 'string',
				description: '単一の追加スタイル修飾子 (カスタムテンプレート用)',
				default: undefined,
			},
			{
				name: 'disabled',
				type: 'boolean',
				description: '要素を無効化するかどうか (button, input など)',
				default: false,
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

			if (
				prop.default !== undefined &&
				prop.default !== '' &&
				prop.default !== '[]' &&
				prop.default !== false
			) {
				comment += `
   * @default "${prop.default}"`
			} else if (prop.default === '[]') {
				comment += `
   * @default []`
			} else if (prop.default === false) {
				comment += `
   * @default false`
			}

			if (prop.detail) {
				comment += `
   * ${prop.detail}`
			}

			comment += `
   */`

			const optionalMark =
				prop.default === undefined || prop.default === '' ? '?' : ''

			return `${comment}
  ${prop.name}${optionalMark}: ${prop.type};`
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
	const propDefaults = propsData.props
		.filter(
			(prop) =>
				!prop.isIndexSignature &&
				prop.default !== undefined &&
				prop.name !== 'class'
		)
		.map((prop) => {
			let defaultValue = prop.default
			if (prop.default === '[]') return `  ${prop.name} = [],`
			if (typeof prop.default === 'boolean')
				return `  ${prop.name} = ${prop.default},`
			if (typeof prop.default === 'string' && prop.default !== '')
				return `  ${prop.name} = "${prop.default}",`
			return null
		})
		.filter(Boolean)
		.join('\n')

	const hasClassProp = propsData.props.find((prop) => prop.name === 'class')

	const propNamesForDestructuring = propsData.props
		.filter(
			(prop) =>
				!prop.isIndexSignature &&
				prop.name !== 'class' &&
				prop.default === undefined
		)
		.map((prop) => `  ${prop.name},`)
		.join('\n')

	const supportsDisabled = [
		'button',
		'input',
		'select',
		'textarea',
		'fieldset',
	].includes(propsData.element)
	const disabledAttr = supportsDisabled ? '{disabled}' : ''

	return `---
/**
 * ${propsData.description}
 * 
 * 自動生成されたコンポーネント - ${new Date().toISOString()}
 * このファイルは自動生成されています。直接編集せずにハンドラを更新してください。
 */
import type { ${propsData.componentName}Props } from '../types/${propsData.componentName}';

const {
${propDefaults}
${propNamesForDestructuring}
  class: className = "${hasClassProp?.default?.replace(/"/g, '') || ''}",
  ...rest
} = Astro.props as ${propsData.componentName}Props;

const baseClass = "${propsData.baseClass}";
const classes = [
  baseClass,
  variant,
  color,
  size,
  radius,
  ...(Array.isArray(modifiers) ? modifiers : []),
  modifier,
  className
].filter(Boolean).join(" ");
---

<${propsData.element} class={classes} ${disabledAttr} {...rest}>
  <slot />
</${propsData.element}>
`
}

export default {
	generateComponentProps,
	generateTypeDefinition,
	generateAstroComponent,
}
