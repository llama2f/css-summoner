// templates/handlers/auto/img.jsx

import React from 'react'
import { createHandlerResult, combineClasses } from '../common'

// メタデータ（必須）- typeをimgに変更
export const metadata = {
	type: 'img',
	category: 'media',
	description: '画像を表示するコンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	const {
		classString = '',
		src = '/placeholder-image.jpg',
		alt = 'サンプル画像',
		width = '200',
		height = '150',
		baseClass = 'img-base',
		selectedModifiers, // 明示的に分離し、DOMに渡さない
		children, // 明示的に分離し、DOMに渡さない
		...domProps // DOM要素に渡す安全なプロパティのみ
	} = props

	// baseClassとclassStringを結合
	const finalClassString = combineClasses({
		baseClass,
		additional: classString,
	})

	const reactElement = (
		<div className={finalClassString} {...domProps}>
			<img src={src} alt={alt} width={width} height={height} />
		</div>
	)

	return createHandlerResult(reactElement)
}

// バリアント特化処理
export const variants = {
	// 画像ギャラリー
	gallery: (props) => {
		const {
			classString = '',
			images = [
				{ src: '/placeholder-image.jpg', alt: '画像1' },
				{ src: '/placeholder-image.jpg', alt: '画像2' },
				{ src: '/placeholder-image.jpg', alt: '画像3' },
				{ src: '/placeholder-image.jpg', alt: '画像4' },
			],
			baseClass = 'img-gallery',
			selectedModifiers, // 明示的に分離し、DOMに渡さない
			children, // 明示的に分離し、DOMに渡さない
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactImages = images.map((img, index) => (
			<img key={index} src={img.src} alt={img.alt} className='img-item' />
		))

		// グリッドレイアウトで表示
		const reactElement = (
			<div className={finalClassString} {...domProps}>
				<div className='img-grid'>
					{reactImages}
				</div>
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
