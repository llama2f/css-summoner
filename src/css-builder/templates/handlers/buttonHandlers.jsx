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
	let htmlString

	if (hasIconOnly) {
		reactElement = (
			<button
				className={classString}
				dangerouslySetInnerHTML={{ __html: sampleIcon }}
			/>
		)

		htmlString = `<button class="${classString}">
  ${sampleIcon}
  <span class="sr-only">ボタンテキスト</span>
</button>`
	} else if (hasIconLeft) {
		reactElement = (
			<button
				className={classString}
				dangerouslySetInnerHTML={{ __html: `${sampleIcon} ボタンテキスト` }}
			/>
		)

		htmlString = `<button class="${classString}">
  ${sampleIcon} ボタンテキスト
</button>`
	} else if (hasIconRight) {
		reactElement = (
			<button
				className={classString}
				dangerouslySetInnerHTML={{ __html: `ボタンテキスト ${sampleIcon}` }}
			/>
		)

		htmlString = `<button class="${classString}">
  ボタンテキスト ${sampleIcon}
</button>`
	} else {
		reactElement = <button className={classString}>ボタンテキスト</button>

		htmlString = `<button class="${classString}">
  ボタンテキスト
</button>`
	}

	return createHandlerResult(reactElement, htmlString)
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

	const htmlString = `<div class="${classString}">
  <button class="btn-base btn-primary">ボタン1</button>
  <button class="btn-base btn-primary">ボタン2</button>
  <button class="btn-base btn-primary">ボタン3</button>
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// エクスポートするハンドラーマップ
export const buttonHandlers = {
	button: buttonHandler,
	'button-group': buttonGroupHandler,
}
