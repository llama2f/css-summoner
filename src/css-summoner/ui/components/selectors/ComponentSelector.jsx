// components/selectors/ComponentSelector.jsx
// コンポーネント選択のUIをアコーディオン方式に変更

import React, { useState, useMemo } from 'react'

/**
 * コンポーネントタイプを選択するセレクター（アコーディオン方式）
 *
 * @param {Object} props
 * @param {Array} props.componentTypes - 選択可能なコンポーネントタイプリスト
 * @param {string} props.selectedComponent - 現在選択中のコンポーネント
 * @param {Function} props.onSelect - 選択時のコールバック
 */
const ComponentSelector = ({ componentTypes, selectedComponent, onSelect }) => {
	// カテゴリの優先順位を定義（指定された順序に表示されます）
	const categoryOrder = {
		typography: 1,
		interactive: 2,
		notification: 3,
		'form-controls': 4,
		animation: 5,
	}

	// カテゴリをソートする関数
	const sortCategories = (a, b) => {
		const orderA = categoryOrder[a] || 999 // 優先順位がない場合は後方に
		const orderB = categoryOrder[b] || 999
		return orderA - orderB
	}

	// コンポーネントカテゴリごとのグループ化（メモ化）
	const groupedComponents = useMemo(() => {
		return componentTypes.reduce((acc, component) => {
			const category = component.category || 'その他'
			if (!acc[category]) acc[category] = []
			acc[category].push(component)
			return acc
		}, {})
	}, [componentTypes]) // componentTypesが変更された時のみ再計算

	// すべてのカテゴリを初期状態で開く
	const initialOpenState = useMemo(() => {
		return Object.keys(groupedComponents).reduce(
			(acc, category) => {
				acc[category] = true
				return acc
			},
			{}
		)
	}, [groupedComponents]) // groupedComponentsが変更された時のみ再計算

	// 開いているカテゴリを管理する状態
	const [openCategories, setOpenCategories] = useState(initialOpenState)

	// カテゴリの開閉を切り替える関数
	const toggleCategory = React.useCallback((category) => {
		setOpenCategories((prev) => ({
			...prev,
			[category]: !prev[category],
		}))
	}, []) // 依存配列が空なので再作成されない

	return (
		<div className='space-y-1'>
			<h2 className='label-config label-component label-config'>components</h2>

			{/* カテゴリー別アコーディオン */}
			<div className='space-y-2'>
				{Object.keys(groupedComponents)
					.sort(sortCategories)
					.map((category) => (
						<div key={category} className='border rounded-md overflow-hidden'>
							{/* カテゴリーヘッダー（クリックで展開/折りたたみ） */}
							<button
								className='category-header '
								onClick={() => toggleCategory(category)}
							>
								<span className='capitalize'>{category}</span>
								<svg
									className={`w-4 h-4 transition-transform duration-300 ${openCategories[category] ? 'transform rotate-180' : ''}`}
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 9l-7 7-7-7'
									/>
								</svg>
							</button>

							{/* コンポーネントリスト（アニメーション付き） */}
							<div
								className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${openCategories[category] ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}
            `}
							>
								<ul className='container-config container-config-components '>
									{groupedComponents[category].map((component) => (
										<li key={component.value}>
											<button
												className={`btn-ghost-neutral btn-xs btn-square selector-button selector-component ${selectedComponent === component.value ? 'active' : ''}`}
												onClick={() => onSelect(component.value)}
											>
												{component.label}
											</button>
										</li>
									))}
								</ul>
							</div>
						</div>
					))}
			</div>
		</div>
	)
}

// メモ化されたコンポーネント - propsが変更されない限り再レンダリングしない
export default React.memo(ComponentSelector)
