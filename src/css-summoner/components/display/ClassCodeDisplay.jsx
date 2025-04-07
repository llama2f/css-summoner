import React, { useState, useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import useAsyncHandler from '@/css-summoner/hooks/useAsyncHandler' // カスタムフックをインポート
import { classRuleDetails } from '@/css-summoner/classMappings' // CSSルール詳細をインポート

/**
 * 生成されたクラス文字列とHTMLコードを表示するコンポーネント
 * (Propsの説明は省略)
 */
const ClassCodeDisplay = ({
	classString: initialClassString, // props名を変更して区別
	componentType,
	componentVariant,
	selectedModifiers,
	selectedColor,
}) => {
	const [copySuccess, setCopySuccess] = useState('')
	const [handlerResult, setHandlerResult] = useState(null) // ハンドラー結果を保持する state
	// const [htmlString, setHtmlString] = useState('<!-- Loading HTML... -->') // handlerResult から導出するため不要に
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
	) // 変更なしだが、後続の変更のため再記述

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
		setHandlerResult(null) // 依存関係が変わったらリセット

		const generateHtml = () => {
			if (handlerLoading || handlerError || !handlerModule) {
				// ハンドラーロード中またはエラー、またはモジュールがない場合は何もしない
				// (表示は後続のJSXで行う)
				if (isMounted) setGeneratingHtml(false)
				return
			}

			try {
				const options = {
					classString: initialClassString, // props から受け取ったクラス文字列
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
						setHandlerResult(result) // 結果オブジェクト全体を保存
						// setHtmlString(...) は不要に
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
					// エラー時も handlerResult を設定して表示できるようにする
					setHandlerResult({
						htmlString: `<!-- Error rendering ${componentType}: ${err.message} -->`,
						skipDecoration: true,
					}) // エラー時は baseClass を追加しない想定
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
		initialClassString, // props 名変更
		selectedModifiers,
		selectedColor,
		baseClass,
	])

	// 表示するクラス文字列 (handlerResult を参照)
	const displayClassString = useMemo(() => {
		// ハンドラー結果がない場合は初期クラス文字列を表示
		if (!handlerResult) {
			return initialClassString || ''
		}
		// skipDecoration が true の場合は、ハンドラーに渡した initialClassString を使う
		// (または result.reactElement.props.className を使う方がより正確だが複雑になる)
		if (handlerResult.skipDecoration) {
			return initialClassString || ''
		}

		// skipDecoration が false または未定義の場合、baseClass を追加するロジック
		// ハンドラー結果の React 要素からクラスを取得試行、なければ初期値
		const currentClassString =
			handlerResult.reactElement?.props?.className || initialClassString || ''
		return (
			baseClass && currentClassString && !currentClassString.includes(baseClass)
				? `${baseClass} ${currentClassString}`
				: currentClassString
		).trim()
	}, [handlerResult, baseClass, initialClassString]) // initialClassString も依存に追加

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

	// HTML表示用の文字列 (handlerResult から取得)
	const htmlString = useMemo(() => {
		if (generatingHtml || handlerLoading) return '<!-- Loading HTML... -->'
		if (handlerError) {
			if (handlerError.message.includes('Handler not found in manifest')) {
				return `<!-- Handler not found for ${componentType} -->`
			}
			return `<!-- Error loading handler: ${handlerError.message} -->`
		}
		// htmlError は handlerResult に含めるようにしたので不要
		// if (htmlError) return `<!-- Error rendering ${componentType}: ${htmlError.message} -->`;
		if (!componentType) return '<!-- Select a component type -->'
		return handlerResult?.htmlString || '<!-- Failed to generate HTML -->'
	}, [
		handlerResult,
		generatingHtml,
		handlerLoading,
		handlerError,
		componentType,
	])

	// レンダー関数 (renderHtmlContent, renderCssRulesContent) は
	// htmlString と cssRulesString を直接使うようにする
	const renderHtmlContent = () => {
		const style =
			htmlString.startsWith('<!-- Error') ||
			htmlString.startsWith('<!-- Handler not found')
				? { color: 'red' }
				: {}
		return <pre style={style}>{htmlString}</pre>
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
							!initialClassString || // props 名変更
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
	initialClassString: PropTypes.string, // 名前変更
	componentType: PropTypes.string.isRequired,
	componentVariant: PropTypes.string,
	selectedModifiers: PropTypes.arrayOf(PropTypes.string),
	selectedColor: PropTypes.string,
}

ClassCodeDisplay.defaultProps = {
	initialClassString: '', // 名前変更
	componentVariant: '',
	selectedModifiers: [],
	selectedColor: '',
}

export default React.memo(ClassCodeDisplay)
