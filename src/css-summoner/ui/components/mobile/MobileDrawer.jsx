// components/mobile/MobileDrawer.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react'
import ComponentSelector from '@components/selectors/ComponentSelector'
import VariantSelector from '@components/selectors/VariantSelector'
import SizeSelector from '@components/selectors/SizeSelector'
import BorderRadiusSelector from '@components/selectors/BorderRadiusSelector'
import ModifierSelector from '@components/selectors/ModifierSelector'
import SpecialClassSelector from '@components/selectors/SpecialClassSelector'
import ColorSelector from '@components/selectors/ColorSelector'

/**
 * モバイル用ドロワーコンポーネント
 * スマホでの操作に特化したUIを提供し、コンポーネント選択と設定のためのドロワーを管理する
 */
const MobileDrawer = ({
	state,
	actions,
	componentTypes,
	componentVariants,
	classDescriptions,
	getSizeOptions,
	getBorderRadiusOptions,
	getModifierOptions,
	specialClasses,
	colorOptions,
	showTooltip,
	handleCustomColorChange,
	onOpenCssVarEditor,
}) => {
	// ドロワー状態の管理
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)
	/** @type {[('components' | 'settings' | null), React.Dispatch<React.SetStateAction<'components' | 'settings' | null>>]} */
	const [activeDrawer, setActiveDrawer] = useState(null)
	const [drawerMaxHeight, setDrawerMaxHeight] = useState('70vh') // 初期値はCSSと同じ
	/** @type {React.RefObject<HTMLDivElement>} */
	const drawerRef = useRef(null) // ドロワー要素への参照

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
				'[MobileDrawer] Calculated drawer max height:',
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
		<>
			{/* --- スマホビュー用ドロワー --- */}
			<div
				ref={drawerRef}
				className={`mobile-drawer ${isDrawerOpen ? 'open' : ''} lg:hidden`}
				// インラインスタイルで高さを設定(css指定がandroidで動作しないため)
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
									// コンポーネント選択後、設定ドロワーに切り替える
									openDrawer('settings')
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
						className='drawer-trigger-button btn-base btn-link theme-neutral'
						onClick={() => openDrawer('components')}
					>
						Components
					</button>
					<button
						className='drawer-trigger-button btn-base btn-link theme-neutral'
						onClick={() => openDrawer('settings')}
					>
						Settings
					</button>
					{/* --- スマホビュー用 CSS変数エディタ トグル --- */}
					<button
						onClick={onOpenCssVarEditor}
						className='css-var-editor-toggle-mobile btn-base btn-link theme-neutral'
					>
						CSS Vars
					</button>
				</div>
			</div>
		</>
	)
}

export default MobileDrawer
