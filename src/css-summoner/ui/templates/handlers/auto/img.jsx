// templates/handlers/auto/img.jsx

import React from 'react'
import { createHandlerResult, combineClasses, separateProps } from '../common' // separateProps をインポート

// メタデータ（必須）- typeをimgに変更
export const metadata = {
	type: 'img',
	category: 'media',
	description: '画像を表示するコンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	// プロパティ分離
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'baseClass', 'selectedModifiers', 'children'], // Reactプロパティ (コンテナdiv用)
		['src', 'alt', 'width', 'height'] // DOM要素プロパティ (img要素用)
	)

	// Reactプロパティから必要な値を取得 (コンテナdiv用)
	const { classString = '', baseClass = '' } = reactProps

	// DOMプロパティから必要な値を取得 (img要素用)
	const {
		src = '/images/sample-girl.png',
		alt = 'サンプル画像',
		width = '250',
		height = '250',
		...restDomProps // img要素に適用する可能性のあるその他のDOM属性
	} = domProps

	// 渡されたクラス文字列をそのまま使用
	const finalClassString = classString

	const reactElement = (
		<div className={finalClassString} {...commonProps}>
			{' '}
			{/* コンテナdivにcommonPropsを展開 */}
			<img
				src={src}
				alt={alt}
				width={width}
				height={height}
				{...restDomProps}
			/>{' '}
			{/* img要素にrestDomPropsを展開 */}
		</div>
	)

	return createHandlerResult(reactElement)
}

// バリアント特化処理
export const variants = {
	// キャプション付き画像（通常・オーバーレイ・ホバー共通ハンドラ）
	'img-caption': (props) => {
		// プロパティ分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			['classString', 'baseClass', 'selectedModifiers', 'children'], // Reactプロパティ
			['src', 'alt', 'width', 'height'] // DOM要素プロパティ
		)

		// Reactプロパティから必要な値を取得
		const {
			classString = '',
			baseClass = '', // baseClassを取得
		} = reactProps

		// DOMプロパティから必要な値を取得
		const {
			src = '/images/sample-girl.png',
			alt = 'サンプル画像',
			width = '250',
			height = '250',
			...restDomProps
		} = domProps

		// 渡されたクラス文字列をそのまま使用
		const finalClassString = classString

		// キャプション付き画像（サンプルテキストを使用）
		const reactElement = (
			<figure className={finalClassString} {...commonProps}>
				<img
					src={src}
					alt={alt}
					width={width}
					height={height}
					{...restDomProps}
				/>
				<figcaption>{samples.caption}</figcaption>
			</figure>
		)

		return createHandlerResult(reactElement)
	},

	// キャプションオーバーレイ
	'img-caption-overlay': (props) => {
		return variants['img-caption'](props)
	},

	// ホバーキャプション
	'img-caption-hover': (props) => {
		return variants['img-caption'](props)
	},
}

// プレビュー用サンプル
export const samples = {
	default: '基本画像',
	caption: '画像キャプション',
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	variants,
	samples,
}
