// templates/handlers/auto/infobox.jsx

import React from 'react'
import { createHandlerResult, sampleIcon, combineClasses } from '../common'

// メタデータ（必須）
export const metadata = {
	type: 'infobox',
	category: 'feedback',
	description: '情報や注意喚起を表示するボックスコンポーネント',
}

// 基本レンダラー（必須）
export function render(props) {
	const {
		classString = '',
		children = 'インフォメーションメッセージのサンプルです。重要な情報や注意事項を表示するために使用します。',
		baseClass = 'infobox-base',
		title = 'インフォボックスタイトル',
		selectedModifiers = [],
		...rest
	} = props

	// baseClassとclassStringを結合
	const finalClassString = combineClasses({
		baseClass,
		additional: classString,
	})

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
			className={finalClassString}
			role='alert'
			{...rest}
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
	render
}
