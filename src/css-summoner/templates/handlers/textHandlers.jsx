// handlers/textHandlers.jsx
// テキスト関連コンポーネントのハンドラー

import React from 'react'
import { createHandlerResult } from './common'

// デフォルトのテキストコンテンツ
const sampleText =
	'これは通常のテキストパラグラフのサンプルです。文章の長さはある程度必要ですので、少し長めの文章を入れています。マーカーや文字色、配置などの効果を確認できます。'

// テキストハンドラー
export const textHandler = (options) => {
	const { classString = '', componentType } = options

	const reactElement = <p className={classString}>{sampleText}</p>

	const htmlString = `<p class="${classString}">${sampleText}</p>`
	return createHandlerResult(reactElement, htmlString)
}

//引用テキストハンドラー
export const quoteTextHandler = (options) => {
	const { classString = '' } = options

	const reactElement = (
		<blockquote className={classString}>{sampleText}</blockquote>
	)

	const htmlString = `<blockquote class="${classString}">${sampleText}</blockquote>`
	return createHandlerResult(reactElement, htmlString)
}

// テキスト関連のパターンハンドラー
export const textPatternHandler = {
	'text-quote': quoteTextHandler,
	'^text': textHandler,
}
