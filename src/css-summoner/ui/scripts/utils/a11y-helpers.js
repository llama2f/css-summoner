/**
 * アクセシビリティヘルパー関数集
 * キーボード操作やARIAに関連するユーティリティを提供します。
 */

/**
 * 特定のキーが押されたときに処理を実行するユーティリティ
 * @param {Element} element - イベントを登録する要素
 * @param {string|string[]} keys - 対象のキー名（例: 'Enter'）または複数のキー名の配列
 * @param {Function} callback - 実行する関数
 * @param {Object} options - イベントリスナーのオプション
 */
export function onKeyPress(element, keys, callback, options = {}) {
	if (!element) return

	const keysArray = Array.isArray(keys) ? keys : [keys]

	element.addEventListener(
		'keydown',
		(event) => {
			if (keysArray.includes(event.key)) {
				callback(event)
			}
		},
		options
	)
}

/**
 * フォーカストラップを設定する
 * モーダルやドロップダウンなどで、特定の領域内にフォーカスを閉じ込める
 * @param {Element} container - フォーカスを閉じ込める要素
 * @param {Function} onEscape - ESCキーが押されたときのコールバック
 */
export function trapFocus(container, onEscape) {
	if (!container) return

	const focusableElements = container.querySelectorAll(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
	)

	const firstElement = focusableElements[0]
	const lastElement = focusableElements[focusableElements.length - 1]

	// 最初の要素にフォーカスを設定
	firstElement?.focus()

	container.addEventListener('keydown', (event) => {
		// ESCキーでトラップを解除
		if (event.key === 'Escape' && onEscape) {
			onEscape(event)
			return
		}

		// TABキーでフォーカス移動を制御
		if (event.key === 'Tab') {
			if (event.shiftKey && document.activeElement === firstElement) {
				// Shift+TABで最初の要素にいる場合、最後の要素にフォーカス
				event.preventDefault()
				lastElement?.focus()
			} else if (!event.shiftKey && document.activeElement === lastElement) {
				// TABで最後の要素にいる場合、最初の要素にフォーカス
				event.preventDefault()
				firstElement?.focus()
			}
		}
	})
}

/**
 * 要素が表示されたときにアナウンスする（スクリーンリーダー用）
 * @param {string} message - アナウンスするメッセージ
 */
export function announce(message) {
	let announcer = document.getElementById('a11y-announcer')

	if (!announcer) {
		announcer = document.createElement('div')
		announcer.id = 'a11y-announcer'
		announcer.setAttribute('aria-live', 'polite')
		announcer.setAttribute('aria-atomic', 'true')
		announcer.className = 'sr-only' // 視覚的には非表示
		document.body.appendChild(announcer)
	}

	announcer.textContent = message
}
