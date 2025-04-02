// components/selectors/ModifierSelector.jsx
// モディファイア選択のUI

import React from 'react'

/**
 * モディファイアを選択するセレクター
 *
 * @param {Object} props
 * @param {Array} props.modifiers - 選択可能なモディファイアリスト
 * @param {Array} props.selectedModifiers - 現在選択中のモディファイア
 * @param {Function} props.onToggle - 切り替え時のコールバック
 * @param {Function} props.onTooltip - ツールチップ表示コールバック
 */
const ModifierSelector = ({
	modifiers = [],
	selectedModifiers = [],
	onToggle,
	onTooltip,
}) => {
	if (!modifiers || modifiers.length === 0) {
		return null
	}

	return (
		<div>
			<h2 className='label-config'>modifier</h2>
			<div className='container-config container-config-modifiers'>
				{modifiers.map((modifier) => (
					<div key={modifier.value} className='flex items-center'>
						<input
							type='checkbox'
							id={`modifier-${modifier.value}`}
							checked={selectedModifiers.includes(modifier.value)}
							onChange={() => onToggle(modifier.value)}
							className='mr-2'
						/>
						<label
							htmlFor={`modifier-${modifier.value}`}
							className='selector-check'
							onMouseEnter={(e) => onTooltip(e, modifier.description)}
							onMouseLeave={() => onTooltip(null, '')}
						>
							{modifier.label}
						</label>
					</div>
				))}
			</div>
		</div>
	)
}

export default ModifierSelector
