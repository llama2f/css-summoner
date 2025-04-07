import React, { useState, useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import useAsyncHandler from '@/css-builder/hooks/useAsyncHandler' // カスタムフックをインポート
import { classRuleDetails } from '@/css-builder/classMappings' // CSSルール詳細をインポート

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
	// CSSルール表示用の状態
	const [cssRulesString, setCssRulesString] = useState(
		'/* Select classes to see relevant CSS rules */'
	)
	const [cssCopySuccess, setCssCopySuccess] = useState('')

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

	// 選択されたクラスに対応するCSSルールを取得する useEffect
	useEffect(() => {
		if (!displayClassString) {
			setCssRulesString('/* Select classes to see relevant CSS rules */')
			return
		}

		const targetClasses = displayClassString.split(' ').filter(Boolean)
		const foundRules = []

		targetClasses.forEach((className) => {
			// classRuleDetails からルールを検索
			const details = classRuleDetails[className]
			if (details && details.ruleText) {
				// 既に同じルールが追加されていないか確認
				if (!foundRules.includes(details.ruleText)) {
					foundRules.push(details.ruleText)
				}
			}
			// baseClass のルールも検索 (variant が base の場合)
			else if (className === baseClass && classRuleDetails[baseClass]) {
				const baseDetails = classRuleDetails[baseClass]
				if (
					baseDetails.ruleText &&
					!foundRules.includes(baseDetails.ruleText)
				) {
					foundRules.push(baseDetails.ruleText)
				}
			}
		})

		if (foundRules.length > 0) {
			setCssRulesString(foundRules.join('\n\n'))
		} else {
			// classRuleDetails に見つからない場合は、Tailwindクラス等の可能性がある
			setCssRulesString(
				`/* No specific CSS rules found for: ${displayClassString} */\n/* (May be Tailwind utility classes or base browser styles) */`
			)
		}
		// displayClassString が変更された時のみ実行
	}, [displayClassString, baseClass]) // baseClass も依存配列に追加

	// CSSルールコピー用のハンドラー
	const copyCssToClipboard = useCallback(() => {
		if (!cssRulesString || cssRulesString.startsWith('/*')) {
			setCssCopySuccess('コピー対象がありません')
			setTimeout(() => setCssCopySuccess(''), 2000)
			return
		}
		navigator.clipboard
			.writeText(cssRulesString)
			.then(() => {
				setCssCopySuccess('CSSルールをコピーしました！')
				setTimeout(() => setCssCopySuccess(''), 2000)
			})
			.catch(() => {
				setCssCopySuccess('CSSルールのコピーに失敗しました')
				setTimeout(() => setCssCopySuccess(''), 2000)
			})
	}, [cssRulesString])

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

	// CSSルール表示部分の決定ロジック
	const renderCssRulesContent = () => {
		// ローディングやエラー表示は不要になったためシンプルに
		return <pre>{cssRulesString}</pre>
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

			{/* 適用されるCSSルール */}
			<div>
				<div className='flex items-center justify-between mb-1'>
					<h3 className='label-config label-css-rules'>適用されるCSSルール</h3>
					<button
						onClick={copyCssToClipboard}
						disabled={!cssRulesString || cssRulesString.startsWith('/*')}
						className='btn-neutral btn-xs btn-animate-down'
					>
						CSSをコピー
					</button>
				</div>
				<div className='code-aria p-3 rounded text-sm overflow-x-auto min-h-[100px]'>
					{renderCssRulesContent()}
				</div>
				{cssCopySuccess && (
					<p className='text-green-600 text-sm mt-1'>{cssCopySuccess}</p>
				)}
			</div>

			{/* HTMLコード */}
			<div>
				{' '}
				{/* HTMLコード全体を囲むdivを追加 */}
				<div className='flex items-center justify-between mb-1'>
					{' '}
					{/* ヘッダー (mb-1を追加してCSSルール部分と合わせる) */}
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
					{' '}
					{/* コード表示エリア */}
					{renderHtmlContent()}
				</div>
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
