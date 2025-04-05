// templates/handlers/auto/card.jsx

import React from 'react'
import { createHandlerResult } from '../common'

// メタデータ（必須）
export const metadata = {
	type: 'card',
	category: 'containers',
	description: 'コンテンツを論理的に分割するカードコンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	const {
		classString = '',
		children = '基本カードコンテンツ',
		selectedModifiers = [],
	} = props

	// モディファイア処理
	const hasShadow = selectedModifiers.includes('card-shadow')
	const hasBorder = selectedModifiers.includes('card-border')

	// カードの基本構造
	const reactElement = (
		<div className={classString}>
			<div className='card-body'>
				<h3 className='card-title'>カードタイトル</h3>
				<div className='card-content'>{children}</div>
				<div className='card-footer'>
					<button className='btn-base btn-primary btn-sm'>ボタン</button>
				</div>
			</div>
		</div>
	)

	const htmlString = `<div class="${classString}">
  <div class="card-body">
    <h3 class="card-title">カードタイトル</h3>
    <div class="card-content">${children}</div>
    <div class="card-footer">
      <button class="btn-base btn-primary btn-sm">ボタン</button>
    </div>
  </div>
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// バリアント特化処理
export const variants = {
	// 画像付きカード
	image: (props) => {
		const {
			classString = '',
			imageUrl = '/placeholder-image.jpg',
			title = 'カードタイトル',
			content = 'カードコンテンツ',
		} = props

		const reactElement = (
			<div className={classString}>
				<div className='card-image-container'>
					<img src={imageUrl} alt={title} className='card-image' />
				</div>
				<div className='card-body'>
					<h3 className='card-title'>{title}</h3>
					<div className='card-content'>{content}</div>
					<div className='card-footer'>
						<button className='btn-base btn-primary btn-sm'>詳細</button>
					</div>
				</div>
			</div>
		)

		const htmlString = `<div class="${classString}">
  <div class="card-image-container">
    <img src="${imageUrl}" alt="${title}" class="card-image" />
  </div>
  <div class="card-body">
    <h3 class="card-title">${title}</h3>
    <div class="card-content">${content}</div>
    <div class="card-footer">
      <button class="btn-base btn-primary btn-sm">詳細</button>
    </div>
  </div>
</div>`

		return createHandlerResult(reactElement, htmlString)
	},

	// シンプルなカード
	simple: (props) => {
		const {
			classString = '',
			title = 'シンプルカード',
			content = 'シンプルなカードコンテンツ',
		} = props

		const reactElement = (
			<div className={classString}>
				<div className='card-body'>
					<h3 className='card-title'>{title}</h3>
					<div className='card-content'>{content}</div>
				</div>
			</div>
		)

		const htmlString = `<div class="${classString}">
  <div class="card-body">
    <h3 class="card-title">${title}</h3>
    <div class="card-content">${content}</div>
  </div>
</div>`

		return createHandlerResult(reactElement, htmlString)
	},
}

// プレビュー用サンプル
export const samples = {
	default: '基本カード',
	image: '画像付きカード',
	simple: 'シンプルカード',
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	variants,
	samples,
}
