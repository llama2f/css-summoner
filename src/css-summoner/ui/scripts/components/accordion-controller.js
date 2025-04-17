// components/accordion-controller.js
import { onKeyPress } from '../utils/a11y-helpers.js'

/**
 * アコーディオンコンポーネントの初期化
 * @param {Element|Document} root - 検索のルート要素（省略時はdocument）
 */
export function initAccordions(root = document) {
	root.querySelectorAll('[data-accordion-toggle]').forEach((header) => {
		initSingleAccordion(header)
	})
}

/**
 * 個別のアコーディオンヘッダーを初期化
 */
function initSingleAccordion(header) {
	// 初期化済みチェック
	if (header.getAttribute('data-accordion-initialized') === 'true') {
		return
	}

	const content = header.nextElementSibling
	const item = header.closest('.accordion-item')

	header.setAttribute('data-accordion-initialized', 'true')

	// クリックイベントの追加
	header.addEventListener('click', () => toggleAccordion(header, content, item))

	// キーボード操作のサポート
	onKeyPress(header, ['Enter', ' '], (event) => {
		event.preventDefault()
		toggleAccordion(header, content, item)
	})
}

/**
 * アコーディオンの開閉を切り替える
 */
function toggleAccordion(header, content, item) {
	const expanded = header.getAttribute('aria-expanded') === 'true'
	const newExpandedState = !expanded

	// ARIA状態の更新
	header.setAttribute('aria-expanded', newExpandedState)

	if (content) {
		content.setAttribute('aria-hidden', !newExpandedState)

		// is-openクラスの切り替え
		if (newExpandedState) {
			item.classList.add('is-open')
			content.style.maxHeight = `${content.scrollHeight}px`
		} else {
			item.classList.remove('is-open')
			content.style.maxHeight = '0px'
		}
	}
}
