import React, { useState, useCallback, useMemo, useEffect } from 'react'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/github-dark.css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
import PropTypes from 'prop-types'
import useAsyncHandler from '@hooks/useAsyncHandler'
import {
	classRuleDetails,
	baseClasses,
	themeRules,
	utilityRules,
} from '@/css-summoner/extracted-annotations.json' // JSONを直接インポートする場合 (パス確認)
// もし classMappings.js がラッパーなら:
// import { classRuleDetails, baseClasses, themeRules, utilityRules } from '@/css-summoner/classMappings'
import Accordion from '@components/common/Accordion'

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
	// ハイライトされたコードを保持する state
	const [highlightedHtml, setHighlightedHtml] = useState('')
	const [highlightedCss, setHighlightedCss] = useState('')
	const copyToClipboard = useCallback(
		(text) => {
			if (!text) return
			navigator.clipboard
				.writeText(text)
				.then(() => {
					setCopySuccess('Copy Succeed !')
					setTimeout(() => setCopySuccess(''), 2000)
				})
				.catch(() => {
					setCopySuccess('Copy Failed !')
					setTimeout(() => setCopySuccess(''), 2000)
				})
		},
		[setCopySuccess]
	)

	// ベースクラスを決定
	const baseClass = useMemo(() => {
		// baseClasses マッピングから取得するのみ、存在しない場合は空文字列を返す
		return baseClasses[componentType] || ''
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
					})
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
		if (handlerResult.skipDecoration) {
			return initialClassString || ''
		}

		// 選択されたバリアントを含むクラス名を持つ要素を検索
		const findClassWithVariant = (element) => {
			if (!element || !element.props) return null

			// 現在の要素のクラス名を確認
			const className = element.props.className || ''
			// クラス名を空白で分割
			const classNames = className.split(/\s+/)

			// componentVariantが存在し、要素のクラス名に完全一致するバリアントが含まれる場合
			if (
				componentVariant &&
				className &&
				classNames.includes(componentVariant)
			) {
				return className
			}

			// 子要素を検索
			const { children } = element.props
			if (!children) return null

			if (Array.isArray(children)) {
				// 配列の場合は各子要素を検索
				for (const child of children) {
					// React要素の場合のみ再帰的に検索
					if (React.isValidElement(child)) {
						const result = findClassWithVariant(child)
						if (result) return result
					}
				}
			} else if (React.isValidElement(children)) {
				// 単一の子要素の場合
				return findClassWithVariant(children)
			}

			return null
		}

		// コンポーネントバリアントが選択されている場合、その要素のクラス名を優先
		if (componentVariant) {
			const variantClass = findClassWithVariant(handlerResult.reactElement)
			if (variantClass) {
				return variantClass
			}
		}

		// バリアントによる検索で見つからない場合は従来の処理
		// ハンドラーが生成したreactElementからクラス文字列を取得
		const currentClassString =
			handlerResult.reactElement?.props?.className || initialClassString || ''

		// ハンドラーが既にbaseClassを含めて生成しているため、追加処理は不要
		return currentClassString.trim()
	}, [handlerResult, baseClass, initialClassString, componentVariant]) // componentVariant も依存に追加

	// 選択されたクラスに対応するCSSルールを取得する useEffect
	useEffect(() => {
		if (!displayClassString) {
			setCssRulesString('/* Select classes to see relevant CSS rules */')
			return
		}

		const targetClasses = displayClassString.split(' ').filter(Boolean)
		const rulesByType = {
			base: [],
			variant: [],
			theme: [],
			utility: [],
			related: [],
		}
		const addedRuleTexts = new Set() // 重複ルールテキストを追跡

		// ルールを追加するヘルパー関数 (重複チェックのみ)
		const addRule = (type, ruleText) => {
			if (ruleText && !addedRuleTexts.has(ruleText)) {
				rulesByType[type].push(ruleText) // コメントなしでルールテキストのみ追加
				addedRuleTexts.add(ruleText)
			}
		}

		targetClasses.forEach((className) => {
			// 1. classRuleDetails から検索 (Base or Variant)
			const details = classRuleDetails[className]
			if (details) {
				const isBase = className === baseClasses[details.component]
				const ruleType = isBase ? 'base' : 'variant'
				addRule(ruleType, details.ruleText) // コメント引数を削除

				// 関連ルール
				if (details.relatedRules && details.relatedRules.length > 0) {
					details.relatedRules.forEach((relatedRule) => {
						addRule('related', relatedRule.ruleText) // コメント引数を削除
					})
				}
			}
			// 2. themeRules から検索
			else if (className.startsWith('theme-') && themeRules[className]) {
				const themeDetail = themeRules[className]
				addRule('theme', themeDetail.ruleText) // コメント引数を削除
				// ToDo: themeRules にも relatedRules が必要か検討
			}
			// 3. utilityRules から検索
			else if (utilityRules[className]) {
				const utilityDetail = utilityRules[className]
				addRule('utility', utilityDetail.ruleText) // コメント引数を削除
				// ToDo: utilityRules にも relatedRules が必要か検討
			}
		})

		// ルールを結合して整形
		let finalCssString = ''
		const ruleOrder = ['base', 'variant', 'theme', 'utility', 'related'] // 表示順序

		ruleOrder.forEach((type) => {
			if (rulesByType[type].length > 0) {
				finalCssString += rulesByType[type].join('\n\n') + '\n\n' // コメントなしで結合
			}
		})

		finalCssString = finalCssString.trim() // 末尾の余分な改行を削除

		if (finalCssString) {
			setCssRulesString(finalCssString)
		} else {
			setCssRulesString(
				`/* No specific CSS rules found for: ${displayClassString} */\n/* (May be Tailwind utility classes or base browser styles) */`
			)
		}
	}, [displayClassString, baseClass]) // 依存配列は変更なし

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
		if (!componentType) return '<!-- Select a component type -->'
		return handlerResult?.htmlString || '<!-- Failed to generate HTML -->'
	}, [
		handlerResult,
		generatingHtml,
		handlerLoading,
		handlerError,
		componentType,
	])

	// htmlString が変更されたらハイライト処理を実行
	useEffect(() => {
		if (htmlString && !htmlString.startsWith('<!--')) {
			try {
				const highlighted = hljs.highlight(htmlString, {
					language: 'html',
					ignoreIllegals: true,
				}).value
				setHighlightedHtml(highlighted)
			} catch (error) {
				console.error('Error highlighting HTML:', error)
				setHighlightedHtml(htmlString) // エラー時は元の文字列を表示
			}
		} else {
			setHighlightedHtml(htmlString) // ローディング中やエラーメッセージはそのまま表示
		}
	}, [htmlString])

	// cssRulesString が変更されたらハイライト処理を実行
	useEffect(() => {
		if (cssRulesString && !cssRulesString.startsWith('/*')) {
			try {
				const highlighted = hljs.highlight(cssRulesString, {
					language: 'css',
					ignoreIllegals: true,
				}).value
				setHighlightedCss(highlighted)
			} catch (error) {
				console.error('Error highlighting CSS:', error)
				setHighlightedCss(cssRulesString) // エラー時は元の文字列を表示
			}
		} else {
			setHighlightedCss(cssRulesString) // 初期メッセージ等はそのまま表示
		}
	}, [cssRulesString])

	// ハイライトされたHTMLをレンダリング
	const renderHtmlContent = () => {
		// エラーメッセージなどのプレーンテキストはそのまま表示
		if (htmlString.startsWith('<!--')) {
			const style = { color: 'red' }
			return (
				<pre style={style}>
					<code>{htmlString}</code>
				</pre>
			)
		}
		// ハイライトされたHTMLを表示
		return (
			<pre>
				<code
					className='language-html hljs' // hljsクラスを追加
					dangerouslySetInnerHTML={{ __html: highlightedHtml }}
				/>
			</pre>
		)
	}
	// ハイライトされたCSSをレンダリング
	const renderCssRulesContent = () => {
		// 初期メッセージなどはそのまま表示
		if (cssRulesString.startsWith('/*')) {
			return <pre>{cssRulesString}</pre>
		}
		// ハイライトされたCSSを表示
		return (
			<pre>
				<code
					className='language-css hljs' // hljsクラスを追加
					dangerouslySetInnerHTML={{ __html: highlightedCss }}
				/>
			</pre>
		)
	}

	return (
		<div className='mt-6 space-y-4'>
			<div>
				<h3 className='label-config label-generated-class'>生成されたクラス</h3>
				<div className='flex items-center gap-2'>
					{/* pre と code タグで囲み、他のコードエリアとスタイルを統一 */}
					<pre className='code-aria rounded overflow-x-auto flex-grow'>
						<code>{displayClassString || '<クラスを選択してください>'}</code>
					</pre>
					<button
						onClick={() => copyToClipboard(displayClassString)}
						disabled={!displayClassString}
						className='btn-base btn-solid btn-sm rounded theme-accent'
						title='クラスをコピー'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 448 512'
							className='h-4 w-4 fill-current'
						>
							{/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. */}
							<path d='M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z' />
						</svg>
						<span className='sr-only'>copy class</span>
					</button>
				</div>
				{copySuccess && (
					<p className='text-green-600 text-sm mt-1'>{copySuccess}</p>
				)}
			</div>

			{/* 適用されるCSSルール - アコーディオン形式 */}
			<Accordion
				title='適用されるCSSルール'
				className='mb-4'
				initialOpen={false}
				headerRight={
					<button
						onClick={copyCssToClipboard}
						// disabled 条件を修正: cssRulesString が存在し、かつ初期メッセージでない場合に有効化
						disabled={
							!cssRulesString ||
							cssRulesString.startsWith('/* No specific CSS rules found')
						}
						className='btn-base btn-solid btn-xs rounded theme-neutral flex justify-center'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 448 512'
							className='h-4 w-4 fill-current'
						>
							<path d='M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z' />
						</svg>
						<span className='sr-only'>copy style</span>
					</button>
				}
				contentClassName=''
			>
				{renderCssRulesContent()}
				{cssCopySuccess && (
					<p className='text-green-600 text-sm mt-1'>{cssCopySuccess}</p>
				)}
			</Accordion>

			{/* HTMLコード - アコーディオン形式 */}
			<Accordion
				title='HTMLコード'
				className='mb-4'
				initialOpen={false}
				headerRight={
					<button
						onClick={() => copyToClipboard(htmlString)}
						disabled={
							handlerLoading ||
							generatingHtml ||
							!!handlerError ||
							!!htmlError ||
							!initialClassString ||
							htmlString.startsWith('<!--')
						}
						className='btn-base btn-solid btn-xs rounded theme-neutral'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 448 512'
							className='h-4 w-4 fill-current'
						>
							<path d='M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z' />
						</svg>
						<span className='sr-only'>copy html</span>
					</button>
				}
				contentClassName=''
			>
				{renderHtmlContent()}
			</Accordion>
		</div>
	)
}

// PropTypes の名前を元に戻す (initialClassString は内部でのみ使用)
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
