// templates/handlers/auto/badge.jsx

import React from 'react'
import {
	createHandlerResult,
	sampleIcon,
	combineClasses,
	separateProps,
} from '../common' // separateProps をインポート

// メタデータ（必須）
export const metadata = {
	type: 'badge',
	category: 'data display',
	description: '状態や属性を示す小さなラベルコンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	// プロパティ分離
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'children', 'selectedModifiers', 'baseClass'], // Reactプロパティ
		[] // DOM要素プロパティ (badge特有のものは少ない)
	)

	// Reactプロパティから必要な値を取得
	const {
		classString = '',
		children = 'バッジ',
		selectedModifiers = [],
		baseClass = 'badge-base',
	} = reactProps

	// baseClassとclassStringを結合
	const finalClassString = combineClasses({
		baseClass,
		additional: classString,
	})

	const isIconOnly = selectedModifiers.includes('badge-icon-only')
	const hasIconLeft = selectedModifiers.includes('badge-icon-left')
	const hasIconRight = selectedModifiers.includes('badge-icon-right')

	// React要素の組み立て
	let reactChildren = []
	if (hasIconLeft || isIconOnly) {
		reactChildren.push(
			<span
				key='icon-left'
				className='badge-icon'
				dangerouslySetInnerHTML={{ __html: sampleIcon }}
			/>
		)
	}

	if (!isIconOnly) {
		reactChildren.push(<span key='text'>{children}</span>)
	} else {
		reactChildren.push(
			<span key='text-sr' className='sr-only'>
				{children}
			</span>
		)
	}

	if (hasIconRight) {
		reactChildren.push(
			<span
				key='icon-right'
				className='badge-icon'
				dangerouslySetInnerHTML={{ __html: sampleIcon }}
			/>
		)
	}

	const reactElement = (
		<span className={finalClassString} {...commonProps}>
			{' '}
			{/* commonProps を展開 */}
			{reactChildren}
		</span>
	)

	// HTML文字列はcreateHandlerResultが自動生成
	return createHandlerResult(reactElement)
}

// プレビュー用サンプル
export const samples = {
	default: '基本バッジ',
	iconLeft: '左アイコン',
	iconRight: '右アイコン',
	iconOnly: 'アイコンのみ', // スクリーンリーダー用テキスト
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	samples,
}
