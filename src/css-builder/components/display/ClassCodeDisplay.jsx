import React, { useState, useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
// import { getComponentHtmlTemplate } from '@/css-builder/templates/componentFactory.jsx'; // 削除
import handlersManifest from '@/css-builder/templates/handlers' // マニフェストをインポート

/**
 * 生成されたクラス文字列とHTMLコードを表示するコンポーネント
 * (Propsの説明は省略)
 */
const ClassCodeDisplay = ({
	classString,
	componentType,
	componentVariant,
	selectedModifiers,
	selectedColor,
}) => {
	const [copySuccess, setCopySuccess] = useState('')
	const [htmlString, setHtmlString] = useState('<!-- Loading HTML... -->')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	// クラス文字列をクリップボードにコピーする（メモ化）
	const copyToClipboard = useCallback(
		(text) => {
			if (!text) return // コピー対象がない場合は何もしない
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
		},
		[setCopySuccess]
	)

	// ベースクラスを決定 (これはハンドラーに渡すオプションとして必要になる場合がある)
	const baseClass = useMemo(() => {
		if (componentType === 'tooltip') return 'tooltip-base'
		if (componentType === 'button') return 'btn-base'
		if (componentType === 'card') return 'card-base'
		if (componentType === 'badge') return 'badge-base'
		if (componentType === 'infobox') return 'infobox-base'
		return `${componentType}-base`
	}, [componentType])

	// HTML文字列を非同期で取得する useEffect
	useEffect(() => {
		let isMounted = true
		setLoading(true)
		setError(null)
		setHtmlString('<!-- Loading HTML... -->') // タイプが変わったらリセット

		const loadHtml = async () => {
			if (!componentType) {
				if (isMounted) {
					setHtmlString('<!-- Select a component type -->')
					setLoading(false)
				}
				return
			}

			const handlerInfo = handlersManifest[componentType]

			if (!handlerInfo || !handlerInfo.path) {
				console.warn(
					`[ClassCodeDisplay] Handler info not found for type: ${componentType}`
				)
				if (isMounted) {
					setError(new Error(`Handler not found for type: ${componentType}`))
					setHtmlString(`<!-- Handler not found for ${componentType} -->`)
					setLoading(false)
				}
				return
			}

			try {
				const module = await import(handlerInfo.path)
				const handlerModule = module.default

				if (handlerModule && (handlerModule.render || handlerModule.variants)) {
					const options = {
						classString,
						selectedModifiers,
						variant: componentVariant,
						baseClass,
						color: selectedColor,
						children: `${componentType} Example`, // HTML用の子要素 (必要に応じて調整)
					}

					let renderFunction = null
					if (
						componentVariant &&
						handlerModule.variants &&
						handlerModule.variants[componentVariant]
					) {
						renderFunction = handlerModule.variants[componentVariant]
					} else if (handlerModule.render) {
						renderFunction = handlerModule.render
					}

					if (typeof renderFunction === 'function') {
						const result = renderFunction(options)
						if (isMounted) {
							setHtmlString(
								result?.htmlString || '<!-- Failed to generate HTML -->'
							)
						}
					} else {
						throw new Error('No valid render function found in handler.')
					}
				} else {
					throw new Error('Invalid handler module structure.')
				}

				if (isMounted) setLoading(false)
			} catch (err) {
				console.error(
					`[ClassCodeDisplay] Failed to load/render HTML for ${componentType}:`,
					err
				)
				if (isMounted) {
					setError(err)
					setHtmlString(
						`<!-- Error loading/rendering ${componentType}: ${err.message} -->`
					)
					setLoading(false)
				}
			}
		}

		loadHtml()

		return () => {
			isMounted = false
		}
		// classString も依存関係に含める (クラスが変わったらHTMLも再生成)
	}, [
		componentType,
		componentVariant,
		classString,
		selectedModifiers,
		selectedColor,
		baseClass,
	])

	// 以前の htmlString を生成する useMemo は削除

	// 表示するクラス文字列 (ベースクラスを先頭に追加)
	const displayClassString = useMemo(() => {
		return (
			baseClass && classString && !classString.includes(baseClass)
				? `${baseClass} ${classString}`
				: classString || ''
		).trim()
	}, [baseClass, classString])

	return (
		<div className='mt-6 space-y-4'>
			<div>
				<h3 className='label-config label-generated-class'>生成されたクラス</h3>
				<div className='flex items-center gap-2'>
					<div className='code-aria p-3 rounded text-sm overflow-x-auto flex-grow'>
						{displayClassString || '<クラスを選択してください>'}
					</div>
					<button
						onClick={() => copyToClipboard(displayClassString)}
						disabled={!displayClassString}
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
					// ローディング中やエラー時はコピー無効化
					disabled={
						loading || !!error || !classString || htmlString.startsWith('<!--')
					}
					className='btn-neutral btn-xs btn-animate-down'
				>
					HTMLをコピー
				</button>
			</div>

			<div className='code-aria p-3 rounded text-sm overflow-x-auto'>
				{/* ローディング状態やエラーも考慮して表示 */}
				{loading ? (
					<pre>Loading HTML...</pre>
				) : error ? (
					<pre style={{ color: 'red' }}>{htmlString}</pre> // エラーメッセージを表示
				) : (
					<pre>{htmlString}</pre>
				)}
			</div>
		</div>
	)
}

// PropTypes と defaultProps は変更なし
ClassCodeDisplay.propTypes = {
	classString: PropTypes.string,
	componentType: PropTypes.string.isRequired,
	componentVariant: PropTypes.string,
	selectedModifiers: PropTypes.arrayOf(PropTypes.string),
	selectedColor: PropTypes.string,
}

ClassCodeDisplay.defaultProps = {
	classString: '',
	componentVariant: '',
	selectedModifiers: [],
	selectedColor: '',
}

export default React.memo(ClassCodeDisplay)
