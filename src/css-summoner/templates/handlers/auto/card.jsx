// templates/handlers/auto/card.jsx

import React from 'react'
import { createHandlerResult, combineClasses } from '../common'

// メタデータ（必須）
export const metadata = {
	type: 'card',
	category: 'container',
	description: 'コンテンツを論理的に分割するカードコンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	const {
		classString = '',
		title = 'カードタイトル',
		subtitle = 'サブタイトル',
		content = 'カードのコンテンツがここに入ります。テキストや画像など、様々なコンテンツを含めることができます。',
		actionLabel = 'アクション',
		baseClass = 'card-base',
		selectedModifiers, // 明示的に分離
		children, // 明示的に分離
		...domProps // DOM要素に渡す安全なプロパティのみ
	} = props

	// baseClassとclassStringを結合
	const finalClassString = combineClasses({
		baseClass,
		additional: classString,
	})

	// カードの基本構造
	const reactElement = (
		<div className={finalClassString} {...domProps}>
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

	// HTML文字列はcreateHandlerResultが自動生成
	return createHandlerResult(reactElement)
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
			baseClass = 'card-base',
			selectedModifiers, // 明示的に分離
			children, // 明示的に分離
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className={finalClassString} {...domProps}>
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

		return createHandlerResult(reactElement)
	},

	// シンプルなカード
	simple: (props) => {
		const {
			classString = '',
			title = 'シンプルカード',
			content = 'シンプルなカードコンテンツ',
			baseClass = 'card-base',
			selectedModifiers, // 明示的に分離
			children, // 明示的に分離
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className={finalClassString} {...domProps}>
				<div className='card-body'>
					<h3 className='card-title'>{title}</h3>
					<div className='card-content'>{content}</div>
				</div>
			</div>
		)

		return createHandlerResult(reactElement)
	},

	// 横並びカード
	horizontal: (props) => {
		const {
			classString = '',
			imageUrl = '/placeholder-image.jpg',
			title = '横並びカード',
			content = 'カードのコンテンツです。',
			baseClass = 'card-base',
			selectedModifiers, // 明示的に分離
			children, // 明示的に分離
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className={finalClassString} {...domProps}>
				<div className='card-image-container'>
					<img src={imageUrl} alt={title} className='card-image' />
				</div>
				<div className='card-body'>
					<h3 className='card-title'>{title}</h3>
					<p>{content}</p>
				</div>
			</div>
		)

		return createHandlerResult(reactElement)
	}
}

// プレビュー用サンプル
export const samples = {
	default: '基本カード',
	image: '画像付きカード',
	simple: 'シンプルカード',
	horizontal: '横並びカード'
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	variants,
	samples,
}
