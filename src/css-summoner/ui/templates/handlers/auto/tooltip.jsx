// templates/handlers/auto/tooltip.jsx

import React from 'react'
import { createHandlerResult, combineClasses } from '../common'

// メタデータ（必須）
export const metadata = {
	type: 'tooltip',
	category: 'overlay',
	description: '要素にホバーした際に補足情報を表示するコンポーネント',
}

// デコレーターの挙動を回避するための特殊コンポーネント
const SpecialContainer = ({ children, layoutClass = '' }) => {
	// data-skip-decoration属性をつけて、デコレーターに処理をスキップさせる合図にする
	return (
		<div
			data-skip-decoration='true'
			className={`preview-container ${layoutClass}`}
		>
			{children}
		</div>
	)
}

// 基本レンダラー（必須）
export function render(props) {
	const {
		classString = '',
		selectedModifiers = [],
		baseClass = 'tooltip-base',
		...rest
	} = props

	// ClassBuilderから渡されたクラス文字列をそのまま使用
	const finalClassString = classString

	// モディファイアによる条件分岐
	const isBottom = selectedModifiers.includes('tooltip-bottom')
	const isLeft = selectedModifiers.includes('tooltip-left')
	const isRight = selectedModifiers.includes('tooltip-right')
	const isWide = selectedModifiers.includes('tooltip-wide')

	// ツールチップのサンプルテキスト
	let tooltipText = 'これはツールチップです'
	if (isBottom) tooltipText = '下に表示されるツールチップ'
	if (isLeft) tooltipText = '左に表示されるツールチップ'
	if (isRight) tooltipText = '右に表示されるツールチップ'
	if (isWide)
		tooltipText =
			'これは長いテキストを含むツールチップです。複数行にわたる内容を表示する場合に使用します。'

	// 位置に応じたコンテナクラス
	let containerClass = 'tooltip-container-top flex flex-row gap-4 mt-12 text-sm'
	if (isBottom) containerClass = 'tooltip-container-bottom'
	if (isLeft) containerClass = 'tooltip-container-left'
	if (isRight) containerClass = 'tooltip-container-right'

	// 常時表示用のクラス結合
	const alwaysClassString = combineClasses({
		baseClass,
		additional: `${classString} tooltip-always`,
	})

	// SpecialContainerを使ってデコレーション回避
	const reactElement = (
		<SpecialContainer layoutClass={containerClass}>
			<div className='tooltip-demo-container flex flex-col items-center justify-center'>
				<span
					className={`font-bold ${finalClassString}`}
					data-tooltip={tooltipText}
					{...rest}
				>
					ホバーしてください
				</span>
				<p className='tooltip-help-text text-xs'>↑ ホバーすると表示</p>
			</div>

			<div className='tooltip-demo-container flex flex-col items-center justify-center '>
				<span
					className={`font-bold ${alwaysClassString}`}
					data-tooltip={tooltipText}
					{...rest}
				>
					表示例
				</span>
				<p className='tooltip-help-text text-xs'>↑ 表示されたツールチップ</p>
			</div>
		</SpecialContainer>
	)

	// skipDecoration フラグを渡す
	return {
		...createHandlerResult(reactElement),
		skipDecoration: true,
	}
}

// バリアント特化処理
export const variants = {
	// ホバー表示
	hover: (props) => {
		const {
			classString = '',
			selectedModifiers = [],
			baseClass = 'tooltip-base',
			...rest
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		// モディファイアによる条件分岐
		const isBottom = selectedModifiers.includes('tooltip-bottom')
		const isLeft = selectedModifiers.includes('tooltip-left')
		const isRight = selectedModifiers.includes('tooltip-right')
		const isWide = selectedModifiers.includes('tooltip-wide')
		const isAlways = selectedModifiers.includes('tooltip-always')

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

		// SpecialContainerを使ってデコレーション回避
		const reactElement = (
			<SpecialContainer>
				<span className={finalClassString} data-tooltip={tooltipText} {...rest}>
					{displayText}
				</span>
			</SpecialContainer>
		)

		// skipDecoration フラグを渡す
		return {
			...createHandlerResult(reactElement),
			skipDecoration: true,
		}
	},
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	variants,
}
