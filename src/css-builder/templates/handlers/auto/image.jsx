// templates/handlers/auto/image.jsx

import React from 'react'
import { createHandlerResult } from '../common'

// メタデータ（必須）
export const metadata = {
	type: 'image',
	category: 'media', // カテゴリを適切に設定
	description: '画像を表示するコンポーネント',
}

// 基本レンダラー（必須） - 通常の画像
export function render(props) {
	const {
		classString = 'img-base', // デフォルトクラス
		src = '/placeholder-image.jpg', // デフォルト画像
		alt = 'サンプル画像',
		width = '200', // デフォルト幅
		height = '150', // デフォルト高さ
	} = props

	// div で囲むのは元のハンドラーに合わせる（必要に応じて変更）
	const reactElement = (
		<div className={classString}>
			<img src={src} alt={alt} width={width} height={height} />
		</div>
	)

	const htmlString = `<div class="${classString}">
  <img src="${src}" alt="${alt}" width="${width}" height="${height}" />
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// バリアント特化処理
export const variants = {
	// 画像ギャラリー
	gallery: (props) => {
		const {
			classString = 'img-gallery', // ギャラリー用クラス
			images = [
				// デフォルトの画像リスト
				{ src: '/placeholder-image.jpg', alt: '画像1' },
				{ src: '/placeholder-image.jpg', alt: '画像2' },
				{ src: '/placeholder-image.jpg', alt: '画像3' },
				{ src: '/placeholder-image.jpg', alt: '画像4' },
			],
		} = props

		const reactImages = images.map((img, index) => (
			<img key={index} src={img.src} alt={img.alt} className='w-full h-auto' />
		))

		const htmlImages = images
			.map(
				(img) =>
					`    <img src="${img.src}" alt="${img.alt}" class="w-full h-auto" />`
			)
			.join('\n')

		// グリッドレイアウトで表示
		const reactElement = (
			<div className={classString} style={{ maxWidth: '300px' }}>
				<div className='grid grid-cols-2 gap-2'>{reactImages}</div>
			</div>
		)

		const htmlString = `<div class="${classString} max-w-sm">
  <div class="grid grid-cols-2 gap-2">
${htmlImages}
  </div>
</div>`

		return createHandlerResult(reactElement, htmlString)
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
