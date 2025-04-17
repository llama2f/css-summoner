// ui-controller.js
import { initAccordions } from './components/accordion-controller'

/**
 * すべてのUIコンポーネントを初期化
 */
export function initUI() {
	initAccordions()
	// ...他の初期化
}

// Export関数も維持しておくと、必要に応じて手動初期化も可能
export { initAccordions }
