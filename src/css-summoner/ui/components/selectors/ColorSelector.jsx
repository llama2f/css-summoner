import React, { useState } from 'react'
import ColorPicker from '@components/color-picker/ColorPicker'
import { defaultCustomColor } from '@/css-summoner/configs/colors'

/**
 * カラーセレクターコンポーネント
 * コンポーネントに適用する色を選択するUI
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Array} props.colors - 選択可能な色オプションの配列
 * @param {string} props.selectedColor - 現在選択されている色のクラス名
 * @param {Function} props.onSelect - 色選択時のコールバック関数
 * @param {Function} props.onTooltip - ツールチップ表示のコールバック関数
 */
const ColorSelector = ({ colors, selectedColor, onSelect, onTooltip }) => {
	// カラーピッカーの表示状態
	const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
	// カスタムカラーの設定
	const [customColorSettings, setCustomColorSettings] =
		useState(defaultCustomColor)

	// カスタムカラーの変更を処理
	const handleCustomColorChange = (colorSettings) => {
		setCustomColorSettings(colorSettings)
	}

	// カスタムカラーボタンをクリックしたときの処理
	const handleCustomColorClick = (colorOption) => {
		if (colorOption.isCustom) {
			// カスタムカラーピッカーを表示
			setIsColorPickerOpen(true)
		}
		// 親コンポーネントに選択を通知
		onSelect(colorOption.value)
	}

	return (
		<div className='color-selector mb-6'>
			<h2 className='label-config label-colors flex items-center gap-x-1.5'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 512 512'
					className='h-4 w-4 fill-current'
				>
					{/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. */}
					<path d='M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3L344 320c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z' />
				</svg>
				Color
			</h2>

			{/* 色選択オプション */}
			<div className='color-selector-container'>
				{colors.map((color) => (
					<button
						key={color.value}
						className={`p-1  rounded flex items-center gap-2 ${
							selectedColor === color.value
								? 'border border-primary bg-primary-light/20'
								: ''
						}`}
						onClick={() => handleCustomColorClick(color)}
						onMouseEnter={(e) => onTooltip && onTooltip(e, color.description)}
						onMouseLeave={() => onTooltip && onTooltip(null)}
					>
						{color.value ? (
							<div
								className='w-4 h-4 rounded-full border border-neutral-200'
								style={{
									backgroundColor: color.isCustom
										? `var(--custom-color)`
										: `var(${color.cssVar || color.value.replace('color-', '--')})`,
									boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
								}}
							></div>
						) : (
							<div className='w-4 h-4 rounded-full border border-dashed border-neutral-400'></div>
						)}
						<span className='btn-base btn-ghost btn-xs label-color dark:text-neutral-light'>
							{color.label}
						</span>
					</button>
				))}
			</div>

			{/* カラーホイールセクション */}
			<div className='color-wheel-section '>
				<button
					className='color-wheel-btn btn-base btn-solid btn-sm theme-primary leading-tight'
					onClick={() => setIsColorPickerOpen(true)}
				>
					<span>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<circle cx='12' cy='12' r='10'></circle>
							<circle cx='12' cy='12' r='6'></circle>
							<circle cx='12' cy='12' r='2'></circle>
						</svg>
					</span>
					<span className='label-color'>Open Color Picker</span>
				</button>
			</div>

			{/* カラーピッカー */}
			{isColorPickerOpen && (
				<ColorPicker
					initialColor={customColorSettings.mainColor}
					onColorChange={handleCustomColorChange}
					isOpen={isColorPickerOpen}
					onClose={() => setIsColorPickerOpen(false)}
				/>
			)}
		</div>
	)
}

export default ColorSelector
