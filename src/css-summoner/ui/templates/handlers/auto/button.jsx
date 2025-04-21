import React from 'react'
import { sampleIcon, createHandlerResult, separateProps } from '../common'
import { colorRegistry } from '../../../../configs/colors.js'

export const metadata = {
	type: 'button',
	category: 'interactive',
	description: 'インタラクティブなボタンコンポーネント',
}

export function render(props) {
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		[
			'classString',
			'children',
			'selectedModifiers',
			'baseClass',
			'onClick',
			'color',
		],
		['disabled', 'type']
	)

	// colorプロパティを共通プロパティから削除（不要なため）
	const { color, ...filteredCommonProps } = commonProps

	const {
		classString = '',
		children = 'ボタンテキスト',
		selectedModifiers = [],
		onClick = null,
	} = reactProps

	const { disabled = false, type = 'button' } = domProps

	const hasIconLeft = selectedModifiers.includes('btn-icon-left')
	const hasIconRight = selectedModifiers.includes('btn-icon-right')
	const hasIconOnly = selectedModifiers.includes('btn-icon-only')

	let reactElement

	if (hasIconOnly) {
		reactElement = (
			<button
				className={classString}
				disabled={disabled}
				type={type}
				onClick={onClick}
				dangerouslySetInnerHTML={{ __html: sampleIcon }}
				{...filteredCommonProps}
			/>
		)
	} else if (hasIconLeft) {
		reactElement = (
			<button
				className={classString}
				disabled={disabled}
				type={type}
				onClick={onClick}
				dangerouslySetInnerHTML={{ __html: `${sampleIcon} ボタンテキスト` }}
				{...filteredCommonProps}
			/>
		)
	} else if (hasIconRight) {
		reactElement = (
			<button
				className={classString}
				disabled={disabled}
				type={type}
				onClick={onClick}
				dangerouslySetInnerHTML={{ __html: `ボタンテキスト ${sampleIcon}` }}
				{...filteredCommonProps}
			/>
		)
	} else {
		reactElement = (
			<button
				className={classString}
				disabled={disabled}
				type={type}
				onClick={onClick}
				{...filteredCommonProps}
			>
				{children}
			</button>
		)
	}

	return createHandlerResult(reactElement)
}

export function renderIconButton(props) {
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'icon', 'title', 'onClick', 'color'],
		['disabled', 'type']
	)

	// colorプロパティを共通プロパティから削除（不要なため）
	const { color, ...filteredCommonProps } = commonProps
	const {
		classString = '',
		icon = '⚙️',
		title = '',
		onClick = null,
	} = reactProps
	const { disabled = false, type = 'button' } = domProps

	const reactElement = (
		<button
			className={classString}
			title={title}
			disabled={disabled}
			type={type}
			onClick={onClick}
			{...filteredCommonProps}
		>
			{icon}
		</button>
	)

	return createHandlerResult(reactElement)
}

export const variants = {
	'btn-icon': (props) => renderIconButton(props),
	'btn-icon-ghost': (props) => renderIconButton(props),
	'btn-icon-outline': (props) => renderIconButton(props),
}

export const samples = {
	default: 'ボタン',
	primary: 'プライマリボタン',
	icon: '⚙️',
}

export default {
	metadata,
	render,
	variants,
	samples,
	generateAstroTemplate,
}

export function generateAstroTemplate(componentData, options) {
	const astroCode = `---
import type { ButtonProps } from '../types/Button';
import { twMerge } from 'tailwind-merge';


const {
  variant,
  size,
  color = '${colorRegistry.themePrimary.value}',
  radius,
  modifiers,
  modifier,
  disabled,
  class: className,
  ...rest
} = Astro.props as ButtonProps;

const baseClasses = 'btn';
const variantClasses = variant ? \`btn-\${variant}\` : '';
const sizeClasses = size ? \`btn-\${size}\` : '';
const colorClasses = color || '';
const radiusClasses = radius ? \`rounded-\${radius}\` : '';
const modifierClasses = modifier ? \`btn-\${modifier}\` : '';
const modifiersClasses = Array.isArray(modifiers) ? modifiers.join(' ') : '';

const combinedClasses = twMerge(
  baseClasses,
  variantClasses,
  sizeClasses,
  colorClasses,
  radiusClasses,
  modifierClasses,
  modifiersClasses,
  className
);
---
<button class={combinedClasses} {disabled} {...rest}>
  <slot />
</button>
`
	return astroCode
}
