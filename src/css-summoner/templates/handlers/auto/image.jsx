// templates/handlers/auto/image.jsx

import React from 'react'
import { createHandlerResult, separateProps } from '../common' // separateProps をインポート

// メタデータ（必須）
export const metadata = {
	type: 'image',
	category: 'media',
	description: '画像を表示するコンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	// プロパティ分離
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'baseClass'], // Reactプロパティ (コンテナdiv用)
		['src', 'alt', 'width', 'height'] // DOM要素プロパティ (img要素用)
	)

	// Reactプロパティから必要な値を取得 (コンテナdiv用)
	const {
		classString = '',
		// baseClass は className に直接結合しないため、ここでは取得しない
	} = reactProps

	// DOMプロパティから必要な値を取得 (img要素用)
	const {
		src = '/placeholder-image.jpg',
		alt = 'サンプル画像',
		width = '200',
		height = '150',
		...restDomProps // img要素に適用する可能性のあるその他のDOM属性
	} = domProps

	const reactElement = (
		<div className={classString} {...commonProps}>
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
	// 画像ギャラリー
	gallery: (props) => {
		// プロパティ分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			['classString', 'images', 'baseClass'], // Reactプロパティ (コンテナdiv用)
			[] // DOM要素プロパティ (ギャラリーコンテナ用)
		)

		// Reactプロパティから必要な値を取得
		const {
			classString = '',
			images = [
				{ src: '/placeholder-image.jpg', alt: '画像1' },
				{ src: '/placeholder-image.jpg', alt: '画像2' },
				{ src: '/placeholder-image.jpg', alt: '画像3' },
				{ src: '/placeholder-image.jpg', alt: '画像4' },
			],
			// baseClass は className に直接結合しないため、ここでは取得しない
		} = reactProps

		// DOMプロパティから必要な値を取得
		const { ...restDomProps } = domProps

		const reactImages = images.map((img, index) => (
			<img key={index} src={img.src} alt={img.alt} className='img-item' />
		))

		// グリッドレイアウトで表示
		const reactElement = (
			<div className={classString} {...restDomProps} {...commonProps}>
				{' '}
				{/* コンテナdivに展開 */}
				<div className='img-grid'>{reactImages}</div>
			</div>
		)

		return createHandlerResult(reactElement)
	},
}

// プレビュー用サンプル
export const samples = {
	default: '基本画像',
	gallery: '画像ギャラリー',
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	variants,
	samples,
}
