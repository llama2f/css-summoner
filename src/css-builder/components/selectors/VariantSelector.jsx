// components/selectors/VariantSelector.jsx
// バリアント選択のUI - ラジオボタン/ラベルを直接ボタンに変更

import React from 'react'

/**
 * コンポーネントバリアントを選択するセレクター
 *
 * @param {Object} props
 * @param {Array} props.variants - 選択可能なバリアントリスト
 * @param {string} props.selectedVariant - 現在選択中のバリアント
 * @param {Function} props.onSelect - 選択時のコールバック
 * @param {Function} props.onTooltip - ツールチップ表示コールバック
 * @param {Object} props.classDescriptions - クラスの説明
 */
const VariantSelector = ({
	variants = [],
	selectedVariant,
	onSelect,
	onTooltip,
	classDescriptions = {},
}) => {
	if (!variants || variants.length === 0) {
		return null
	}

	// 選択時のスクロールを防止する関数
	const handleSelect = (e, value) => {
		e.preventDefault() // デフォルト動作を防止
		onSelect(value) // 選択コールバック
	}

	return (
		<div>
			<h2 className='label-config label-variant label-config'>variant</h2>
			<div className='container-config container-config-variants'>
				{variants.map((variant) => (
					<div key={variant.value}>
						<button
							className={`btn-ghost-neutral btn-xs btn-square selector-button selector-variant ${selectedVariant === variant.value ? 'active' : ''}`}
							onMouseEnter={(e) =>
								onTooltip(e, classDescriptions[variant.value])
							}
							onMouseLeave={() => onTooltip(null, '')}
							onClick={(e) => handleSelect(e, variant.value)}
						>
							{variant.label}
						</button>
					</div>
				))}
			</div>
		</div>
	)
}

export default VariantSelector
