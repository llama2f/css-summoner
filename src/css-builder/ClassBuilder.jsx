// src/css-builder/ClassBuilder.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'
// import './styles.css' // スタイルシートをインポート

// 独自フック
import useClassBuilder from '@/css-builder/hooks/useClassBuilder'

// コンポーネントのインポート
import ComponentSelector from '@/css-builder/components/selectors/ComponentSelector'
import VariantSelector from '@/css-builder/components/selectors/VariantSelector'
import SizeSelector from '@/css-builder/components/selectors/SizeSelector'
import BorderRadiusSelector from '@/css-builder/components/selectors/BorderRadiusSelector'
import ModifierSelector from '@/css-builder/components/selectors/ModifierSelector'
import SpecialClassSelector from '@/css-builder/components/selectors/SpecialClassSelector'
import ClassPreview from '@/css-builder/components/preview/ClassPreview'
import ClassCodeDisplay from '@/css-builder/components/display/ClassCodeDisplay'
import Tooltip from '@/css-builder/components/common/Tooltip'
import CssVarEditor from '@/css-builder/components/common/CssVarEditor'

// 設定のインポート
import {
	componentTypes,
	baseClasses,
	componentVariants,
	classDescriptions,
} from '@/css-builder/autoClassMappings'

import {
	sizes,
	borderRadiusOptions,
	modifiers,
	specialClasses,
} from '@/css-builder/configs'

/**
 * カスタムクラスビルダーのメインコンポーネント
 * プロジェクトのスタイルシートで定義されたカスタムクラスを
 * 視覚的にプレビューしながら組み合わせられる
 */
