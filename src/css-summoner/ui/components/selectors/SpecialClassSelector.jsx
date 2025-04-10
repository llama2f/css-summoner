// components/selectors/SpecialClassSelector.jsx
// 特殊クラス選択のUI

import React, { useCallback } from 'react'

/**
 * 特殊クラスを選択するセレクター
 *
 * @param {Object} props
 * @param {Array} props.specialClasses - 選択可能な特殊クラスリスト
 * @param {Array} props.selectedSpecialClasses - 現在選択中の特殊クラス
 * @param {Function} props.onToggle - 切り替え時のコールバック
 * @param {Function} props.onTooltip - ツールチップ表示コールバック
 */
const SpecialClassSelector = ({
	specialClasses = [],
	selectedSpecialClasses = [],
	onToggle,
	onTooltip,
}) => {
	if (!specialClasses || specialClasses.length === 0) {
		return null
	}

	return (
		<div>
			<h2 className='label-config flex items-center gap-x-1.5'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 576 512'
					className='h-4 w-4 fill-current'
				>
					<path d='M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z' />
				</svg>
				special
			</h2>
			<div className='container-config container-config-special'>
				{specialClasses.map((specialClass) => (
					<div key={specialClass.value} className='flex items-center'>
						<input
							type='checkbox'
							id={`special-${specialClass.value}`}
							checked={selectedSpecialClasses.includes(specialClass.value)}
							onChange={() => onToggle(specialClass.value)}
							className='mr-2'
						/>
						<label
							htmlFor={`special-${specialClass.value}`}
							className='selector-check'
							onMouseEnter={(e) => onTooltip(e, specialClass.description)}
							onMouseLeave={() => onTooltip(null, '')}
						>
							{specialClass.label}
						</label>
					</div>
				))}
			</div>
		</div>
	)
}

// メモ化されたコンポーネント - propsが変更されない限り再レンダリングしない
export default React.memo(SpecialClassSelector)
