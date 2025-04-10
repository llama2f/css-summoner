// src/css-summoner/ClassBuilder.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
// import './styles.css' // スタイルシートをインポート

// 独自フック
import useClassBuilder from '@hooks/useClassBuilder'

// コンポーネントのインポート
import ComponentSelector from '@components/selectors/ComponentSelector'
import VariantSelector from '@components/selectors/VariantSelector'
import SizeSelector from '@components/selectors/SizeSelector'
import BorderRadiusSelector from '@components/selectors/BorderRadiusSelector'
import ModifierSelector from '@components/selectors/ModifierSelector'
import SpecialClassSelector from '@components/selectors/SpecialClassSelector'
import ColorSelector from '@components/selectors/ColorSelector' // カラーセレクター
import ClassPreview from '@components/preview/ClassPreview'
import ClassCodeDisplay from '@components/display/ClassCodeDisplay'
import Tooltip from '@components/common/Tooltip'
import CssVarEditor from '@components/common/CssVarEditor'

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

	// ツールチップの表示状態
	const [tooltipText, setTooltipText] = useState('')
	const [tooltipVisible, setTooltipVisible] = useState(false)
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

	// CSS変数エディタの表示状態
	const [showCssVarEditor, setShowCssVarEditor] = useState(false)

	// スマホビュー用ドロワーの状態
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)
	/** @type {[('components' | 'settings' | null), React.Dispatch<React.SetStateAction<'components' | 'settings' | null>>]} */
	const [activeDrawer, setActiveDrawer] = useState(null)
	const [drawerMaxHeight, setDrawerMaxHeight] = useState('70vh') // 初期値はCSSと同じ
	/** @type {React.RefObject<HTMLDivElement>} */
	const drawerRef = useRef(null) // ドロワー要素への参照

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.componentType, actions.setSize]) // actions.setSize も依存配列に追加

	// ドロワーを開く関数
	/** @param {'components' | 'settings'} drawerType */
	const openDrawer = useCallback((drawerType) => {
		setActiveDrawer(drawerType)
		setIsDrawerOpen(true)
	}, [])

	// ドロワーを閉じる関数
	const closeDrawer = useCallback(() => {
		setIsDrawerOpen(false)
		// アニメーション完了後にアクティブなドロワーをリセットする方がスムーズな場合がある
		// setTimeout(() => setActiveDrawer(null), 300); // 例: 300msのアニメーション時間
		setActiveDrawer(null) // 一旦即時リセット
	}, [])

	// ドロワー外クリックで閉じる処理
	useEffect(() => {
		/** @param {MouseEvent} event */
		const handleClickOutside = (event) => {
			if (
				drawerRef.current &&
				!drawerRef.current.contains(/** @type {Node} */ (event.target))
			) {
				// トリガーボタン自体をクリックした場合は閉じないようにする (別途制御)
				const targetElement = /** @type {Element} */ (event.target)
				if (!targetElement.closest('.drawer-trigger-button')) {
					closeDrawer()
				}
			}
		}

		if (isDrawerOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isDrawerOpen, closeDrawer])

	// ウィンドウリサイズ時に高さを再計算
	useEffect(() => {
		const calculateHeight = () => {
			// window.innerHeight を使うことで、アドレスバーなどを考慮した実際の表示領域の高さを取得
			const calculatedHeight = window.innerHeight * 0.7
			setDrawerMaxHeight(`${calculatedHeight}px`)
			console.log(
				'[ClassBuilder] Calculated drawer max height:',
				calculatedHeight,
				'px'
			) // ログ追加
		}

		calculateHeight() // 初期計算
		window.addEventListener('resize', calculateHeight) // リサイズ時にも再計算
		window.addEventListener('orientationchange', calculateHeight) // 画面回転時にも再計算

		return () => {
			window.removeEventListener('resize', calculateHeight)
			window.removeEventListener('orientationchange', calculateHeight)
		}
	}, [])

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
				{/* 中央: 設定パネル (lg以上で表示) */}
				<div className='panel panel-settings hidden lg:block'>
					{/* --- 設定項目 --- */}
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

					{/* --- CSS変数エディタ トグルボタンは削除され、別の場所に移動しました --- */}

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
			{showCssVarEditor && (
				<CssVarEditor onClose={() => setShowCssVarEditor(false)} />
			)}

			{/* --- スマホビュー用ドロワー --- */}
			<div
				ref={drawerRef}
				className={`mobile-drawer ${isDrawerOpen ? 'open' : ''} lg:hidden`}
				// ★インラインスタイルで高さを設定(css指定がandroidで動作しないため)
				style={{ maxHeight: drawerMaxHeight }}
			>
				<div className='mobile-drawer-content'>
					<button
						onClick={closeDrawer}
						className='mobile-drawer-close-button'
						aria-label='閉じる'
					>
						&times; {/* シンプルな閉じるアイコン */}
					</button>
					{/* ドロワーの内容を動的に表示 */}
					{activeDrawer === 'components' && (
						<div className='panel panel-components'>
							{/* コンポーネント選択 */}
							<ComponentSelector
								componentTypes={componentTypes}
								selectedComponent={state.componentType}
								onSelect={(type) => {
									actions.setComponentType(type)
									// コンポーネント選択後、設定ドロワーに切り替えるか、閉じるか検討
									// closeDrawer(); // 例: 選択したら閉じる
									openDrawer('settings') // 例: 設定に進む
								}}
							/>
						</div>
					)}
					{activeDrawer === 'settings' && (
						<div className='panel panel-settings'>
							{/* --- 設定項目 (ドロワー内) --- */}
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
						</div>
					)}
				</div>
			</div>

			{/* --- スマホビュー用トリガーボタン --- */}
			<div className='mobile-drawer-triggers lg:hidden'>
				<p className='text-xs text-neutral-200/90'>
					↓からコンポーネント選択と設定を行います
				</p>
				<div className='mobile-drawer-buttons-container'>
					<button
						className='drawer-trigger-button btn-base btn-link theme-light'
						onClick={() => openDrawer('components')}
					>
						Components
					</button>
					<button
						className='drawer-trigger-button btn-base btn-link theme-light'
						onClick={() => openDrawer('settings')}
					>
						Settings
					</button>
					{/* --- スマホビュー用 CSS変数エディタ トグル --- */}
					<button
						onClick={() => setShowCssVarEditor((prev) => !prev)}
						className='css-var-editor-toggle-mobile btn-base btn-link theme-light'
					>
						CSS Vars
					</button>
				</div>
			</div>
			{/* --- PCビュー用 CSS変数エディタ トグル --- */}
			<div className='css-var-editor-toggle-desktop-container hidden lg:block'>
				<button
					onClick={() => setShowCssVarEditor((prev) => !prev)}
					className='css-var-editor-toggle-desktop btn-base btn-primary btn-sm flex items-center gap-1' /* flex, items-center, gap-1 を追加 */
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 512 512'
						className='w-4 h-4 fill-current' /* サイズを w-4 h-4 に変更 */
					>
						{/* !Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. */}
						<path d='M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7L336 192c-8.8 0-16-7.2-16-16l0-57.4c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z' />
					</svg>
					<span className='text-xs font-medium'>CSS Vars</span>{' '}
					{/* テキスト追加 */}
				</button>
			</div>
			{/* --- スマホビュー用ここまで --- */}
		</div>
	)
}

// 最適化されたClassBuilderをエクスポート
export default ClassBuilder
