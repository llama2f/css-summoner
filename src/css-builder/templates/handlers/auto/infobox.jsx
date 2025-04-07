// templates/handlers/auto/infobox.jsx

import React from 'react'
import { createHandlerResult } from '../common'

// 固定のサンプルアイコン (SVG文字列) - 必要に応じて変更してください
const sampleIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Z" clip-rule="evenodd" /></svg>`

// メタデータ（必須）
export const metadata = {
	type: 'infobox',
	category: 'feedback', // カテゴリを適切に設定
	description: '情報や注意喚起を表示するボックスコンポーネント',
}

// 基本レンダラー（必須） - テキストのみ
export function render(props) {
	const {
		classString = 'infobox-base', // デフォルトクラス
		children = 'インフォメーションメッセージのサンプルです。重要な情報や注意事項を表示するために使用します。',
	} = props

	const reactElement = (
		<div className={classString} style={{ maxWidth: '400px' }}>
			<p>{children}</p>
		</div>
	)

	const htmlString = `<div class="${classString}">
  <p>${children}</p>
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// バリアント特化処理
export const variants = {
	// アイコン付き
	'with-icon': (props) => {
		const {
			classString = 'infobox-base infobox-with-icon', // バリアントクラス追加
			children = 'アイコン付きメッセージのサンプルです。',
		} = props

		const iconReact = (
			<div
				className='infobox-icon'
				dangerouslySetInnerHTML={{ __html: sampleIcon }}
			/>
		)
		const iconHtml = `<div class="infobox-icon">${sampleIcon}</div>`

		const reactElement = (
			<div className={classString} style={{ maxWidth: '400px' }}>
				{iconReact}
				<p>{children}</p>
			</div>
		)

		const htmlString = `<div class="${classString}">
  ${iconHtml}
  <p>${children}</p>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},

	// タイトル付き
	'with-title': (props) => {
		const {
			classString = 'infobox-base infobox-with-title', // バリアントクラス追加
			title = 'インフォボックスタイトル',
			children = 'タイトル付きメッセージのサンプルです。',
		} = props

		const titleReact = <div className='infobox-title'>{title}</div>
		const titleHtml = `<div class="infobox-title">${title}</div>`

		const reactElement = (
			<div className={classString} style={{ maxWidth: '400px' }}>
				{titleReact}
				<p>{children}</p>
			</div>
		)

		const htmlString = `<div class="${classString}">
  ${titleHtml}
  <p>${children}</p>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},

	// アイコンとタイトル付き
	'with-icon-title': (props) => {
		const {
			classString = 'infobox-base infobox-with-icon infobox-with-title', // バリアントクラス追加
			title = 'アイコン＆タイトル付き',
			children = 'アイコンとタイトルが付いたメッセージのサンプルです。',
		} = props

		const iconReact = (
			<div
				className='infobox-icon'
				dangerouslySetInnerHTML={{ __html: sampleIcon }}
			/>
		)
		const iconHtml = `<div class="infobox-icon">${sampleIcon}</div>`
		const titleReact = <div className='infobox-title'>{title}</div>
		const titleHtml = `<div class="infobox-title">${title}</div>`

		const reactElement = (
			<div className={classString} style={{ maxWidth: '400px' }}>
				{iconReact}
				{titleReact}
				<p>{children}</p>
			</div>
		)

		const htmlString = `<div class="${classString}">
  ${iconHtml}
  ${titleHtml}
  <p>{children}</p>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},
}

// プレビュー用サンプル
export const samples = {
	default: '基本インフォボックス',
	'with-icon': 'アイコン付き',
	'with-title': 'タイトル付き',
	'with-icon-title': 'アイコン＆タイトル付き',
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	variants,
	samples,
}
