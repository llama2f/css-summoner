// templates/handlers/auto/infobox.jsx

import React from 'react'
import {
	createHandlerResult,
	sampleIcon,
	separateProps,
	combineClasses,
} from '../common'

// メタデータ（必須）
export const metadata = {
	type: 'infobox',
	category: 'feedback',
	description: '情報や注意喚起を表示するボックスコンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	// プロパティ分離
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'children', 'selectedModifiers', 'baseClass', 'title'], // Reactプロパティ
		['role'] // DOM要素プロパティ
	)

	// Reactプロパティから必要な値を取得
	const {
		classString = '',
		children = 'インフォメーションメッセージのサンプルです。重要な情報や注意事項を表示するために使用します。',
		title = 'インフォボックスタイトル',
		selectedModifiers = [],
		baseClass = 'infobox-base', // baseClassを取得
	} = reactProps

	// DOMプロパティから必要な値を取得
	const { role = 'alert' } = domProps

	// アイコンとタイトルの条件付きレンダリング
	const hasIcon = selectedModifiers.includes('infobox-with-icon')
	const hasTitle = selectedModifiers.includes('infobox-with-title')

	const iconReact = hasIcon ? (
		<div
			className='infobox-icon'
			dangerouslySetInnerHTML={{ __html: sampleIcon }}
		/>
	) : null

	const titleReact = hasTitle ? (
		<div className='infobox-title'>{title}</div>
	) : null

	// React要素の生成
	const reactElement = (
		<div
			className={combineClasses({ baseClass, additional: classString })}
			role={role}
			{...commonProps}
		>
			{iconReact}
			<div className='infobox-content'>
				{titleReact}
				<p>{children}</p>
			</div>
		</div>
	)

	return createHandlerResult(reactElement)
}

// デフォルトエクスポート
export default {
	metadata,
	render,
}
