import React, { useState, useEffect, Suspense } from 'react'
import handlersManifest from '../handlers' // マニフェストファイルをインポート

// ローディング中のプレースホルダーコンポーネント
function LoadingFallback({ componentType }) {
	return <div>Loading handler for "{componentType}"...</div>
}

// エラー時のフォールバックコンポーネント
function ErrorFallback({ componentType, error }) {
	console.error(`Error loading handler for ${componentType}:`, error)
	return (
		<div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
			Error loading handler for "{componentType}":{' '}
			{error?.message || 'Unknown error'}
		</div>
	)
}

// ハンドラーが見つからない場合のフォールバックコンポーネント
function NotFoundFallback({ componentType }) {
	console.warn(
		`警告: ${componentType} のテンプレートハンドラーがマニフェストに見つかりませんでした`
	)
	// 以前のフォールバックと同様の表示
	return <div>Component: {componentType} (Handler not found)</div>
}

/**
 * 指定されたコンポーネントタイプのハンドラーを非同期にロードし、
 * そのハンドラーの render 関数を実行してコンポーネントをレンダリングするReactコンポーネント。
 * @param {string} componentType - レンダリングするコンポーネントのタイプ (例: 'button', 'card')
 * @param {object} options - ハンドラーの render 関数に渡されるプロパティ (classString, children, variant など)
 */
function TemplateRenderer({ componentType, options = {} }) {
	const [handlerModule, setHandlerModule] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		let isMounted = true // アンマウント時の不要なステート更新を防ぐフラグ
		setLoading(true)
		setError(null)
		setHandlerModule(null) // タイプが変わったらリセット

		const loadHandler = async () => {
			if (!componentType) {
				if (isMounted) setLoading(false)
				return // タイプが指定されていなければ何もしない
			}

			const handlerInfo = handlersManifest[componentType]

			if (!handlerInfo || !handlerInfo.path) {
				console.warn(
					`Handler info not found in manifest for type: ${componentType}`
				)
				if (isMounted) {
					setError(
						new Error(
							`Handler not found in manifest for type: ${componentType}`
						)
					)
					setLoading(false)
				}
				return
			}

			try {
				// マニフェストのパスを使って動的インポート (エイリアスパスを解決させる)
				const module = await import(handlerInfo.path)

				if (isMounted) {
					if (
						module.default &&
						(module.default.render || module.default.variants)
					) {
						setHandlerModule(module.default)
					} else {
						console.error(
							`Loaded module for ${componentType} is missing default export or render/variants function.`
						)
						setError(
							new Error(
								`Invalid handler module structure for type: ${componentType}`
							)
						)
					}
					setLoading(false)
				}
			} catch (err) {
				console.error(
					`Failed to load handler for ${componentType} from ${handlerInfo.path}:`,
					err
				)
				if (isMounted) {
					setError(err)
					setLoading(false)
				}
			}
		}

		loadHandler()

		// クリーンアップ関数
		return () => {
			isMounted = false
		}
	}, [componentType]) // componentType が変更されたら再実行

	// --- レンダリングロジック ---

	if (loading) {
		return <LoadingFallback componentType={componentType} />
	}

	if (error) {
		// ハンドラーが見つからないエラーは専用のフォールバックで表示
		if (error.message.includes('Handler not found in manifest')) {
			return <NotFoundFallback componentType={componentType} />
		}
		return <ErrorFallback componentType={componentType} error={error} />
	}

	if (!handlerModule) {
		// 通常はここまで来ないはずだが、念のため
		return <NotFoundFallback componentType={componentType} />
	}

	// ハンドラーモジュールがロードされたら、render または variants を呼び出す
	try {
		const { variant, ...props } = options
		let renderFunction = null

		// バリアント固有のレンダラーを優先
		if (variant && handlerModule.variants && handlerModule.variants[variant]) {
			renderFunction = handlerModule.variants[variant]
		} else if (handlerModule.render) {
			// 基本レンダラーを使用
			renderFunction = handlerModule.render
		}

		if (typeof renderFunction === 'function') {
			// ハンドラーは { reactElement, htmlString } を返す想定
			const result = renderFunction(props)
			// このコンポーネントは React 要素のみをレンダリングする
			return (
				result?.reactElement || (
					<ErrorFallback
						componentType={componentType}
						error={new Error('Handler did not return a valid React element.')}
					/>
				)
			)
		} else {
			return (
				<ErrorFallback
					componentType={componentType}
					error={new Error('No valid render function found in handler.')}
				/>
			)
		}
	} catch (renderError) {
		console.error(`Error rendering component ${componentType}:`, renderError)
		return <ErrorFallback componentType={componentType} error={renderError} />
	}
}

// TemplateRenderer コンポーネントをデフォルトエクスポートする
export default TemplateRenderer

// generateTemplate 関数は削除 (または必要ならコメントアウト)
// export { generateTemplate }; // ← 削除
