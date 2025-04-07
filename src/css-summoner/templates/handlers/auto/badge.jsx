// templates/handlers/auto/badge.jsx

import React from 'react'
import { createHandlerResult } from '../common'

// 固定のサンプルアイコン (SVG文字列) - badge-icon クラスを追加
const sampleIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="badge-icon"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm.878-4.122a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06L7.5 9.56l4.622-4.622a.75.75 0 0 1 1.06 1.06l-5 5Z" /></svg>`

// メタデータ（必須）
export const metadata = {
	type: 'badge',
	category: 'data display', // カテゴリを適切に設定
	description: '状態や属性を示す小さなラベルコンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	const {
		classString = 'badge-base', // デフォルトでベースクラスを付与
		children = 'バッジ', // デフォルトテキスト
		selectedModifiers = [],
		baseClass, // baseClass を受け取るが、DOM には渡さない
		...rest // 残りの props
	} = props

	const isIconOnly = selectedModifiers.includes('badge-icon-only')
	const hasIconLeft = selectedModifiers.includes('badge-icon-left')
	const hasIconRight = selectedModifiers.includes('badge-icon-right')

	// アイコン要素 (必要な場合のみ生成)
	const iconReact =
		hasIconLeft || hasIconRight || isIconOnly ? (
			<span key='icon' dangerouslySetInnerHTML={{ __html: sampleIcon }} />
		) : null
	const iconHtml = hasIconLeft || hasIconRight || isIconOnly ? sampleIcon : ''

	// テキスト要素 (アイコンのみでない場合)
	const textReact = !isIconOnly ? (
		<span key='text'>{children}</span>
	) : (
		<span key='text-sr' className='sr-only'>
			{children}
		</span>
	)
	const textHtml = !isIconOnly
		? `<span>${children}</span>`
		: `<span class="sr-only">${children}</span>`

	// React要素の組み立て (key を追加)
	let reactChildren = []
	if (hasIconLeft)
		reactChildren.push(
			<span key='icon-left' dangerouslySetInnerHTML={{ __html: sampleIcon }} />
		)
	reactChildren.push(textReact) // textReact には key が設定済み
	if (hasIconRight)
		reactChildren.push(
			<span key='icon-right' dangerouslySetInnerHTML={{ __html: sampleIcon }} />
		)
	if (isIconOnly)
		reactChildren = [
			<span key='icon-only' dangerouslySetInnerHTML={{ __html: sampleIcon }} />,
			textReact,
		] // textReact には key が設定済み

	const reactElement = (
		// baseClass を除いた rest props を展開
		<span className={classString} {...rest}>
			{reactChildren}
		</span>
	)

	// HTML文字列の組み立て
	let htmlChildren = []
	if (hasIconLeft) htmlChildren.push(iconHtml)
	htmlChildren.push(textHtml) // テキストは常に（sr-only含む）
	if (hasIconRight) htmlChildren.push(iconHtml)
	if (isIconOnly) htmlChildren = [iconHtml, textHtml] // アイコンのみの場合はアイコンとsr-onlyテキスト

	// HTML属性を文字列に変換 (class, baseClass 以外)
	const attributes = Object.entries(rest)
		.map(([key, value]) => `${key}="${value}"`)
		.join(' ')

	const htmlString = `<span class="${classString}" ${attributes}>
  ${htmlChildren.join('\n  ')}
</span>`

	return createHandlerResult(reactElement, htmlString)
}

// プレビュー用サンプル
export const samples = {
	default: '基本バッジ',
	iconLeft: '左アイコン',
	iconRight: '右アイコン',
	iconOnly: 'アイコンのみ', // スクリーンリーダー用テキスト
}

// デフォルトエクスポート (variants を削除)
export default {
	metadata,
	render,
	samples,
}
