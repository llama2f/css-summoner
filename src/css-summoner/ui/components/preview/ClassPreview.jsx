// components/preview/ClassPreview.jsx
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { combineClasses } from '@templates/handlers/common.jsx'
import TemplateRenderer from '@templates/core/templateEngine.jsx'

/**
 * 選択されたクラスに基づいてコンポーネントをプレビューするコンポーネント
 * (以下、Propsの説明は省略)
 */
const ClassPreview = ({
	componentType,
	componentVariant,
	borderRadius,
	selectedModifiers,
	selectedSpecialClasses,
	additionalClasses,
	size,
	previewBg,
	baseClass,
	selectedColor,
}) => {
	// すべてのクラスを結合（メモ化）- これは TemplateRenderer に渡す classString のために必要
	const combinedClasses = useMemo(() => {
		return combineClasses({
			baseClass, // ベースクラスを追加
			variant: componentVariant,
			size,
			radius: borderRadius,
			modifiers: selectedModifiers,
			specialClasses: selectedSpecialClasses,
			color: selectedColor,
			additional: additionalClasses,
		})
	}, [
		baseClass,
		componentVariant,
		size,
		borderRadius,
		selectedModifiers,
		selectedSpecialClasses,
		additionalClasses,
		selectedColor,
	])

	// TemplateRenderer に渡す options オブジェクトを生成（メモ化）
	const rendererOptions = useMemo(
		() => ({
			classString: combinedClasses,
			selectedModifiers: selectedModifiers,
			children: `${componentType} Preview`,
			variant: componentVariant,
			color: selectedColor,
			baseClass: baseClass,
		}),
		[
			combinedClasses,
			selectedModifiers,
			componentType,
			componentVariant,
			selectedColor,
			baseClass,
		]
	)

	return (
		<div
			className={`${previewBg} p-8 flex items-center justify-center rounded-lg min-h-[200px] border border-dashed border-neutral-300`}
		>
			<div className='flex flex-col items-center'>
				{/* TemplateRenderer を使用してプレビューを表示 */}
				{componentType ? ( // componentType が選択されている場合のみレンダリング
					<TemplateRenderer
						componentType={componentType}
						options={rendererOptions}
					/>
				) : (
					<div>Select a component type</div> // 未選択時の表示
				)}
				<div className='mt-4 text-xs text-neutral-500 dark:text-neutral-300 text-center max-w-xs'>
					<div>
						適用クラス:{' '}
						<code className='bg-neutral-200/30 p-1 rounded'>
							{combinedClasses || 'N/A'}
						</code>
					</div>
				</div>
			</div>
		</div>
	)
}

// PropTypes と defaultProps は変更なし (または TemplateRenderer の仕様に合わせて調整)
ClassPreview.propTypes = {
	componentType: PropTypes.string.isRequired,
	componentVariant: PropTypes.string,
	borderRadius: PropTypes.string,
	selectedModifiers: PropTypes.arrayOf(PropTypes.string),
	selectedSpecialClasses: PropTypes.arrayOf(PropTypes.string),
	additionalClasses: PropTypes.string,
	size: PropTypes.string,
	previewBg: PropTypes.string,
	baseClass: PropTypes.string,
	selectedColor: PropTypes.string,
}

ClassPreview.defaultProps = {
	borderRadius: '',
	selectedModifiers: [],
	selectedSpecialClasses: [],
	additionalClasses: '',
	size: '',
	previewBg: 'bg-transparent',
	baseClass: '',
	componentVariant: '',
	selectedColor: '',
}

export default React.memo(ClassPreview)
