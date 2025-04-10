// src/css-summoner/ClassBuilder.jsx
import React, { useState, useEffect, useCallback } from 'react'

// 独自フック
import useClassBuilder from '@hooks/useClassBuilder'
import useComponentOptions from '@hooks/component/useComponentOptions'

// コンポーネントのインポート
import ComponentSelector from '@components/selectors/ComponentSelector'
import VariantSelector from '@components/selectors/VariantSelector'
import SizeSelector from '@components/selectors/SizeSelector'
import BorderRadiusSelector from '@components/selectors/BorderRadiusSelector'
import ModifierSelector from '@components/selectors/ModifierSelector'
import SpecialClassSelector from '@components/selectors/SpecialClassSelector'
import ColorSelector from '@components/selectors/ColorSelector'
import ClassPreview from '@components/preview/ClassPreview'
import ClassCodeDisplay from '@components/display/ClassCodeDisplay'
import MobileDrawer from '@components/mobile/MobileDrawer'
import CssVarEditorManager from '@components/common/CssVarEditorManager'

// 設定のインポート
// autoClassMappings.js の代わりに classMappings.js からインポート
import {
	componentTypes,
	baseClasses,
	componentVariants,
	classDescriptions,
} from '@/css-summoner/classMappings.js'

import {
	sizes,
	borderRadiusOptions,
	modifiers,
	specialClasses,
	colorOptions, // カラーオプション
} from '@/css-summoner/configs'

/**
 * カスタムクラスビルダーのメインコンポーネント
 * プロジェクトのスタイルシートで定義されたカスタムクラスを
 * 視覚的にプレビューしながら組み合わせられる
 */
