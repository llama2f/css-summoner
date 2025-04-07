// templates/handlers/auto/heading.jsx

import React from 'react'
import { createHandlerResult } from '../common'

// メタデータ（必須）
export const metadata = {
	type: 'heading',
	category: 'typography',
	description: 'セクションの見出しを表示するコンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	const {
		classString = '',
		children = 'Heading 見出し',
		selectedModifiers = [],
		icon = '⭐',
		baseClass = 'heading-base',
		...rest
	} = props

	const hasIcon = selectedModifiers.includes('heading-with-icon')

	// 基本構造
	const reactElement = (
		<h2 className={classString} {...rest}>
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
	withIcon: 'アイコン付き見出し'
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	samples,
}
