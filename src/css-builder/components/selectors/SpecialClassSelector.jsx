// components/selectors/SpecialClassSelector.jsx
// 特殊クラス選択のUI

import React from 'react'

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
			<h2 className='label-config'>special</h2>
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

export default SpecialClassSelector
