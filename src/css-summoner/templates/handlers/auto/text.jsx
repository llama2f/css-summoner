// templates/handlers/auto/text.jsx

import React from 'react'
import { createHandlerResult, combineClasses } from '../common'

// デフォルトのテキストコンテンツ
const sampleText =
	'これは通常のテキストパラグラフのサンプルです。文章の長さはある程度必要ですので、少し長めの文章を入れています。マーカーや文字色、配置などの効果を確認できます。'

// メタデータ（必須）
export const metadata = {
	type: 'text',
	category: 'typography',
	description: '基本的なテキスト表示コンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	const {
		classString = '',
		children = sampleText,
		baseClass = 'text-base',
		selectedModifiers, // 明示的に分離し、DOMに渡さない
		...domProps // DOM要素に渡す安全なプロパティのみ
	} = props

	// baseClassとclassStringを結合
	const finalClassString = combineClasses({
		baseClass,
		additional: classString,
	})

	const reactElement = <p className={finalClassString} {...domProps}>{children}</p>

	return createHandlerResult(reactElement)
}

// バリアント特化処理
export const variants = {
	// 引用テキスト (<blockquote>)
	quote: (props) => {
		const {
			classString = '',
			children = sampleText,
			baseClass = 'text-quote',
			selectedModifiers, // 明示的に分離し、DOMに渡さない
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<blockquote className={finalClassString} {...domProps}>{children}</blockquote>
		)

		return createHandlerResult(reactElement)
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
