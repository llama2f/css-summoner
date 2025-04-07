// templates/handlers/auto/heading.jsx

import React from 'react'
import { createHandlerResult } from '../common'

// Metadata
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
		selectedModifiers = [], // モディファイアを受け取る
		icon = '⭐', // デフォルトアイコン（モディファイア用）
	} = props

	const hasIcon = selectedModifiers.includes('heading-with-icon')

	// 基本構造
	const reactElement = (
		<h2 className={classString}>
			{hasIcon && (
				<span className='heading-icon' role='img' aria-hidden='true'>
					{icon}
				</span>
			)}{' '}
			{/* アイコンとテキストの間にスペース */}
			{children}
		</h2>
	)

	const htmlString = `<h2 class="${classString}">${
		hasIcon
			? `<span class="heading-icon" role="img" aria-hidden="true">${icon}</span> `
			: ''
	}${children}</h2>`

	return createHandlerResult(reactElement, htmlString)
}

// プレビュー用サンプル
export const samples = {
	default: '基本の見出し',
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	// variants は削除したためエクスポートからも削除
	samples,
}
