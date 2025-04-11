import React from 'react' // useState, useEffect は不要になった
import useAsyncHandler from '@hooks/useAsyncHandler' // カスタムフックをインポート
// import handlersManifest from '../handlers'; // マニフェストはフック内で使用するため不要

// ローディング中のプレースホルダーコンポーネント
function LoadingFallback({ componentType }) {
	return <div>Loading handler for "{componentType}"...</div>
}

// エラー時のフォールバックコンポーネント
function ErrorFallback({ componentType, error }) {
	// エラーログはフック内で行われるため、ここでは表示に専念
	return (
		<div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
			Error loading handler for "{componentType}":{' '}
			{error?.message || 'Unknown error'}
		</div>
	)
}

// ハンドラーが見つからない場合のフォールバックコンポーネント
function NotFoundFallback({ componentType }) {
	// 警告ログはフック内で行われるため、ここでは表示に専念
	return <div>Component: {componentType} (Handler not found)</div>
}

/**
 * 指定されたコンポーネントタイプのハンドラーを非同期にロードし、
 * そのハンドラーの render 関数を実行してコンポーネントをレンダリングするReactコンポーネント。
 * @param {string} componentType - レンダリングするコンポーネントのタイプ (例: 'button', 'card')
 * @param {object} options - ハンドラーの render 関数に渡されるプロパティ (classString, children, variant など)
 */
function TemplateRenderer({ componentType, options = {} }) {
	// カスタムフックを使用してハンドラーモジュール、ローディング状態、エラーを取得
	const { handlerModule, loading, error } = useAsyncHandler(componentType)

	// useEffect 内のロジックはカスタムフックに移動したため削除

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
		// タイプが指定されていない場合など
		if (!componentType) return <div>Select a component type</div>
		// 通常はここまで来ないはずだが、念のため
		return <NotFoundFallback componentType={componentType} />
	}

	// ハンドラーモジュールがロードされたら、render または variants を呼び出す
	try {
		// optionsからvariantを抽出し、残りはpropsとして扱う
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
		// レンダリング時のエラーログはここに残す
		console.error(`Error rendering component ${componentType}:`, renderError)
		return <ErrorFallback componentType={componentType} error={renderError} />
	}
}

// TemplateRenderer コンポーネントをデフォルトエクスポートする
export default TemplateRenderer
