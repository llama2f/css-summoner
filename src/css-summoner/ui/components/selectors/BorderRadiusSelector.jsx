// components/selectors/BorderRadiusSelector.jsx
// 角丸選択のUI - 直接ボタン形式に変更

import React, { useCallback, useMemo } from 'react'

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

	// デフォルトオプションを追加（メモ化）
	const allOptions = useMemo(() => {
		return [{ value: '', label: 'デフォルト' }, ...options]
	}, [options]) // optionsが変更された時のみ再計算

	// 選択時のスクロールを防止する関数（メモ化）
	const handleSelect = useCallback((e, value) => {
		e.preventDefault() // デフォルト動作を防止
		onSelect(value) // 選択コールバック
	}, [onSelect]) // onSelectが変更されたときのみ再作成

	// 角丸の視覚的表現を取得する関数（メモ化）
	const getRadiusVisual = useCallback((value) => {
		if (value.includes('full')) return 'rounded-full'
		if (value.includes('lg')) return 'rounded-lg'
		if (value.includes('md')) return 'rounded-md'
		if (value.includes('sm')) return 'rounded-sm'
		if (value.includes('none')) return 'rounded-none'
		return 'rounded'
	}, []) // 依存配列が空なので再作成されない

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

// メモ化されたコンポーネント - propsが変更されない限り再レンダリングしない
export default React.memo(BorderRadiusSelector)
