// components/selectors/SizeSelector.jsx
// サイズ選択のUI - 直接ボタン形式に変更

import React from 'react'

/**
 * サイズを選択するセレクター
 *
 * @param {Object} props
 * @param {Array} props.sizes - 選択可能なサイズリスト
 * @param {string} props.selectedSize - 現在選択中のサイズ
 * @param {Function} props.onSelect - 選択時のコールバック
 */
const SizeSelector = ({ sizes = [], selectedSize, onSelect }) => {
	if (!sizes || sizes.length === 0) {
		return null
	}
	// デフォルトを削除し、medium を初期値として扱う
	const allOptions = [...sizes].filter((option) => option.value !== '')

	// 選択時のスクロールを防止する関数
	const handleSelect = (e, value) => {
		e.preventDefault() // デフォルト動作を防止
		onSelect(value) // 選択コールバック
	}

	return (
		<div>
			<h2 className='label-config label-size label-config'>size</h2>

			<div className='container-config container-config-size'>
				{allOptions.map((option) => (
					<div key={option.value} className='relative'>
						<button
							className={`btn-light btn-xs btn-square selector-button selector-size ${selectedSize === option.value ? 'active' : ''}`}
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

export default SizeSelector
