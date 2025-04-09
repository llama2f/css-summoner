/**
 * @file src/css-summoner/ui/hooks/useAsyncHandler.jsx
 * @description 指定されたコンポーネントタイプに対応するハンドラーモジュールを
 *              `handler-manifest.json` に基づいて非同期に動的インポートするカスタムフック。
 *              ハンドラーモジュールのロード状態 (ロード中、成功、エラー) を管理し、
 *              ロードされたモジュール (またはエラー情報) を返します。
 *
 * @imports
 * - useState, useEffect from 'react'
 * - handlersManifest from '@/css-summoner/configs/handler-manifest.json' (コンポーネントタイプとハンドラーファイルパスのマッピング)
 *
 * @param {string} componentType - ロードしたいハンドラーに対応するコンポーネントタイプ名。
 * @returns {{ handlerModule: object | null, loading: boolean, error: Error | null }}
 *   - `handlerModule`: 正常にロードされたハンドラーモジュール (通常は default export)。ロード中またはエラー時は `null`。
 *   - `loading`: ハンドラーモジュールのロード中を示すブール値フラグ。
 *   - `error`: ロード中に発生したエラーオブジェクト。エラーがない場合は `null`。
 *
 * @exports useAsyncHandler - このカスタムフック。
 */
import { useState, useEffect } from 'react'

// Vite/Astro の機能を使って、指定されたパターンのモジュールを動的にインポートする準備
// キーはファイルパス (例: '/src/css-summoner/ui/templates/handlers/auto/button.jsx')
// 値は () => import('...') 形式の非同期関数
const handlerModules = import.meta.glob(
	'/src/css-summoner/ui/templates/handlers/auto/*.jsx'
)

function useAsyncHandler(componentType) {
	// --- 状態管理 (useState) ---
	// ロードされたハンドラーモジュールを保持する状態
	const [handlerModule, setHandlerModule] = useState(null)
	// ロード中かどうかを示すフラグの状態 (初期値はtrue)
	const [loading, setLoading] = useState(true)
	// ロード中に発生したエラーオブジェクトを保持する状態
	const [error, setError] = useState(null)

	// --- 副作用フック (useEffect) ---
	/**
	 * `componentType` が変更されたときにハンドラーモジュールを非同期でロードする副作用。
	 */
	useEffect(() => {
		let isMounted = true // コンポーネントがアンマウントされたか追跡するフラグ

		// 状態をリセット
		setLoading(true) // ロード開始
		setError(null) // エラーをクリア
		setHandlerModule(null) // 以前のモジュールをクリア

		// ハンドラーをロードする非同期関数
		const loadHandler = async () => {
			// componentType が指定されていない場合はロードしない
			if (!componentType) {
				if (isMounted) setLoading(false) // ロード終了
				return
			}

			// componentType から期待されるファイルパスを構築
			// 例: 'button' -> '/src/css-summoner/ui/templates/handlers/auto/button.jsx'
			const expectedPath = `/src/css-summoner/ui/templates/handlers/auto/${componentType}.jsx`

			// import.meta.glob の結果から対応するモジュールローダー関数を取得
			const moduleLoader = handlerModules[expectedPath]

			// 対応するローダー関数が見つからない場合
			if (!moduleLoader) {
				const notFoundError = new Error(
					`Handler module not found for type: ${componentType} (expected path: ${expectedPath})`
				)
				console.warn(`[useAsyncHandler] ${notFoundError.message}`)
				if (isMounted) {
					setError(notFoundError)
					setLoading(false)
				}
				return
			}

			// 動的インポートを実行
			try {
				// 取得したローダー関数を実行してモジュールを動的にインポート
				const module = await moduleLoader()

				// コンポーネントがまだマウントされている場合
				if (isMounted) {
					// モジュールが default export を持ち、かつ render または variants プロパティを持つか検証
					if (
						module.default &&
						(module.default.render || module.default.variants)
					) {
						// 正常なハンドラーモジュールとして状態を更新
						setHandlerModule(module.default)
					} else {
						// モジュールの構造が不正な場合のエラー
						const structureError = new Error(
							`Invalid handler module structure for type: ${componentType}. Expected default export with 'render' or 'variants'.`
						)
						console.error(
							`[useAsyncHandler] ${structureError.message}. Loaded module:`,
							module // 実際のモジュール内容をログに出力
						)
						setError(structureError) // エラー状態を設定
					}
					setLoading(false) // ロード終了
				}
			} catch (err) {
				// 動的インポート自体が失敗した場合 (ファイルが存在しない、構文エラーなど)
				console.error(
					`[useAsyncHandler] Failed to load handler for ${componentType} (path: ${expectedPath}):`,
					err
				)
				// コンポーネントがまだマウントされていれば、エラー状態を設定しロード終了
				if (isMounted) {
					setError(err)
					setLoading(false)
				}
			}
		}

		loadHandler() // ハンドラーロード関数を実行

		// クリーンアップ関数: コンポーネントがアンマウントされるときに isMounted フラグを false にする
		// これにより、アンマウント後の非同期処理完了時に状態を更新しようとすることを防ぐ
		return () => {
			isMounted = false
		}
	}, [componentType]) // componentType が変更されたときにこの副作用を再実行

	// --- 戻り値 ---
	// ロードされたモジュール、ロード状態、エラーオブジェクトを含むオブジェクトを返す
	return { handlerModule, loading, error }
}

// カスタムフックをデフォルトエクスポート
export default useAsyncHandler
