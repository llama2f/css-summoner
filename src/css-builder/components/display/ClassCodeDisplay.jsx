// components/display/ClassCodeDisplay.jsx
// クラスコードの表示

import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { getComponentHtmlTemplate } from '@/css-builder/templates/componentFactory.jsx'

/**
 * 生成されたクラス文字列とHTMLコードを表示するコンポーネント
 *
 * @param {Object} props
 * @param {string} props.classString - 生成されたクラス文字列
 * @param {string} props.componentType - 選択されたコンポーネントタイプ
 * @param {Array} props.selectedModifiers - 選択されたモディファイア
 */
const ClassCodeDisplay = ({
	classString,
	componentType,
	selectedModifiers,
}) => {
	const [copySuccess, setCopySuccess] = useState('')

	// クラス文字列をクリップボードにコピーする（メモ化）
	const copyToClipboard = useCallback((text) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				setCopySuccess('コピーしました！')
				setTimeout(() => setCopySuccess(''), 2000)
			})
			.catch(() => {
				setCopySuccess('コピーに失敗しました')
				setTimeout(() => setCopySuccess(''), 2000)
			})
	}, [setCopySuccess]) // setCopySuccessが変更されることはないが、念のため依存配列に含める

	// テンプレートからHTML文字列を取得（メモ化）
	const htmlString = useMemo(() => {
	 
		try {
			// componentTypeが'card'で、classStringに'card-title'が含まれている場合の特別処理
			const classTokens = classString.split(' ');
			const variant = classTokens.find(c => 
				c === 'card-title' || c === 'card-horizontal' || 
				c === 'card-header' || c === 'card-footer' || 
				c === 'card-subtitle' || c === 'card-actions'
			);
			
			 
			return getComponentHtmlTemplate(componentType, {
				classString,
				selectedModifiers,
				variant // バリアント情報を渡す
			});
		} catch (error) {
			console.error(`[ClassCodeDisplay] Error getting HTML template:`, error);
			return `<!-- Error generating HTML template -->`;
		}
	}, [componentType, classString, selectedModifiers]) // 依存する値が変更された時のみ再計算

	return (
		<div className='mt-6 space-y-4'>
			<div>
				<h3 className='label-config label-generated-class'>生成されたクラス</h3>
				<div className='flex items-center gap-2'>
					<div className='code-aria p-3 rounded  text-sm overflow-x-auto flex-grow'>
						{classString || '<クラスを選択してください>'}
					</div>
					<button
						onClick={() => copyToClipboard(classString)}
						disabled={!classString}
						className='btn-accent btn-sm btn-animate-down'
					>
						コピー
					</button>
				</div>
				{copySuccess && (
					<p className='text-green-600 text-sm mt-1'>{copySuccess}</p>
				)}
			</div>

			<div className='flex items-center justify-between'>
				<h3 className='label-config label-html'>HTMLコード</h3>
				<button
					onClick={() => copyToClipboard(htmlString)}
					disabled={!classString}
					className='btn-neutral btn-xs btn-animate-down'
				>
					HTMLをコピー
				</button>
			</div>

			<div className='code-aria p-3 rounded  text-sm overflow-x-auto'>
				<pre>{htmlString}</pre>
			</div>
		</div>
	)
}

ClassCodeDisplay.propTypes = {
	classString: PropTypes.string,
	componentType: PropTypes.string.isRequired,
	selectedModifiers: PropTypes.arrayOf(PropTypes.string),
}

ClassCodeDisplay.defaultProps = {
	classString: '',
	selectedModifiers: [],
}

// メモ化されたコンポーネント - propsが変更されない限り再レンダリングしない
export default React.memo(ClassCodeDisplay)
