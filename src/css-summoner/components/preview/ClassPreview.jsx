// components/preview/ClassPreview.jsx
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
// import { getComponentReactTemplate } from '@/css-summoner/templates/componentFactory.jsx'; // 削除
import { combineClasses } from '@/css-summoner/templates/handlers/common.jsx' // これは引き続き使用
import TemplateRenderer from '@/css-summoner/templates/core/templateEngine.jsx' // 追加

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
		// baseClass は TemplateRenderer 側でハンドラーに渡して処理させるため、ここでは結合しない
		return combineClasses({
			// baseClass, // 除外
			variant: componentVariant,
			size,
			radius: borderRadius,
			modifiers: selectedModifiers,
			specialClasses: selectedSpecialClasses,
			color: selectedColor,
			additional: additionalClasses,
		})
	}, [
		// baseClass, // 除外
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
			selectedModifiers: selectedModifiers, // ハンドラーがモディファイアを必要とする場合
			// プレビュー用の固定プロパティ (必要に応じて調整)
			// ハンドラー側でデフォルト値を持つことが多いので、ここでは必須ではない場合もある
			children: `${componentType} Preview`,
			// variant は TemplateRenderer が options から取り出して処理する想定
			variant: componentVariant,
			color: selectedColor, // ハンドラーが必要とする場合
			// forPreview: true, // 以前あったが、新しいハンドラーで必要か確認
			baseClass: baseClass, // TemplateRenderer に渡す
		}),
		[
			combinedClasses,
			selectedModifiers,
			componentType,
			componentVariant,
			selectedColor,
			baseClass, // 依存配列に追加
		]
	)

	// reactElement を生成する useMemo は不要になった

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
				<div className='mt-4 text-xs text-neutral-500 text-center max-w-xs'>
					<div>
						適用クラス:{' '}
						<code className='bg-neutral-200 p-1 rounded'>
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