const ClassBuilder = () => {
	// カスタムフックを使用して状態管理
	const { state, actions } = useClassBuilder()

	// コンポーネントオプションを計算するカスタムフック
	const { getSizeOptions, getBorderRadiusOptions, getModifierOptions } =
		useComponentOptions(state, sizes, borderRadiusOptions, modifiers)

	// ツールチップの表示状態
	const [tooltipText, setTooltipText] = useState('')
	const [tooltipVisible, setTooltipVisible] = useState(false)
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

	// CSS変数エディタマネージャー
	const {
		showCssVarEditor,
		toggleCssVarEditor,
		closeCssVarEditor,
		DesktopTrigger: CssVarEditorDesktopTrigger,
		EditorComponent: CssVarEditorComponent,
	} = CssVarEditorManager()

	// ツールチップを表示する（メモ化）
	const showTooltip = useCallback(
		(e, text) => {
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
		},
		[setTooltipText, setTooltipVisible, setTooltipPosition]
	) // 依存する状態更新関数をメモ化

	// カスタム色変更のハンドラー
	const handleCustomColorChange = useCallback(
		(colorSettings) => {
			actions.setCustomColorSettings(colorSettings)
			// カスタムカラーが選択されていない場合は自動的に選択
			if (state.selectedColor !== 'theme-custom') {
				actions.setColor('theme-custom')
			}
		},
		[actions, state.selectedColor]
	)

	// コンポーネントタイプが変更されたときにデフォルトサイズを設定するuseEffect
	useEffect(() => {
		if (state.componentType) {
			const sizeOptions = getSizeOptions() // useEffect内で呼び出す
			if (sizeOptions.length > 0) {
				// 'sm'または'small'のサイズオプションを探す
				const smallOption = sizeOptions.find(
					(option) => option.value === 'sm' || option.value === 'btn-sm'
				)
				// 見つかった場合はそれを、なければ最初のオプションを設定
				const sizeToSet = smallOption ? smallOption.value : sizeOptions[0].value
				// 現在のサイズと比較し、異なる場合のみ更新
				if (state.size !== sizeToSet) {
					actions.setSize(sizeToSet)
				}
			} else {
				// サイズオプションがない場合はnullを設定（現在のサイズがnullでない場合のみ更新）
				if (state.size !== null) {
					actions.setSize(null)
				}
			}
		}
		// state.componentType が変更されたとき、または state.size が変更されたときに実行
		// actions と getSizeOptions は通常メモ化されているため依存配列に含めるが、
		// これらが不安定な場合は useClassBuilder や useComponentOptions の実装を見直す必要がある
	}, [state.componentType, state.size, actions, getSizeOptions])

	return (
		<div className='max-w-7xl mx-auto'>
			<div className='grid grid-cols-1 lg:grid-cols-10 gap-4'>
				{/* 左側: コンポーネント選択パネル (lg以上で表示) */}
				<div className='panel panel-components hidden lg:block'>
					{/* コンポーネント選択 */}
					<ComponentSelector
						componentTypes={componentTypes}
						selectedComponent={state.componentType}
						onSelect={actions.setComponentType}
					/>
				</div>

				{/* 中央: 設定パネル */}
				<div className='panel panel-settings hidden lg:block'>
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
					{/* カラー選択 */}
					<ColorSelector
						colors={colorOptions}
						selectedColor={state.selectedColor}
						onSelect={actions.setColor}
						onTooltip={showTooltip}
						onCustomColorChange={handleCustomColorChange}
					/>
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
					{/* --- 設定項目ここまで --- */}
				</div>

				{/* 右側: プレビューと生成コード */}
				<div className='panel-preview'>
					<div className='flex flex-wrap items-center justify-between gap-4 pb-2 border-b'>
						{/* 背景色設定 */}
						<div className='flex items-center gap-2'>
							<span className='text-sm font-medium'>background:</span>
							<div className='flex gap-4'>
								<button
									onClick={() => actions.setPreviewBg('bg-neutral-400/30')}
									className={`w-8 h-8 rounded-full border border-dashed ${state.previewBg === 'bg-neutral-400/30' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
									aria-label='半透過'
									title='半透過'
								></button>
								<button
									onClick={() => actions.setPreviewBg('bg-white')}
									className={`w-8 h-8 rounded-full border ${state.previewBg === 'bg-white' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
									style={{ backgroundColor: 'white' }}
									aria-label='白背景'
									title='白背景'
								></button>
								<button
									onClick={() => actions.setPreviewBg('bg-neutral-200')}
									className={`w-8 h-8 rounded-full border ${state.previewBg === 'bg-neutral-200' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
									style={{ backgroundColor: '#e5e5e5' }}
									aria-label='グレー背景'
									title='グレー背景'
								></button>
								<button
									onClick={() => actions.setPreviewBg('bg-neutral-800')}
									className={`w-8 h-8 rounded-full border ${state.previewBg === 'bg-neutral-800' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
									style={{ backgroundColor: '#262626' }}
									aria-label='黒背景'
									title='黒背景'
								></button>
								<button
									onClick={() => actions.setPreviewBg('bg-primary-light')}
									className={`w-8 h-8 rounded-full border ${state.previewBg === 'bg-primary-light' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
									style={{ backgroundColor: 'var(--primary-light)' }}
									aria-label='プライマリライト背景'
									title='プライマリライト背景'
								></button>
								<button
									onClick={() => actions.setPreviewBg('bg-secondary-light')}
									className={`w-8 h-8 rounded-full border ${state.previewBg === 'bg-secondary-light' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
									style={{ backgroundColor: 'var(--secondary-light)' }}
									aria-label='セカンダリライト背景'
									title='セカンダリライト背景'
								></button>
							</div>
						</div>
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
						selectedColor={state.selectedColor} // 色クラスの受け渡し
					/>

					{/* 追加クラス入力 */}
					<div className='mt-2 mb-2'>
						<h2 className='label-config label-custom'>追加クラス</h2>
						<div className=' flex items-center gap-2'>
							<input
								type='text'
								value={state.additionalClasses}
								onChange={(e) => actions.setAdditionalClasses(e.target.value)}
								placeholder='カスタムクラスを入力'
								className='code-aria w-full'
							/>
						</div>
						<p className='text-xs text-neutral-500 dark:text-neutral-300 mt-1'>
							例: 'w-full mb-4 dark:bg-neutral-800'
						</p>
					</div>

					{/* 生成されたコード表示 */}
					<ClassCodeDisplay
						classString={state.generatedClassString}
						componentType={state.componentType}
						componentVariant={state.componentVariant}
						selectedModifiers={state.selectedModifiers}
						selectedColor={state.selectedColor}
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
			<CssVarEditorComponent />
			<CssVarEditorDesktopTrigger />

			{/* モバイルドロワー */}
			<MobileDrawer
				state={state}
				actions={actions}
				componentTypes={componentTypes}
				componentVariants={componentVariants}
				classDescriptions={classDescriptions}
				getSizeOptions={getSizeOptions}
				getBorderRadiusOptions={getBorderRadiusOptions}
				getModifierOptions={getModifierOptions}
				specialClasses={specialClasses}
				colorOptions={colorOptions}
				showTooltip={showTooltip}
				handleCustomColorChange={handleCustomColorChange}
				onOpenCssVarEditor={toggleCssVarEditor}
			/>
		</div>
	)
}

// 最適化されたClassBuilderをエクスポート
export default ClassBuilder
