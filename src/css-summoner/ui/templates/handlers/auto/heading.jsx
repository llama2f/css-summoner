// templates/handlers/auto/heading.jsx

import React from 'react'
import { createHandlerResult, separateProps } from '../common' // separateProps をインポート

// メタデータ（必須）
export const metadata = {
	type: 'heading',
	category: 'typography',
	description: 'セクションの見出しを表示するコンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	// プロパティ分離
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'children', 'selectedModifiers', 'icon', 'baseClass'], // Reactプロパティ
		[] // DOM要素プロパティ (heading特有のものは少ない)
	)

	// Reactプロパティから必要な値を取得
	const {
		classString = '',
		children = 'Heading 見出し',
		selectedModifiers = [],
		icon = '⭐',
		// baseClass は className に直接結合しないため、ここでは取得しない
	} = reactProps

	// DOMプロパティから必要な値を取得
	const { ...restDomProps } = domProps

	const hasIcon = selectedModifiers.includes('heading-with-icon')

	// 基本構造
	const reactElement = (
		<h2 className={classString} {...restDomProps} {...commonProps}>
			{' '}
			{/* classNameには分離したclassStringを、残りは展開 */}
			{hasIcon && (
				<span className='heading-icon' role='img' aria-hidden='true'>
					{icon}
				</span>
			)}{' '}
			{children}
		</h2>
	)

	return createHandlerResult(reactElement)
}

// プレビュー用サンプル
export const samples = {
	default: '基本の見出し',
	withIcon: 'アイコン付き見出し',
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	samples,
}
