// components/common/CssVarEditor.jsx
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

/**
 * CSS変数を編集するためのパネルコンポーネント
 * ブラウザ上でCSS変数をリアルタイムに変更できる
 */
const CssVarEditor = ({ onClose }) => {
	// CSS変数の状態管理
	const [colorVars, setColorVars] = useState({
		primary: '',
		'primary-light': '',
		'primary-dark': '',
		secondary: '',
		'secondary-light': '',
		'secondary-dark': '',
		accent: '',
		'accent-light': '',
		'accent-dark': '',
		neutral: '',
		'neutral-light': '',
		'neutral-dark': '',
	})

	const [isExpanded, setIsExpanded] = useState(true)
	const [contrastColors, setContrastColors] = useState({
		text: null,
		background: null,
	})

	// 初期値を取得
	useEffect(() => {
		const root = document.documentElement
		const computedStyle = getComputedStyle(root)

		const initialVars = {}
		Object.keys(colorVars).forEach((varName) => {
			initialVars[varName] = computedStyle
				.getPropertyValue(`--${varName}`)
				.trim()
		})

		setColorVars(initialVars)

		// デフォルトのコントラスト計算用の色を設定
		setContrastColors({
			text: initialVars['neutral-dark'],
			background: initialVars['neutral-light'],
		})
	}, [])

	// 色変更ハンドラ
	const handleColorChange = (varName, value) => {
		// 状態を更新
		setColorVars((prev) => ({
			...prev,
			[varName]: value,
		}))

		// CSS変数を更新
		document.documentElement.style.setProperty(`--${varName}`, value)

		// RGB値も更新（必要に応じて）
		if (!varName.includes('-light') && !varName.includes('-dark')) {
			updateRgbValue(varName, value)
		}

		// コントラスト計算に使用している色が変更された場合、その色も更新
		if (contrastColors.text === colorVars[varName]) {
			setContrastColors((prev) => ({ ...prev, text: value }))
		}
		if (contrastColors.background === colorVars[varName]) {
			setContrastColors((prev) => ({ ...prev, background: value }))
		}
	}

	// RGB値を更新
	const updateRgbValue = (varName, hexColor) => {
		// Hex to RGB 変換
		const r = parseInt(hexColor.slice(1, 3), 16)
		const g = parseInt(hexColor.slice(3, 5), 16)
		const b = parseInt(hexColor.slice(5, 7), 16)

		if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
			document.documentElement.style.setProperty(
				`--${varName}-rgb`,
				`${r}, ${g}, ${b}`
			)
		}
	}

	// リセット処理
	const handleReset = () => {
		// 初期値に戻す処理（ここでは簡易的にページリロード）
		window.location.reload()
	}

	// 変更値の保存
	const handleSave = () => {
		// 現在の設定をコピー
		const cssVarText = Object.entries(colorVars)
			.map(([name, value]) => `--${name}: ${value};`)
			.join('\n')

		// クリップボードにコピー
		navigator.clipboard
			.writeText(cssVarText)
			.then(() => {
				alert('CSS変数がクリップボードにコピーされました！')
			})
			.catch((err) => {
				console.error('クリップボードへのコピーに失敗しました:', err)
				alert('コピーに失敗しました。')
			})
	}

	// 色名を日本語で表示するための変換
	const getColorLabel = (varName) => {
		const labels = {
			primary: 'プライマリ',
			'primary-light': 'プライマリ（明）',
			'primary-dark': 'プライマリ（暗）',
			secondary: 'セカンダリ',
			'secondary-light': 'セカンダリ（明）',
			'secondary-dark': 'セカンダリ（暗）',
			accent: 'アクセント',
			'accent-light': 'アクセント（明）',
			'accent-dark': 'アクセント（暗）',
			neutral: 'ニュートラル',
			'neutral-light': 'ニュートラル（明）',
			'neutral-dark': 'ニュートラル（暗）',
		}

		return labels[varName] || varName
	}

	// 色の明るさの判定（コントラスト計算用）
	const getLuminance = (hexColor) => {
		const rgb = hexToRgb(hexColor)
		if (!rgb) return 0

		// sRGB色空間からリニア色空間への変換
		const rgbNormalized = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((v) => {
			return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
		})

		// 相対輝度の計算（WCAG 2.0の定義に基づく）
		return (
			0.2126 * rgbNormalized[0] +
			0.7152 * rgbNormalized[1] +
			0.0722 * rgbNormalized[2]
		)
	}

	// コントラスト比の計算
	const calculateContrast = (color1, color2) => {
		if (!color1 || !color2) return null

		// 16進数カラーコードをRGB値に変換
		const rgb1 = hexToRgb(color1)
		const rgb2 = hexToRgb(color2)

		if (!rgb1 || !rgb2) return null

		// 相対輝度を計算
		const luminance1 = calculateLuminance(rgb1)
		const luminance2 = calculateLuminance(rgb2)

		// 明るい色を分子に、暗い色を分母に配置する
		const lighter = Math.max(luminance1, luminance2)
		const darker = Math.min(luminance1, luminance2)

		// コントラスト比を計算
		return (lighter + 0.05) / (darker + 0.05)
	}

	// 16進数カラーコードをRGB値に変換
	const hexToRgb = (hex) => {
		if (!hex || typeof hex !== 'string') return null

		// #を削除
		hex = hex.replace(/^#/, '')

		// 短い形式（#rgb）を通常の形式（#rrggbb）に変換
		if (hex.length === 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
		}

		const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
				}
			: null
	}

	// 相対輝度の計算
	const calculateLuminance = ({ r, g, b }) => {
		// sRGB色空間からリニア色空間への変換
		const rgb = [r, g, b].map((v) => {
			v /= 255
			return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
		})

		// 相対輝度の計算（WCAG 2.0の定義に基づく）
		return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
	}

	// コントラスト比の評価
	const getContrastRating = (ratio) => {
		if (ratio >= 7) return { text: 'AAA', className: 'text-green-600' }
		if (ratio >= 4.5) return { text: 'AA', className: 'text-green-500' }
		if (ratio >= 3) return { text: 'AA大', className: 'text-yellow-500' } // 大きなテキスト用のAA基準
		return { text: '不合格', className: 'text-red-500' }
	}

	// テキスト色を選択する
	const selectTextColor = (color) => {
		setContrastColors((prev) => ({
			...prev,
			text: color,
		}))
	}

	// 背景色を選択する
	const selectBgColor = (color) => {
		setContrastColors((prev) => ({
			...prev,
			background: color,
		}))
	}

	// コントラスト比情報の表示
	const renderContrastInfo = () => {
		const { text, background } = contrastColors
		if (!text || !background) return null

		const contrastRatio = calculateContrast(text, background)

		if (contrastRatio === null) return null

		const rating = getContrastRating(contrastRatio)
		const formattedRatio = contrastRatio.toFixed(2)

		// サンプルテキストの準備（輝度に基づいて異なるサイズのテキストを生成）
		const isLightBackground = getLuminance(background) > 0.5

		return (
			<div className='p-4 my-4 rounded' style={{ backgroundColor: background }}>
				<div className='flex justify-between mb-3'>
					<div className='text-sm font-bold' style={{ color: text }}>
						コントラスト比: {formattedRatio}:1
					</div>
					<div
						className={`text-sm font-bold ${rating.className}`}
						style={{ color: text }}
					>
						{rating.text}
					</div>
				</div>

				<div style={{ color: text }}>
					<p className='text-sm mb-2'>通常テキスト（14px）サンプル</p>
					<p className='text-lg mb-2'>大きいテキスト（18px）サンプル</p>
					<p className='text-xl font-bold'>見出しテキスト（太字）サンプル</p>
				</div>

				<div className='mt-3 text-xs' style={{ color: text }}>
					<div className='flex justify-between'>
						<span>通常テキスト (AA): 4.5:1以上</span>
						<span>{contrastRatio >= 4.5 ? '✓' : '✗'}</span>
					</div>
					<div className='flex justify-between'>
						<span>大きいテキスト (AA): 3:1以上</span>
						<span>{contrastRatio >= 3 ? '✓' : '✗'}</span>
					</div>
					<div className='flex justify-between'>
						<span>最高水準 (AAA): 7:1以上</span>
						<span>{contrastRatio >= 7 ? '✓' : '✗'}</span>
					</div>
				</div>
			</div>
		)
	}

	// カラーボタンレンダリング
	const renderColorButton = (color, name, onClick, isSelected = false) => {
		return (
			<button
				type='button'
				className={`w-10 h-10 rounded border-2 relative ${isSelected ? 'border-black dark:border-white' : 'border-transparent'}`}
				style={{ backgroundColor: color }}
				onClick={() => onClick(color)}
				title={getColorLabel(name)}
			>
				{isSelected && (
					<span className='absolute inset-0 flex items-center justify-center'>
						<svg
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='3'
							strokeLinecap='round'
							strokeLinejoin='round'
							style={{ color: getLuminance(color) > 0.5 ? '#000' : '#fff' }}
						>
							<polyline points='20 6 9 17 4 12'></polyline>
						</svg>
					</span>
				)}
			</button>
		)
	}

	return (
		<div className='fixed bottom-20 right-4 z-50 bg-neutral-100 shadow-lg rounded-lg overflow-hidden max-w-md  md:w-auto'>
			<div className='p-3 bg-neutral-dark text-neutral-light flex justify-between items-center gap-2'>
				<h3 className='text-sm'>CSS変数エディタ</h3>
				<div className='flex gap-2'>
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className='text-sm bg-white/10 hover:bg-white/30 px-2 py-1 rounded'
					>
						{isExpanded ? 'minimize-' : 'open+'}
					</button>
					<button
						onClick={onClose}
						className='text-sm bg-white/10 hover:bg-white/30 px-2 py-1 rounded'
					>
						close☓
					</button>
				</div>
			</div>

			{isExpanded && (
				<div className='p-4 max-h-[70vh] overflow-y-auto'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{Object.entries(colorVars).map(([varName, value]) => (
							<div key={varName} className='flex flex-col'>
								<label className='text-xs mb-1 text-neutral-dark'>
									{getColorLabel(varName)}
								</label>
								<div className='flex gap-2 items-center'>
									<input
										type='color'
										value={value}
										onChange={(e) => handleColorChange(varName, e.target.value)}
										className='w-8 h-8 p-0 border rounded bg-transparent'
									/>
									<input
										type='text'
										value={value}
										onChange={(e) => handleColorChange(varName, e.target.value)}
										className='flex-1 p-1 text-xs border rounded'
									/>
								</div>
							</div>
						))}
					</div>

					{/* コントラスト比計算セクション */}
					<div className='mt-6 border-t pt-4'>
						<h4 className='text-sm font-medium mb-3  text-neutral-dark'>
							カラーコントラスト計算
						</h4>

						<div className='mb-4'>
							<div className='text-xs font-medium mb-2  text-neutral-dark'>
								テキスト色
							</div>
							<div className='flex flex-wrap gap-2'>
								{renderColorButton(
									colorVars['neutral-dark'],
									'neutral-dark',
									selectTextColor,
									contrastColors.text === colorVars['neutral-dark']
								)}
								{renderColorButton(
									colorVars['primary-dark'],
									'primary-dark',
									selectTextColor,
									contrastColors.text === colorVars['primary-dark']
								)}
								{renderColorButton(
									colorVars['secondary-dark'],
									'secondary-dark',
									selectTextColor,
									contrastColors.text === colorVars['secondary-dark']
								)}
								{renderColorButton(
									colorVars['accent-dark'],
									'accent-dark',
									selectTextColor,
									contrastColors.text === colorVars['accent-dark']
								)}
								{renderColorButton(
									colorVars['neutral-light'],
									'neutral-light',
									selectTextColor,
									contrastColors.text === colorVars['neutral-light']
								)}
								{renderColorButton(
									colorVars.primary,
									'primary',
									selectTextColor,
									contrastColors.text === colorVars.primary
								)}
								{renderColorButton(
									colorVars.secondary,
									'secondary',
									selectTextColor,
									contrastColors.text === colorVars.secondary
								)}
								{renderColorButton(
									colorVars.accent,
									'accent',
									selectTextColor,
									contrastColors.text === colorVars.accent
								)}
							</div>
						</div>

						<div className='mb-4'>
							<div className='text-xs font-medium mb-2 text-neutral-dark'>
								背景色
							</div>
							<div className='flex flex-wrap gap-2'>
								{renderColorButton(
									colorVars['neutral-light'],
									'neutral-light',
									selectBgColor,
									contrastColors.background === colorVars['neutral-light']
								)}
								{renderColorButton(
									colorVars['primary-light'],
									'primary-light',
									selectBgColor,
									contrastColors.background === colorVars['primary-light']
								)}
								{renderColorButton(
									colorVars['secondary-light'],
									'secondary-light',
									selectBgColor,
									contrastColors.background === colorVars['secondary-light']
								)}
								{renderColorButton(
									colorVars['accent-light'],
									'accent-light',
									selectBgColor,
									contrastColors.background === colorVars['accent-light']
								)}
								{renderColorButton(
									colorVars['neutral-dark'],
									'neutral-dark',
									selectBgColor,
									contrastColors.background === colorVars['neutral-dark']
								)}
								{renderColorButton(
									colorVars.primary,
									'primary',
									selectBgColor,
									contrastColors.background === colorVars.primary
								)}
								{renderColorButton(
									colorVars.secondary,
									'secondary',
									selectBgColor,
									contrastColors.background === colorVars.secondary
								)}
								{renderColorButton(
									colorVars.accent,
									'accent',
									selectBgColor,
									contrastColors.background === colorVars.accent
								)}
							</div>
						</div>

						{/* コントラスト結果表示 */}
						{renderContrastInfo()}
					</div>

					<div className='mt-4 flex justify-end gap-2'>
						<button
							onClick={handleReset}
							className='px-3 py-1 bg-neutral-200 text-neutral-800 rounded hover:bg-neutral-300'
						>
							リセット
						</button>
						<button
							onClick={handleSave}
							className='px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark'
						>
							コピー
						</button>
					</div>
				</div>
			)}

			{!isExpanded && (
				<div className='p-3 flex flex-wrap gap-2'>
					{Object.entries(colorVars)
						.filter(
							([name]) => !name.includes('-light') && !name.includes('-dark')
						)
						.map(([varName, value]) => (
							<div
								key={varName}
								className='w-6 h-6 rounded border cursor-pointer tooltip-container'
								style={{ backgroundColor: value }}
								onClick={() => setIsExpanded(true)}
							>
								<span className='tooltip-text'>{getColorLabel(varName)}</span>
							</div>
						))}
				</div>
			)}

			<style>{`
				.tooltip-container {
					position: relative;
				}
				.tooltip-text {
					visibility: hidden;
					position: absolute;
					bottom: 125%;
					left: 50%;
					transform: translateX(-50%);
					background-color: #333;
					color: white;
					text-align: center;
					padding: 4px 8px;
					border-radius: 4px;
					font-size: 12px;
					white-space: nowrap;
					z-index: 1;
				}
				.tooltip-container:hover .tooltip-text {
					visibility: visible;
				}
			`}</style>
		</div>
	)
}

CssVarEditor.propTypes = {
	onClose: PropTypes.func,
}

CssVarEditor.defaultProps = {
	onClose: () => {},
}

export default CssVarEditor