const ClassBuilder = () => {
	

	

	// カスタムフックを使用して状態管理
	const { state, actions } = useClassBuilder()
	 

	// ツールチップの表示状態
	const [tooltipText, setTooltipText] = useState('')
	const [tooltipVisible, setTooltipVisible] = useState(false)
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

	// CSS変数エディタの表示状態
	const [showCssVarEditor, setShowCssVarEditor] = useState(true)

	// ツールチップを表示する（メモ化）
	const showTooltip = useCallback((e, text) => {
		if (!e || !text) {
			setTooltipVisible(false)
			return
		}

		setTooltipText(text)
		setTooltipVisible(true)

		// ポジションの計算（オフセットを追加してカーソルの近くに表示）
		const x = e.clientX + 10
		const y = e.clientY + 10
		setTooltipPosition({ x, y })
	}, [setTooltipText, setTooltipVisible, setTooltipPosition]) // 依存する状態更新関数をメモ化

	// コンポーネントタイプのベース名を抽出する関数
	const getBaseComponentType = useCallback((type) => {
		// 'heading'で始まるがハイフンが含まれる場合（例: heading-casual）
		if (type.startsWith('heading') && type.includes('-')) {
			return 'heading'
		}

		const parts = type.split('-')
		return parts[0] // 最初の部分を返す
	}, []) // 依存配列が空なので再作成されない

	// サイズオプションのメモ化
	const sizeOptionsValue = useMemo(() => {
		// コンポーネントタイプのベース名を取得
		const baseType = getBaseComponentType(state.componentType)

		// そのコンポーネントタイプに特化したサイズがある場合はそれを返す
		if (sizes[baseType]) {
			return sizes[baseType]
		}

		// コンポーネント特化のサイズがない場合は共通サイズを返す
		return sizes.common || []
	}, [state.componentType, getBaseComponentType]) // componentTypeが変更された時のみ再計算

	// 元の関数インターフェイスを維持
	const getSizeOptions = () => sizeOptionsValue

	// 角丸オプションのメモ化
	const borderRadiusOptionsValue = useMemo(() => {
		// コンポーネントタイプのベース名を取得
		const baseType = getBaseComponentType(state.componentType)

		// そのコンポーネントタイプに特化した角丸がある場合はそれを返す
		if (borderRadiusOptions[baseType]) {
			return borderRadiusOptions[baseType]
		}

		// コンポーネント特化の角丸がない場合は共通角丸を返す
		return borderRadiusOptions.common || []
	}, [state.componentType, getBaseComponentType]) // componentTypeが変更された時のみ再計算

	// 元の関数インターフェイスを維持
	const getBorderRadiusOptions = () => borderRadiusOptionsValue

	// コンポーネント固有のモディファイアを取得

	// モディファイアオプションのメモ化
	const modifierOptionsValue = useMemo(() => {
		// ベースコンポーネントタイプを取得
		const baseType = getBaseComponentType(state.componentType)

		// ベースタイプに対応するモディファイアを取得
		const componentModifiers = modifiers[baseType] || []

		// 共通モディファイアと結合して返す
		return [...(modifiers.common || []), ...componentModifiers]
	}, [state.componentType, getBaseComponentType]) // componentTypeが変更された時のみ再計算

	// 元の関数インターフェイスを維持
	const getModifierOptions = () => modifierOptionsValue

	// 常にログ確認
	/* useEffect(() => {
		console.log('Current component type:', state.componentType)
		console.log(
			'Base component type:',
			getBaseComponentType(state.componentType)
		)
		console.log('Available modifiers:', getModifierOptions())
	}, [state.componentType]) */

	// コンポーネントタイプが変更されたときにサイズを設定するuseEffect
	useEffect(() => {
		if (state.componentType) {
			const sizeOptions = getSizeOptions()
			if (sizeOptions.length > 0) {
				// 'sm'または'small'のサイズオプションを探す
				const smallOption = sizeOptions.find(
					(option) => option.value === 'sm' || option.value === 'btn-sm'
				)
				// 見つかった場合はそれを、なければ最初のオプションを設定
				const sizeToSet = smallOption ? smallOption.value : sizeOptions[0].value
				actions.setSize(sizeToSet)
			}
		}
	}, [state.componentType])

	return (
		<div className='max-w-7xl mx-auto'>
			<div className='grid grid-cols-1 lg:grid-cols-10 gap-4'>
				{/* 左側: コンポーネント選択パネル */}
				<div className='panel panel-components'>
					{/* コンポーネント選択 */}
					<ComponentSelector
						componentTypes={componentTypes}
						selectedComponent={state.componentType}
						onSelect={actions.setComponentType}
					/>
				</div>

				{/* 中央: 設定パネル */}
				<div className='panel panel-settings'>
					{/* バリアント選択 */}
					{componentVariants[state.componentType] &&
						componentVariants[state.componentType].length > 0 && (
							<VariantSelector
								variants={componentVariants[state.componentType]}
								selectedVariant={state.componentVariant}
								onSelect={actions.setComponentVariant}
								onTooltip={showTooltip}
								classDescriptions={classDescriptions}
							/>
						)}

					{/* サイズ選択 */}
					{getSizeOptions().length > 0 && (
						<SizeSelector
							sizes={getSizeOptions()}
							selectedSize={state.size}
							onSelect={actions.setSize}
						/>
					)}

					{/* 角丸選択 */}
					{getBorderRadiusOptions().length > 0 && (
						<BorderRadiusSelector
							options={getBorderRadiusOptions()}
							selectedRadius={state.borderRadius}
							onSelect={actions.setBorderRadius}
						/>
					)}

					{/* モディファイア選択 */}
					{getModifierOptions().length > 0 && (
						<ModifierSelector
							modifiers={getModifierOptions()}
							selectedModifiers={state.selectedModifiers}
							onToggle={actions.toggleModifier}
							onTooltip={showTooltip}
						/>
					)}

					{/* 特殊効果クラス選択 */}
					<SpecialClassSelector
						specialClasses={specialClasses}
						selectedSpecialClasses={state.selectedSpecialClasses}
						onToggle={actions.toggleSpecialClass}
						onTooltip={showTooltip}
					/>
				</div>

				{/* 右側: プレビューと生成コード */}
				<div className='panel-preview'>
					{/* 上部コントロール: 背景色設定とテーマ切り替え */}
					<div className='flex flex-wrap items-center justify-between gap-4 pb-2 border-b'>
						{/* 背景色設定 */}
						<div className='flex items-center gap-2'>
							<span className='text-sm font-medium'>背景:</span>
							<div className='flex gap-1'>
								<button
									onClick={() => actions.setPreviewBg('bg-transparent')}
									className={`w-5 h-5 rounded-full border border-dashed ${state.previewBg === 'bg-transparent' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
									aria-label='透過背景'
									title='透過背景'
								></button>
								<button
									onClick={() => actions.setPreviewBg('bg-white')}
									className={`w-5 h-5 rounded-full border ${state.previewBg === 'bg-white' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
									style={{ backgroundColor: 'white' }}
									aria-label='白背景'
									title='白背景'
								></button>
								<button
									onClick={() => actions.setPreviewBg('bg-neutral-200')}
									className={`w-5 h-5 rounded-full border ${state.previewBg === 'bg-neutral-200' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
									style={{ backgroundColor: '#e5e5e5' }}
									aria-label='グレー背景'
									title='グレー背景'
								></button>
								<button
									onClick={() => actions.setPreviewBg('bg-neutral-800')}
									className={`w-5 h-5 rounded-full border ${state.previewBg === 'bg-neutral-800' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
									style={{ backgroundColor: '#262626' }}
									aria-label='黒背景'
									title='黒背景'
								></button>
								<button
									onClick={() => actions.setPreviewBg('bg-primary-light')}
									className={`w-5 h-5 rounded-full border ${state.previewBg === 'bg-primary-light' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
									style={{ backgroundColor: 'var(--primary-light)' }}
									aria-label='プライマリライト背景'
									title='プライマリライト背景'
								></button>
								<button
									onClick={() => actions.setPreviewBg('bg-secondary-light')}
									className={`w-5 h-5 rounded-full border ${state.previewBg === 'bg-secondary-light' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
									style={{ backgroundColor: 'var(--secondary-light)' }}
									aria-label='セカンダリライト背景'
									title='セカンダリライト背景'
								></button>
							</div>
						</div>
						
					</div>

					{/* CSS変数エディタボタン */}
					<div className='flex justify-end mb-2'>
						<button
							onClick={() => setShowCssVarEditor(prev => !prev)}
							className='button-css-edit btn-primary btn-xs btn-animate-down'
						>
							{showCssVarEditor
								? 'CSS変数エディタを閉じる'
								: 'CSS変数エディタを開く'}
						</button>
					</div>

					{/* プレビュー */}
					<ClassPreview
						componentType={state.componentType}
						componentVariant={state.componentVariant}
						borderRadius={state.borderRadius}
						selectedModifiers={state.selectedModifiers}
						selectedSpecialClasses={state.selectedSpecialClasses}
						additionalClasses={state.additionalClasses}
						size={state.size}
						previewBg={state.previewBg}
						baseClass={baseClasses[state.componentType] || ''}
					/>

					{/* 追加クラス入力 */}
					<div className='mt-2 mb-2'>
						<h2 className='label-config label-custom text-lg font-medium mb-3'>
							追加クラス
						</h2>
						<input
							type='text'
							value={state.additionalClasses}
							onChange={(e) => actions.setAdditionalClasses(e.target.value)}
							placeholder='カスタムクラスを入力'
							className='w-full p-2 border rounded'
						/>
						<p className='text-xs text-neutral-500 mt-1'>
							例: 'w-full mb-4 dark:bg-neutral-800'
						</p>
					</div>

					{/* 生成されたコード表示 */}
					<ClassCodeDisplay
						classString={state.generatedClassString}
						componentType={state.componentType}
						selectedModifiers={state.selectedModifiers}
					/>
				</div>
			</div>

			{/* ツールチップ */}
			{tooltipVisible && tooltipText && (
				<div
					className='fixed bg-neutral-800 text-white p-2 rounded text-xs z-50 max-w-xs'
					style={{
						left: `${tooltipPosition.x}px`,
						top: `${tooltipPosition.y}px`,
					}}
				>
					{tooltipText}
				</div>
			)}

			{/* CSS変数エディタ */}
			{showCssVarEditor && (
				<CssVarEditor onClose={() => setShowCssVarEditor(false)} />
			)}
		</div>
	)
}

// 最適化されたClassBuilderをエクスポート
export default ClassBuilder
