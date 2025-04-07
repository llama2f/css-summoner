// templates/handlers/auto/badge.jsx

import React from 'react'
import { createHandlerResult } from '../common'

// 固定のサンプルアイコン (SVG文字列) - 必要に応じて変更してください
const sampleIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm.878-4.122a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06L7.5 9.56l4.622-4.622a.75.75 0 0 1 1.06 1.06l-5 5Z" /></svg>`

// メタデータ（必須）
export const metadata = {
	type: 'badge',
	category: 'data display', // カテゴリを適切に設定
	description: '状態や属性を示す小さなラベルコンポーネント',
}

// 基本レンダラー（必須） - デフォルトはアイコン＋テキスト
export function render(props) {
	const {
		classString = 'badge-base', // デフォルトでベースクラスを付与
		children = 'バッジ', // デフォルトテキスト
		selectedModifiers = [],
	} = props

	// モディファイア処理: アイコンスペーシング
	const hasSpacing = selectedModifiers.includes('badge-icon-spacing')
	const iconClass = hasSpacing ? 'badge-icon-spacing' : ''

	// アイコン要素
	const iconReact = (
		<span
			className={iconClass}
			dangerouslySetInnerHTML={{ __html: sampleIcon }}
		/>
	)
	const iconHtml = `<span class="${iconClass}">${sampleIcon}</span>`

	const reactElement = (
		<span className={classString}>
			{iconReact} {/* アイコン */}
			<span>{children}</span> {/* テキスト */}
		</span>
	)

	const htmlString = `<span class="${classString}">
  ${iconHtml} {/* アイコン */}
  <span>{children}</span> {/* テキスト */}
</span>`

	return createHandlerResult(reactElement, htmlString)
}

// バリアント特化処理
export const variants = {
	// アイコンのみバッジ
	'icon-only': (props) => {
		const {
			classString = 'badge-base badge-icon-only', // ベースクラスとバリアントクラス
			children = 'バッジ', // スクリーンリーダー用テキスト
			selectedModifiers = [],
		} = props

		// モディファイア処理: アイコンスペーシング
		const hasSpacing = selectedModifiers.includes('badge-icon-spacing')
		const iconClass = hasSpacing ? 'badge-icon-spacing' : ''

		// アイコン要素
		const iconReact = (
			<span
				className={iconClass}
				dangerouslySetInnerHTML={{ __html: sampleIcon }}
			/>
		)
		const iconHtml = `<span class="${iconClass}">${sampleIcon}</span>`

		const reactElement = (
			<span className={classString}>
				{iconReact}
				<span className='sr-only'>{children}</span> {/* スクリーンリーダー用 */}
			</span>
		)

		const htmlString = `<span class="${classString}">
  ${iconHtml}
  <span class="sr-only">{children}</span>
</span>`

		return createHandlerResult(reactElement, htmlString)
	},
}

// プレビュー用サンプル
export const samples = {
	default: '基本バッジ',
	'icon-only': 'アイコンのみ',
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	variants,
	samples,
}
