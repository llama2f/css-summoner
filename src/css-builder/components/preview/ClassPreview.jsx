// components/preview/ClassPreview.jsx
// クラスのプレビュー表示

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { getComponentReactTemplate } from '@/css-builder/templates/componentFactory.jsx'
import { combineClasses } from '@/css-builder/templates/handlers/common.jsx'

/**
 * 選択されたクラスに基づいてコンポーネントをプレビューするコンポーネント
 *
 * @param {Object} props
 * @param {string} props.componentType - 選択されたコンポーネントタイプ
 * @param {string} props.componentVariant - 選択されたコンポーネントのバリアント
 * @param {string} props.borderRadius - 選択された角丸タイプ
 * @param {Array} props.selectedModifiers - 選択されたモディファイア
 * @param {Array} props.selectedSpecialClasses - 選択された特殊効果クラス
 * @param {string} props.additionalClasses - 追加のカスタムクラス
 * @param {string} props.size - 選択されたサイズ
 * @param {string} props.previewBg - プレビュー背景のスタイル
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
}) => {
	// すべてのクラスを結合（メモ化）
	const combinedClasses = useMemo(() => {
		return combineClasses({
			baseClass,
			variant: componentVariant,
			size,
			radius: borderRadius,
			modifiers: selectedModifiers,
			specialClasses: selectedSpecialClasses,
			additional: additionalClasses
		});
	}, [
		baseClass,
		componentVariant,
		size,
		borderRadius,
		selectedModifiers,
		selectedSpecialClasses,
		additionalClasses
	]); // 依存する値が変更された時のみ再計算

	// テンプレートからReactコンポーネントを取得（メモ化）
	const reactElement = useMemo(() => {
		return getComponentReactTemplate(componentType, {
			classString: combinedClasses,
			selectedModifiers,
			baseClass,
			forPreview: true,
			// バリアント情報を明示的に渡す
			variant: componentVariant
		});
	}, [componentType, combinedClasses, selectedModifiers, baseClass, componentVariant]); // 依存値にcomponentVariantを追加

	return (
		<div
			className={`${previewBg} p-8 flex items-center justify-center rounded-lg min-h-[200px] border border-dashed border-neutral-300`}
		>
			<div className='flex flex-col items-center'>
				{reactElement}
				<div className='mt-4 text-xs text-neutral-500 text-center max-w-xs'>
					<div>
						適用クラス:{' '}
						<code className='bg-neutral-200 p-1 rounded'>
							{combinedClasses}
						</code>
					</div>
				</div>
			</div>
		</div>
	)
}

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
}

// メモ化されたコンポーネント - propsが変更されない限り再レンダリングしない
export default React.memo(ClassPreview)
