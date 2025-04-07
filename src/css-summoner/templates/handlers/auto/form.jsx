// templates/handlers/auto/form.jsx

import React from 'react'
import { createHandlerResult } from '../common'

// メタデータ（必須）
export const metadata = {
	type: 'form',
	category: 'forms',
	description: '様々なフォーム入力要素コンポーネント',
}

// 基本レンダラー（必須） - デフォルトは input
export function render(props) {
	const {
		classString = 'form-input', // デフォルトクラス
		label = 'ラベル',
		placeholder = 'テキストを入力',
		id = 'sample-input',
	} = props

	const reactElement = (
		<div>
			<label htmlFor={id} className='block mb-2'>
				{label}
			</label>
			<input
				id={id}
				type='text'
				className={classString}
				placeholder={placeholder}
			/>
		</div>
	)

	const htmlString = `<div>
  <label for="${id}" class="block mb-2">${label}</label>
  <input id="${id}" type="text" class="${classString}" placeholder="${placeholder}" />
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// バリアント特化処理
export const variants = {
	// Input (基本レンダラーと同じだが、明示的に定義)
	'form-input': (props) => {
		// プレフィックス追加
		const {
			classString = 'form-input',
			label = 'ラベル',
			placeholder = 'テキストを入力',
			id = 'sample-input',
			type = 'text', // type を props で受け取れるように
		} = props

		const reactElement = (
			<div>
				<label htmlFor={id} className='block mb-2'>
					{label}
				</label>
				<input
					id={id}
					type={type}
					className={classString}
					placeholder={placeholder}
				/>
			</div>
		)

		const htmlString = `<div>
	 <label for="${id}" class="block mb-2">${label}</label>
	 <input id="${id}" type="${type}" class="${classString}" placeholder="${placeholder}" />
</div>`
		return createHandlerResult(reactElement, htmlString)
	},

	// Select
	'form-select': (props) => {
		// プレフィックス追加
		const {
			classString = 'form-select',
			label = 'ラベル',
			id = 'sample-select',
			options = [
				// 固定オプション
				{ value: '', label: '項目を選択' },
				{ value: '1', label: '選択肢1' },
				{ value: '2', label: '選択肢2' },
				{ value: '3', label: '選択肢3' },
			],
		} = props

		const reactOptions = options.map((opt) => (
			<option key={opt.value} value={opt.value}>
				{opt.label}
			</option>
		))

		const htmlOptions = options
			.map((opt) => `    <option value="${opt.value}">${opt.label}</option>`)
			.join('\n')

		const reactElement = (
			<div>
				<label htmlFor={id} className='block mb-2'>
					{label}
				</label>
				<select id={id} className={classString}>
					{reactOptions}
				</select>
			</div>
		)

		const htmlString = `<div>
	 <label for="${id}" class="block mb-2">${label}</label>
	 <select id="${id}" class="${classString}">
${htmlOptions}
	 </select>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},

	// Checkbox
	'form-checkbox': (props) => {
		// プレフィックス追加
		const {
			classString = 'form-checkbox',
			label = 'チェックボックスラベル',
			id = 'sample-checkbox',
		} = props

		const reactElement = (
			<div className='flex items-center'>
				<input id={id} type='checkbox' className={classString} />
				<label htmlFor={id} className='ml-2'>
					{label}
				</label>
			</div>
		)

		const htmlString = `<div class="flex items-center">
	 <input id="${id}" type="checkbox" class="${classString}" />
	 <label for="${id}" class="ml-2">${label}</label>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},

	// Radio
	'form-radio': (props) => {
		// プレフィックス追加
		const {
			classString = 'form-radio',
			label = 'ラジオボタンラベル',
			id = 'sample-radio',
			name = 'sample-radio-group',
		} = props

		const reactElement = (
			<div className='flex items-center'>
				<input id={id} type='radio' name={name} className={classString} />
				<label htmlFor={id} className='ml-2'>
					{label}
				</label>
			</div>
		)

		const htmlString = `<div class="flex items-center">
	 <input id="${id}" type="radio" name="${name}" class="${classString}" />
	 <label for="${id}" class="ml-2">${label}</label>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},

	// Textarea
	'form-textarea': (props) => {
		// プレフィックス追加
		const {
			classString = 'form-textarea',
			label = 'テキストエリアラベル',
			placeholder = '複数行のテキストを入力',
			id = 'sample-textarea',
			rows = '4',
		} = props

		const reactElement = (
			<div>
				<label htmlFor={id} className='block mb-2'>
					{label}
				</label>
				<textarea
					id={id}
					className={classString}
					rows={rows}
					placeholder={placeholder}
				/>
			</div>
		)

		const htmlString = `<div>
	 <label for="${id}" class="block mb-2">${label}</label>
	 <textarea id="${id}" class="${classString}" rows="${rows}" placeholder="${placeholder}"></textarea>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},

	// Search (カスタムレンダリング)
	'form-search': (props) => {
		// プレフィックス追加
		const {
			classString = 'form-input form-search', // 複数クラス
			label = '検索',
			placeholder = '検索キーワードを入力',
			id = 'sample-search',
		} = props

		const reactElement = (
			<div>
				<label htmlFor={id} className='block mb-2'>
					{label}
				</label>
				<div className='relative'>
					<input
						id={id}
						type='search'
						className={classString}
						placeholder={placeholder}
					/>
					<span className='absolute right-3 top-1/2 transform -translate-y-1/2'>
						🔍
					</span>
				</div>
			</div>
		)

		const htmlString = `<div>
	 <label for="${id}" class="block mb-2">${label}</label>
	 <div class="relative">
	   <input id="${id}" type="search" class="${classString}" placeholder="${placeholder}" />
	   <span class="absolute right-3 top-1/2 transform -translate-y-1/2">🔍</span>
	 </div>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},

	// Switch (カスタムレンダリング)
	'form-switch': (props) => {
		// プレフィックス追加
		const {
			classString = '', // form-switch はコンテナに付与
			label = 'スイッチラベル',
			id = 'sample-switch',
		} = props

		const reactElement = (
			<div className='flex items-center'>
				<div className={`form-switch ${classString}`}>
					<input type='checkbox' className='form-switch-input' id={id} />
					<label className='form-switch-label' htmlFor={id}></label>
				</div>
				<label htmlFor={id} className='ml-2'>
					{label}
				</label>
			</div>
		)

		const htmlString = `<div class="flex items-center">
	 <div class="form-switch ${classString}">
	   <input type="checkbox" class="form-switch-input" id="${id}" />
	   <label class="form-switch-label" for="${id}"></label>
	 </div>
	 <label for="${id}" class="ml-2">${label}</label>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},

	// Feedback (カスタムレンダリング)
	'form-feedback': (props) => {
		// プレフィックス追加
		const { classString = 'form-feedback' } = props

		const reactElement = (
			<div>
				{/* CSS変更に合わせて color-* クラスを使用 */}
				<div className={`${classString} color-success mb-2`}>
					正常な入力です (Success)
				</div>
				<div className={`${classString} color-error`}>
					エラー: 入力が不正です (Error)
				</div>
			</div>
		)

		const htmlString = `<div>
	 <div class="${classString} color-success mb-2">正常な入力です (Success)</div>
	 <div class="${classString} color-error">エラー: 入力が不正です (Error)</div>
</div>`
		return createHandlerResult(reactElement, htmlString)
	},
}

// プレビュー用サンプル
export const samples = {
	default: '入力 (Input)',
	input: '入力 (Input)',
	select: '選択 (Select)',
	checkbox: 'チェックボックス',
	radio: 'ラジオボタン',
	textarea: 'テキストエリア',
	search: '検索フォーム',
	switch: 'スイッチ',
	feedback: 'フィードバック',
}

// デフォルトエクスポート
export default {
	metadata,
	render,
	variants,
	samples,
}
