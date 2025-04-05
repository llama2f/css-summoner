import React, { useState, useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import useAsyncHandler from '@/css-builder/hooks/useAsyncHandler' // カスタムフックをインポート
// import handlersManifest from '@/css-builder/templates/handlers'; // マニフェストはフック内で使用するため不要

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
	// カスタムフックからハンドラーモジュール、ローディング状態、エラーを取得
	const {
		handlerModule,
		loading: handlerLoading,
		error: handlerError,
	} = useAsyncHandler(componentType)
	// HTML生成自体のローディング/エラー状態も管理 (フックとは別)
	const [generatingHtml, setGeneratingHtml] = useState(false)
	const [htmlError, setHtmlError] = useState(null)

	// クラス文字列をクリップボードにコピーする（メモ化）
	const copyToClipboard = useCallback(
		(text) => {
			if (!text) return
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

	// ベースクラスを決定
	const baseClass = useMemo(() => {
		if (componentType === 'tooltip') return 'tooltip-base'
		if (componentType === 'button') return 'btn-base'
		if (componentType === 'card') return 'card-base'
		if (componentType === 'badge') return 'badge-base'
		if (componentType === 'infobox') return 'infobox-base'
		return `${componentType}-base`
	}, [componentType])

	// HTML文字列を生成する useEffect (ハンドラーがロードされた後に実行)
	useEffect(() => {
		let isMounted = true
		setGeneratingHtml(true)
		setHtmlError(null)

		const generateHtml = () => {
			if (handlerLoading || handlerError || !handlerModule) {
				// ハンドラーロード中またはエラー、またはモジュールがない場合は何もしない
				// (表示は後続のJSXで行う)
				if (isMounted) setGeneratingHtml(false)
				return
			}

			try {
				const options = {
					classString,
					selectedModifiers,
					variant: componentVariant,
					baseClass,
					color: selectedColor,
					children: `${componentType} Example`,
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
			} catch (err) {
				console.error(
					`[ClassCodeDisplay] Failed to render HTML for ${componentType}:`,
					err
				)
				if (isMounted) {
					setHtmlError(err)
					setHtmlString(
						`<!-- Error rendering ${componentType}: ${err.message} -->`
					)
				}
			} finally {
				if (isMounted) setGeneratingHtml(false)
			}
		}

		generateHtml()

		return () => {
			isMounted = false
		}
		// handlerModule が変更された時 (ロード完了時) と、HTML生成に必要な他の props が変更された時に実行
	}, [
		handlerModule,
		handlerLoading,
		handlerError,
		componentType,
		componentVariant,
		classString,
		selectedModifiers,
		selectedColor,
		baseClass,
	])

	// 表示するクラス文字列
	const displayClassString = useMemo(() => {
		return (
			baseClass && classString && !classString.includes(baseClass)
				? `${baseClass} ${classString}`
				: classString || ''
		).trim()
	}, [baseClass, classString])

	// HTML表示部分の決定ロジック
	const renderHtmlContent = () => {
		if (handlerLoading || generatingHtml) {
			return <pre>Loading HTML...</pre>
		}
		if (handlerError) {
			// ハンドラーが見つからないエラー
			if (handlerError.message.includes('Handler not found in manifest')) {
				return <pre>{`<!-- Handler not found for ${componentType} -->`}</pre>
			}
			// その他のロードエラー
			return (
				<pre
					style={{ color: 'red' }}
				>{`<!-- Error loading handler: ${handlerError.message} -->`}</pre>
			)
		}
		if (htmlError) {
			// HTML生成時のエラー
			return <pre style={{ color: 'red' }}>{htmlString}</pre>
		}
		if (!componentType) {
			return <pre>{'<!-- Select a component type -->'}</pre>
		}
		// 正常に生成されたHTML
		return <pre>{htmlString}</pre>
	}

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
					disabled={
						handlerLoading ||
						generatingHtml ||
						!!handlerError ||
						!!htmlError ||
						!classString ||
						htmlString.startsWith('<!--')
					}
					className='btn-neutral btn-xs btn-animate-down'
				>
					HTMLをコピー
				</button>
			</div>

			<div className='code-aria p-3 rounded text-sm overflow-x-auto'>
				{renderHtmlContent()}
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
