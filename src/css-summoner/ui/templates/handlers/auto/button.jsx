// templates/handlers/auto/button.jsx
// プレビュー、コード表示を行います
// baseクラス付与をスキップする場合はvariantでreturn {skipDecoration: true}を渡してください

import React from 'react'
import { sampleIcon, createHandlerResult, separateProps } from '../common'

// メタデータ（必須）- 自動登録の鍵
export const metadata = {
	type: 'button', // コンポーネントタイプ（必須）
	category: 'interactive', // カテゴリ（任意）
	description: 'インタラクティブなボタンコンポーネント', // 説明（任意）
}

// 基本レンダラー（必須）
export function render(props) {
	// プロパティ分離
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'children', 'selectedModifiers', 'baseClass', 'onClick'], // Reactプロパティ
		['disabled', 'type'] // DOM要素プロパティ
	)

	// Reactプロパティから必要な値を取得
	const {
		classString = '',
		children = 'ボタンテキスト',
		selectedModifiers = [],
		onClick = null,
	} = reactProps

	// DOMプロパティから必要な値を取得
	const { disabled = false, type = 'button' } = domProps

	// モディファイア処理ロジック
	const hasIconLeft = selectedModifiers.includes('btn-icon-left')
	const hasIconRight = selectedModifiers.includes('btn-icon-right')
	const hasIconOnly = selectedModifiers.includes('btn-icon-only')

	let reactElement

	// アイコン処理
	if (hasIconOnly) {
		reactElement = (
			<button
				className={classString}
				disabled={disabled}
				type={type}
				onClick={onClick}
				dangerouslySetInnerHTML={{ __html: sampleIcon }}
				{...commonProps}
			/>
		)
	} else if (hasIconLeft) {
		reactElement = (
			<button
				className={classString}
				disabled={disabled}
				type={type}
				onClick={onClick}
				dangerouslySetInnerHTML={{ __html: `${sampleIcon} ボタンテキスト` }}
				{...commonProps}
			/>
		)
	} else if (hasIconRight) {
		reactElement = (
			<button
				className={classString}
				disabled={disabled}
				type={type}
				onClick={onClick}
				dangerouslySetInnerHTML={{ __html: `ボタンテキスト ${sampleIcon}` }}
				{...commonProps}
			/>
		)
	} else {
		reactElement = (
			<button
				className={classString}
				disabled={disabled}
				type={type}
				onClick={onClick}
				{...commonProps}
			>
				{children}
			</button>
		)
	}

	// HTML文字列は自動生成されるようにする
	return createHandlerResult(reactElement)
}

export function renderIconButton(props) {
	// プロパティ分離
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		['classString', 'icon', 'title', 'onClick'], // Reactプロパティ
		['disabled', 'type'] // DOM要素プロパティ
	)
	// 各種値を取得
	const {
		classString = '',
		icon = '⚙️',
		title = '',
		onClick = null,
	} = reactProps
	const { disabled = false, type = 'button' } = domProps

	const reactElement = (
		<button
			className={classString}
			title={title}
			disabled={disabled}
			type={type}
			onClick={onClick}
			{...commonProps}
		>
			{icon}
		</button>
	)

	return createHandlerResult(reactElement)
}

export const variants = {
	// バリアント固有のレンダラー（オプション）

	'btn-icon': (props) => renderIconButton(props),
	'btn-icon-ghost': (props) => renderIconButton(props),
	'btn-icon-outline': (props) => renderIconButton(props),

	'btn-group': (props) => {
		// プロパティ分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			['classString', 'children', 'title', 'baseClass', 'onClick'], // Reactプロパティ
			['disabled', 'type'] // DOM要素プロパティ
		)

		// 各種値を取得
		const {
			classString = '',
			children = 'buttons',
			title = '',
			onClick = null,
		} = reactProps
		const { disabled = false, type = 'button' } = domProps

		const reactElement = (
			<div className={classString} data-skip-decoration='true'>
				<button
					className='btn-base btn-solid btn-sm color-primary'
					title={title}
					disabled={disabled}
					type={type}
					onClick={onClick}
					{...commonProps}
				>
					{children}
				</button>
				<button
					className='btn-base btn-solid btn-sm color-primary'
					title={title}
					disabled={disabled}
					type={type}
					onClick={onClick}
					{...commonProps}
				>
					{children}
				</button>
				<button
					className='btn-base btn-solid btn-sm color-primary'
					title={title}
					disabled={disabled}
					type={type}
					onClick={onClick}
					{...commonProps}
				>
					{children}
				</button>
			</div>
		)

		return {
			...createHandlerResult(reactElement),
			skipDecoration: true,
		}
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
