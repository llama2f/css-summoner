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

	// ベースクラスを決定
	// コンポーネントタイプに基づいてベースクラスを設定
	const baseClass = useMemo(() => {
		if (componentType === 'tooltip') return 'tooltip-base';
		if (componentType === 'button') return 'btn-base';
		if (componentType === 'card') return 'card-base';
		if (componentType === 'badge') return 'badge-base';
		if (componentType === 'infobox') return 'infobox-base';
		// 他のコンポーネントタイプも必要に応じて追加
		return `${componentType}-base`; // デフォルトのパターン
	}, [componentType]);

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
				variant, // バリアント情報を渡す
				baseClass  // ベースクラスを明示的に渡す
			});
		} catch (error) {
			console.error(`[ClassCodeDisplay] Error getting HTML template:`, error);
			return `<!-- Error generating HTML template -->`;
		}
	}, [componentType, classString, selectedModifiers, baseClass]) // 依存する値が変更された時のみ再計算

	return (
		<div className='mt-6 space-y-4'>
			<div>
				<h3 className='label-config label-generated-class'>生成されたクラス</h3>
				<div className='flex items-center gap-2'>
					<div className='code-aria p-3 rounded  text-sm overflow-x-auto flex-grow'>
						{(baseClass && !classString.includes(baseClass)) 
							? `${baseClass} ${classString}`.trim() 
							: classString || '<クラスを選択してください>'}
					</div>
					<button
						onClick={() => copyToClipboard(baseClass && !classString.includes(baseClass) 
							? `${baseClass} ${classString}`.trim() 
							: classString)}
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
