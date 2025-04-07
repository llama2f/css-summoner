// templates/handlers/auto/tooltip.jsx

import React from 'react'
import { createHandlerResult } from '../common'

// デコレーターの挙動を回避するための特殊コンポーネント
const SpecialContainer = ({ children, layoutClass = '' }) => {
	// data-skip-decoration属性をつけて、デコレーターに処理をスキップさせる合図にする
	return (
		<div
			data-skip-decoration='true'
			className={`preview-container p-12 flex justify-center items-center ${layoutClass}`}
		>
			{children}
		</div>
	)
}

// メタデータ（必須）
export const metadata = {
	type: 'tooltip',
	category: 'overlay', // カテゴリを適切に設定
	description: '要素にホバーした際に補足情報を表示するコンポーネント',
}

// 基本レンダラー（必須） - デモ表示 (tooltipDemoHandler ベース)
export function render(props) {
	const {
		classString = 'tooltip-base', // デフォルトクラス
		selectedModifiers = [],
	} = props

	// モディファイアによる条件分岐
	const isBottom = selectedModifiers.includes('tooltip-bottom')
	const isLeft = selectedModifiers.includes('tooltip-left')
	const isRight = selectedModifiers.includes('tooltip-right')
	const isWide = selectedModifiers.includes('tooltip-wide')
	// isNoArrow, isScale は表示テキストやレイアウトに直接影響しないため、ここでは判定不要

	// ツールチップのサンプルテキスト
	let tooltipText = 'これはツールチップです'
	if (isBottom) tooltipText = '下に表示されるツールチップ'
	if (isLeft) tooltipText = '左に表示されるツールチップ'
	if (isRight) tooltipText = '右に表示されるツールチップ'
	if (isWide)
		tooltipText =
			'これは長いテキストを含むツールチップです。複数行にわたる内容を表示する場合に使用します。'

	// 通常要素とツールチップ常時表示要素のクラス
	const hoverClassString = classString // 基本クラスをそのまま使用
	const alwaysClassString = `${classString} tooltip-always`

	// 位置に応じたレイアウト
	let containerLayout = 'flex-col space-y-16' // デフォルトと上表示
	if (isBottom) containerLayout = 'flex-col-reverse space-y-reverse space-y-16'
	if (isLeft) containerLayout = 'flex-row space-x-32'
	if (isRight) containerLayout = 'flex-row-reverse space-x-32 space-x-reverse'

	// HTML文字列の生成
	const htmlString = `<!-- ホバーで表示するツールチップ -->
<span class="${hoverClassString}" data-tooltip="${tooltipText}">
  ホバーしてください
</span>

<!-- 常時表示のツールチップ例（デモ用） -->
<span class="${alwaysClassString}" data-tooltip="${tooltipText}">
  表示例
</span>`

	// SpecialContainerを使ってデコレーション回避
	const reactElement = (
		<SpecialContainer layoutClass={containerLayout}>
			<div className='flex flex-col items-center'>
				<span className={hoverClassString} data-tooltip={tooltipText}>
					ホバーしてください
				</span>
				<p className='text-xs text-gray-500 mt-2'>↑ ホバーすると表示</p>
			</div>

			<div className='flex flex-col items-center'>
				<span className={alwaysClassString} data-tooltip={tooltipText}>
					表示例
				</span>
				<p className='text-xs text-gray-500 mt-2'>↑ 表示されたツールチップ</p>
			</div>
		</SpecialContainer>
	)

	// skipDecoration フラグを渡す
	return createHandlerResult(reactElement, htmlString, { skipDecoration: true })
}

// バリアント特化処理
export const variants = {
	// ホバー表示 (tooltipHandler ベース)
	hover: (props) => {
		const {
			classString = 'tooltip-base', // デフォルトクラス
			selectedModifiers = [],
		} = props

		// モディファイアによる条件分岐
		const isBottom = selectedModifiers.includes('tooltip-bottom')
		const isLeft = selectedModifiers.includes('tooltip-left')
		const isRight = selectedModifiers.includes('tooltip-right')
		const isWide = selectedModifiers.includes('tooltip-wide')
		const isAlways = selectedModifiers.includes('tooltip-always') // ホバーバリアントでも常時表示を考慮

		// ツールチップのサンプルテキスト
		let tooltipText = 'これはツールチップです'
		if (isBottom) tooltipText = '下に表示されるツールチップ'
		if (isLeft) tooltipText = '左に表示されるツールチップ'
		if (isRight) tooltipText = '右に表示されるツールチップ'
		if (isWide)
			tooltipText =
				'これは長いテキストを含むツールチップです。複数行にわたる内容を表示する場合に使用します。'

		// 表示テキスト
		const displayText = isAlways ? 'ツールチップ常時表示' : 'ホバーしてください'

		// HTML文字列の生成
		const htmlString = `<span class="${classString}" data-tooltip="${tooltipText}">
  ${displayText}
</span>`

		// SpecialContainerを使ってデコレーション回避
		const reactElement = (
			<SpecialContainer>
				<span className={classString} data-tooltip={tooltipText}>
					{displayText}
				</span>
			</SpecialContainer>
		)

		// skipDecoration フラグを渡す
		return createHandlerResult(reactElement, htmlString, {
			skipDecoration: true,
		})
	},
}

// プレビュー用サンプル
export const samples = {
	default: 'デモ表示',
	hover: 'ホバー表示',
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	variants,
	samples,
}
