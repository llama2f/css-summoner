// templates/handlers/auto/button.jsx
// プレビュー、html、コード表示

import React from 'react'
import { sampleIcon, createHandlerResult } from '../common'

// メタデータ（必須）- 自動登録の鍵
export const metadata = {
	type: 'button', // コンポーネントタイプ（必須）
	category: 'interactive', // カテゴリ（任意）
	description: 'インタラクティブなボタンコンポーネント', // 説明（任意）
}

// 基本レンダラー（必須）
export function render(props) {
	const {
		classString = '',
		children = 'ボタンテキスト',
		disabled = false,
		type = 'button',
		onClick = null,
		selectedModifiers = [], // これはDOMに渡さない
		...rest // 残りのプロパティを受け取る
	} = props

	// モディファイア処理ロジック
	const hasIconLeft = selectedModifiers.includes('btn-icon-left')
	const hasIconRight = selectedModifiers.includes('btn-icon-right')
	const hasIconOnly = selectedModifiers.includes('btn-icon-only')

	let reactElement
	let htmlString

	// アイコン処理
	if (hasIconOnly) {
		reactElement = (
			<button
				className={classString}
				disabled={disabled}
				type={type}
				onClick={onClick}
				dangerouslySetInnerHTML={{ __html: sampleIcon }}
				{...rest}
			/>
		)

		htmlString = `<button class="${classString}" ${disabled ? 'disabled' : ''} type="${type}">
      ${sampleIcon}
      <span class="sr-only">ボタンテキスト</span>
    </button>`
	} else if (hasIconLeft) {
		reactElement = (
			<button
				className={classString}
				disabled={disabled}
				type={type}
				onClick={onClick}
				dangerouslySetInnerHTML={{ __html: `${sampleIcon} ボタンテキスト` }}
				{...rest}
			/>
		)

		htmlString = `<button class="${classString}" ${disabled ? 'disabled' : ''} type="${type}">
      ${sampleIcon} ボタンテキスト
    </button>`
	} else if (hasIconRight) {
		reactElement = (
			<button
				className={classString}
				disabled={disabled}
				type={type}
				onClick={onClick}
				dangerouslySetInnerHTML={{ __html: `ボタンテキスト ${sampleIcon}` }}
				{...rest}
			/>
		)

		htmlString = `<button class="${classString}" ${disabled ? 'disabled' : ''} type="${type}">
      ボタンテキスト ${sampleIcon}
    </button>`
	} else {
		reactElement = (
			<button
				className={classString}
				disabled={disabled}
				type={type}
				onClick={onClick}
				{...rest}
			>
				{children}
			</button>
		)

		htmlString = `<button class="${classString}" ${disabled ? 'disabled' : ''} type="${type}">
      ${children}
    </button>`
	}

	return createHandlerResult(reactElement, htmlString)
}

// バリアント固有のレンダラー（オプション）
export const variants = {
	// 例: アイコンボタン
	icon: (props) => {
		const {
			classString = '',
			icon = '⚙️',
			title = '',
			disabled = false,
			type = 'button',
			onClick = null,
			selectedModifiers, // これを除外
			...rest
		} = props

		const reactElement = (
			<button
				className={classString}
				title={title}
				disabled={disabled}
				type={type}
				onClick={onClick}
				{...rest}
			>
				{icon}
			</button>
		)

		const htmlString = `<button class="${classString}" title="${title}" ${disabled ? 'disabled' : ''} type="${type}">
      ${icon}
    </button>`

		return createHandlerResult(reactElement, htmlString)
	},

	'btn-group': (props) => {
		const {
			classString = '',
			children = 'buttons',
			title = '',
			disabled = false,
			type = 'button',
			onClick = null,
			selectedModifiers,
			...rest
		} = props
		const reactElement = (
			<div className='btn-group'>
				<button
					className='btn-base btn-solid btn-sm color-primary'
					title={title}
					disabled={disabled}
					type={type}
					onClick={onClick}
					{...rest}
				>
					{children}
				</button>
				<button
					className='btn-base btn-solid btn-sm color-primary'
					title={title}
					disabled={disabled}
					type={type}
					onClick={onClick}
					{...rest}
				>
					{children}
				</button>
				<button
					className='btn-base btn-solid btn-sm color-primary'
					title={title}
					disabled={disabled}
					type={type}
					onClick={onClick}
					{...rest}
				>
					{children}
				</button>
			</div>
		)

		const htmlString = `<div class="btn-group">
  <button class="btn-base btn-solid btn-sm color-primary" title="${title}" ${disabled ? 'disabled' : ''} type="${type}>${children}</button>
  <button class="btn-base btn-solid btn-sm color-primary" title="${title}" ${disabled ? 'disabled' : ''} type="${type}>${children}</button>
  <button class="btn-base btn-solid btn-sm color-primary" title="${title}" ${disabled ? 'disabled' : ''} type="${type}>${children}</button>
</div>`

		return createHandlerResult(reactElement, htmlString)
	},
}

// プレビュー用サンプル（オプション）
export const samples = {
	default: 'ボタン',
	primary: 'プライマリボタン',
	icon: '⚙️',
}

// デフォルトエクスポート（すべての機能を含む）
export default {
	metadata,
	render,
	variants,
	samples,
}
