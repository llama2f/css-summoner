// components/display/ClassCodeDisplay.jsx
// クラスコードの表示

import React, { useState } from 'react'
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

	// クラス文字列をクリップボードにコピーする
	const copyToClipboard = (text) => {
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
	}

	// テンプレートからHTML文字列を取得
	const htmlString = getComponentHtmlTemplate(componentType, {
		classString,
		selectedModifiers,
	})

	return (
		<div className='mt-6 space-y-4'>
			<div>
				<h3 className='label-config label-generated-class'>生成されたクラス</h3>
				<div className='flex items-center gap-2'>
					<div className='bg-neutral-100 p-3 rounded font-mono text-sm overflow-x-auto flex-grow'>
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

			<div className='bg-neutral-100 p-3 rounded font-mono text-sm overflow-x-auto'>
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

export default ClassCodeDisplay
