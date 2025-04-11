// templates/handlers/auto/text.jsx

import React from 'react'
import { createHandlerResult, combineClasses, separateProps } from '../common' // separateProps をインポート

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
	// プロパティ分離
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'children', 'baseClass', 'selectedModifiers'], // Reactプロパティ
		[] // DOM要素プロパティ (pタグ用)
	)

	// Reactプロパティから必要な値を取得
	const {
		classString = '',
		children = sampleText,
		baseClass = 'text-base',
	} = reactProps

	// DOMプロパティから必要な値を取得
	const { ...restDomProps } = domProps

	// baseClassとclassStringを結合
	const finalClassString = combineClasses({
		baseClass,
		additional: classString,
	})
	const reactElement = (
		<p className={finalClassString} {...restDomProps} {...commonProps}>
			{samples.default || children}
		</p>
	)

	return createHandlerResult(reactElement)
}

// バリアント特化処理
export const variants = {
	// 引用テキスト (<blockquote>)
	quote: (props) => {
		// プロパティ分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			['classString', 'children', 'baseClass', 'selectedModifiers'], // Reactプロパティ
			[] // DOM要素プロパティ (blockquoteタグ用)
		)

		// Reactプロパティから必要な値を取得
		const {
			classString = '',
			children = sampleText,
			baseClass = 'text-quote',
		} = reactProps

		// DOMプロパティから必要な値を取得
		const { ...restDomProps } = domProps

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<blockquote
				className={finalClassString}
				{...restDomProps}
				{...commonProps}
			>
				{samples.quote || children}
			</blockquote>
		)

		return createHandlerResult(reactElement)
	},
}

// プレビュー用サンプル
export const samples = {
	default:
		'通常テキストです　ダミーの文章がここに入っています。改行を見るためにある程度長い文章を入れています。もう少し長い文章にしてみます。',
	quote:
		'引用テキストです　ダミーの文章がここに入っています。改行を見るためにある程度長い文章を入れています。もう少し長い文章にしてみます。',
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	variants,
	samples,
}
