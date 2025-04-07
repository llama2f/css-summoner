// handlers/buttonHandlers.jsx
// ボタン関連コンポーネントのハンドラー

import React from 'react'
import { sampleIcon, createHandlerResult } from './common'

// ボタンハンドラー
export const buttonHandler = (options) => {
	const { classString = '', selectedModifiers = [] } = options

	const hasIconLeft = selectedModifiers.includes('btn-icon-left')
	const hasIconRight = selectedModifiers.includes('btn-icon-right')
	const hasIconOnly = selectedModifiers.includes('btn-icon-only')

	let reactElement

	if (hasIconOnly) {
		// アイコンのみのボタン
		reactElement = (
			<button className={classString}>
				<span dangerouslySetInnerHTML={{ __html: sampleIcon }} />
				<span className="sr-only">ボタンテキスト</span>
			</button>
		)
	} else if (hasIconLeft) {
		// 左にアイコンがあるボタン
		reactElement = (
			<button className={classString}>
				<span dangerouslySetInnerHTML={{ __html: sampleIcon }} />
				<span> ボタンテキスト</span>
			</button>
		)
	} else if (hasIconRight) {
		// 右にアイコンがあるボタン
		reactElement = (
			<button className={classString}>
				<span>ボタンテキスト </span>
				<span dangerouslySetInnerHTML={{ __html: sampleIcon }} />
			</button>
		)
	} else {
		// 標準ボタン
		reactElement = <button className={classString}>ボタンテキスト</button>
	}

	// html文字列は自動生成されるようになったので、
	// 第二引数を省略することでReactDOMServerを使用したHTML生成を利用
	return createHandlerResult(reactElement)
}

// ボタングループハンドラー
export const buttonGroupHandler = (options) => {
	const { classString = '' } = options

	const reactElement = (
		<div className={classString}>
			<button className='btn-base btn-primary'>ボタン1</button>
			<button className='btn-base btn-primary'>ボタン2</button>
			<button className='btn-base btn-primary'>ボタン3</button>
		</div>
	)

	// HTML文字列は自動生成されるようになったので、第二引数を省略
	return createHandlerResult(reactElement)
}

// エクスポートするハンドラーマップ
export const buttonHandlers = {
	button: buttonHandler,
	'button-group': buttonGroupHandler,
}
