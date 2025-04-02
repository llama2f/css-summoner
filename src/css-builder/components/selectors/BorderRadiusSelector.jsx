// components/selectors/BorderRadiusSelector.jsx
// 角丸選択のUI - 直接ボタン形式に変更

import React from 'react'

/**
 * 角丸を選択するセレクター
 *
 * @param {Object} props
 * @param {Array} props.options - 選択可能な角丸オプションリスト
 * @param {string} props.selectedRadius - 現在選択中の角丸
 * @param {Function} props.onSelect - 選択時のコールバック
 */
const BorderRadiusSelector = ({ options = [], selectedRadius, onSelect }) => {
	if (!options || options.length === 0) {
		return null
	}

	// デフォルトオプションを追加
	const allOptions = [{ value: '', label: 'デフォルト' }, ...options]

	// 選択時のスクロールを防止する関数
	const handleSelect = (e, value) => {
		e.preventDefault() // デフォルト動作を防止
		onSelect(value) // 選択コールバック
	}

	// 角丸の視覚的表現を取得する関数
	const getRadiusVisual = (value) => {
		if (value.includes('full')) return 'rounded-full'
		if (value.includes('lg')) return 'rounded-lg'
		if (value.includes('md')) return 'rounded-md'
		if (value.includes('sm')) return 'rounded-sm'
		if (value.includes('none')) return 'rounded-none'
		return 'rounded'
	}

	return (
		<div>
			<h2 className='label-config label-radius label-config'>radius</h2>

			<div className='container-config container-config-radius'>
				{allOptions.map((option) => (
					<div key={option.value} className='relative'>
						<button
							className={`btn-light btn-xs btn-square selector-button selector-radius ${option.value ? getRadiusVisual(option.value) : 'rounded'} ${selectedRadius === option.value ? 'active' : ''}`}
							onClick={(e) => handleSelect(e, option.value)}
						>
							{option.label}
						</button>
					</div>
				))}
			</div>
		</div>
	)
}

export default BorderRadiusSelector
