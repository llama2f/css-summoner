// templates/handlers/auto/text.jsx

import React from 'react'
import { createHandlerResult } from '../common'

// デフォルトのテキストコンテンツ
const sampleText =
	'これは通常のテキストパラグラフのサンプルです。文章の長さはある程度必要ですので、少し長めの文章を入れています。マーカーや文字色、配置などの効果を確認できます。'

// メタデータ（必須）
export const metadata = {
	type: 'text',
	category: 'typography',
	description: '基本的なテキスト表示コンポーネント',
}

// 基本レンダラー（必須） - 通常のテキスト (<p>)
export function render(props) {
	const {
		classString = 'text-base', // デフォルトクラス
		children = sampleText,
	} = props

	const reactElement = <p className={classString}>{children}</p>
	const htmlString = `<p class="${classString}">${children}</p>`

	return createHandlerResult(reactElement, htmlString)
}

// バリアント特化処理
export const variants = {
	// 引用テキスト (<blockquote>)
	quote: (props) => {
		const {
			classString = 'text-quote', // 引用用のクラス
			children = sampleText,
		} = props

		const reactElement = (
			<blockquote className={classString}>{children}</blockquote>
		)
		const htmlString = `<blockquote class="${classString}">${children}</blockquote>`

		return createHandlerResult(reactElement, htmlString)
	},
}

// プレビュー用サンプル
export const samples = {
	default: '通常テキスト',
	quote: '引用テキスト',
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	variants,
	samples,
}
