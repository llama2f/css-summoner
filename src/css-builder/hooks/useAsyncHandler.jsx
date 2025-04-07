import { useState, useEffect } from 'react'
import handlersManifest from '@/css-builder/templates/handlers' // マニフェストをインポート

/**
 * 指定されたコンポーネントタイプのハンドラーモジュールを非同期にロードするカスタムフック。
 * @param {string} componentType - ロードするハンドラーのタイプ。
 * @returns {{ handlerModule: object | null, loading: boolean, error: Error | null }}
 *          - handlerModule: ロードされたハンドラーモジュール (default export)。ロード中またはエラー時は null。
 *          - loading: ロード中かどうかを示すフラグ。
 *          - error: ロード中に発生したエラーオブジェクト。エラーがない場合は null。
 */
function useAsyncHandler(componentType) {
	const [handlerModule, setHandlerModule] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		let isMounted = true
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
				const notFoundError = new Error(
					`Handler not found in manifest for type: ${componentType}`
				)
				console.warn(`[useAsyncHandler] ${notFoundError.message}`)
				if (isMounted) {
					setError(notFoundError)
					setLoading(false)
				}
				return
			}

			try {
				// マニフェストのパスを使って動的インポート
				const module = await import(handlerInfo.path)

				if (isMounted) {
					if (
						module.default &&
						(module.default.render || module.default.variants)
					) {
						setHandlerModule(module.default)
					} else {
						const structureError = new Error(
							`Invalid handler module structure for type: ${componentType}`
						)
						console.error(
							`[useAsyncHandler] ${structureError.message}. Loaded module:`,
							module
						)
						setError(structureError)
					}
					setLoading(false)
				}
			} catch (err) {
				console.error(
					`[useAsyncHandler] Failed to load handler for ${componentType} from ${handlerInfo.path}:`,
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

	return { handlerModule, loading, error }
}

export default useAsyncHandler
