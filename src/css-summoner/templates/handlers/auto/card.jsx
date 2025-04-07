// templates/handlers/auto/card.jsx

import React from 'react'
import { createHandlerResult } from '../common'

// メタデータ（必須）
export const metadata = {
	type: 'card',
	category: 'container', // タイポ修正
	description: 'コンテンツを論理的に分割するカードコンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	const {
		classString = '',
		title = 'カードタイトル', // props を追加
		subtitle = 'サブタイトル', // props を追加
		content = 'カードのコンテンツがここに入ります。テキストや画像など、様々なコンテンツを含めることができます。', // props を追加
		actionLabel = 'アクション', // props を追加
		selectedModifiers = [],
	} = props

	// モディファイア処理はここでは不要（CSS側で対応）

	// カードの基本構造 (cardHandler ベースに更新)
	const reactElement = (
		<div className={classString} style={{ maxWidth: '300px' }}>
			<div className='card-header'>
				<h3 className='card-title'>{title}</h3>
				<p className='card-subtitle'>{subtitle}</p>
			</div>
			<div className='card-body'>
				<p>{content}</p>
			</div>
			<div className='card-footer'>
				<div className='card-actions'>
					<button className='btn-primary btn-sm'>{actionLabel}</button>
				</div>
			</div>
		</div>
	)

	const htmlString = `<div class="${classString} max-w-sm">
	 <div class="card-header">
	   <h3 class="card-title">${title}</h3>
	   <p class="card-subtitle">${subtitle}</p>
	 </div>
	 <div class="card-body">
	   <p>${content}</p>
	 </div>
	 <div class="card-footer">
	   <div class="card-actions">
	     <button class="btn-primary btn-sm">${actionLabel}</button>
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
	// この行の閉じ括弧を削除

	// 横並びカード (cardHorizontalHandler から移植)
	horizontal: (props) => {
		const {
			classString = '',
			imageUrl = '/placeholder-image.jpg', // 画像URLを追加
			title = '横並びカード',
			content = 'カードのコンテンツです。',
		} = props

		const reactElement = (
			<div className={classString} style={{ maxWidth: '400px' }}>
				{' '}
				{/* 横幅調整 */}
				<div className='card-image-container'>
					{' '}
					{/* 画像コンテナ */}
					<img src={imageUrl} alt={title} className='card-image' />
				</div>
				<div className='card-body'>
					<h3 className='card-title'>{title}</h3>
					<p>{content}</p>
				</div>
			</div>
		)

		const htmlString = `<div class="${classString} max-w-md"> {/* 横幅調整 */}
  <div class="card-image-container"> {/* 画像コンテナ */}
    <img src="${imageUrl}" alt="${title}" class="card-image" />
  </div>
  <div class="card-body">
    <h3 class="card-title">${title}</h3>
    <p>${content}</p>
  </div>
</div>`

		return createHandlerResult(reactElement, htmlString)
	}, // horizontal が最後の要素なのでカンマを削除
}

// プレビュー用サンプル
export const samples = {
	default: '基本カード',
	image: '画像付きカード',
	simple: 'シンプルカード',
	horizontal: '横並びカード', // サンプル追加
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	variants,
	samples,
}
