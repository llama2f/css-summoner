// components/selectors/VariantSelector.jsx
// バリアント選択のUI - ラジオボタン/ラベルを直接ボタンに変更

import React, { useCallback } from 'react'

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

	// 選択時のスクロールを防止する関数（メモ化）
	const handleSelect = useCallback(
		(e, value) => {
			e.preventDefault() // デフォルト動作を防止
			onSelect(value) // 選択コールバック
		},
		[onSelect]
	) // onSelectが変更されたときのみ再作成

	return (
		<div>
			<h2 className='label-config label-variant label-config flex items-center gap-x-1.5'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 576 512'
					className='h-4 w-4 fill-current'
				>
					{/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. */}
					<path d='M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z' />
				</svg>
				variant
			</h2>
			<div className='container-config container-config-variants'>
				{variants.map((variant, index) => (
					<div key={`${variant.value}-${index}`}>
						<button
							className={`btn-ghost-neutral btn-xs btn-square selector-button selector-variant ${selectedVariant === variant.value ? 'active' : ''}`}
							onMouseEnter={
								(e) =>
									onTooltip(
										e,
										classDescriptions[variant.value]?.description || ''
									) // description プロパティを渡す
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

// メモ化されたコンポーネント - propsが変更されない限り再レンダリングしない
export default React.memo(VariantSelector)
