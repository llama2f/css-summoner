// templates/handlers/auto/form.jsx

import React from 'react'
import { createHandlerResult, combineClasses } from '../common'

// メタデータ（必須）
export const metadata = {
	type: 'form',
	category: 'forms',
	description: '様々なフォーム入力要素コンポーネント',
}

// 基本レンダラー（必須） - デフォルトは input
export function render(props) {
	const {
		classString = '',
		label = 'ラベル',
		placeholder = 'テキストを入力',
		id = 'sample-input',
		baseClass = 'form-input',
		selectedModifiers, // 明示的に分離
		children, // 明示的に分離
		...domProps // DOM要素に渡す安全なプロパティのみ
	} = props

	// baseClassとclassStringを結合
	const finalClassString = combineClasses({
		baseClass,
		additional: classString,
	})

	const reactElement = (
		<div className="form-field">
			<label htmlFor={id} className='form-label'>
				{label}
			</label>
			<input
				id={id}
				type='text'
				className={finalClassString}
				placeholder={placeholder}
				{...domProps}
			/>
		</div>
	)

	return createHandlerResult(reactElement)
}

// バリアント特化処理
export const variants = {
	// Input (基本レンダラーと同じだが、明示的に定義)
	'form-input': (props) => {
		const {
			classString = '',
			label = 'ラベル',
			placeholder = 'テキストを入力',
			id = 'sample-input',
			type = 'text',
			baseClass = 'form-input',
			selectedModifiers, // 明示的に分離
			children, // 明示的に分離
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className="form-field">
				<label htmlFor={id} className='form-label'>
					{label}
				</label>
				<input
					id={id}
					type={type}
					className={finalClassString}
					placeholder={placeholder}
					{...domProps}
				/>
			</div>
		)

		return createHandlerResult(reactElement)
	},

	// Select
	'form-select': (props) => {
		const {
			classString = '',
			label = 'ラベル',
			id = 'sample-select',
			baseClass = 'form-select',
			selectedModifiers, // 明示的に分離
			children, // 明示的に分離
			options = [
				{ value: '', label: '項目を選択' },
				{ value: '1', label: '選択肢1' },
				{ value: '2', label: '選択肢2' },
				{ value: '3', label: '選択肢3' },
			],
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactOptions = options.map((opt) => (
			<option key={opt.value} value={opt.value}>
				{opt.label}
			</option>
		))

		const reactElement = (
			<div className="form-field">
				<label htmlFor={id} className='form-label'>
					{label}
				</label>
				<select id={id} className={finalClassString} {...domProps}>
					{reactOptions}
				</select>
			</div>
		)

		return createHandlerResult(reactElement)
	},

	// Checkbox
	'form-checkbox': (props) => {
		const {
			classString = '',
			label = 'チェックボックスラベル',
			id = 'sample-checkbox',
			baseClass = 'form-checkbox',
			selectedModifiers, // 明示的に分離
			children, // 明示的に分離
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className='form-field-inline'>
				<input 
					id={id} 
					type='checkbox' 
					className={finalClassString} 
					{...domProps}
				/>
				<label htmlFor={id} className='form-label-inline'>
					{label}
				</label>
			</div>
		)

		return createHandlerResult(reactElement)
	},

	// Radio
	'form-radio': (props) => {
		const {
			classString = '',
			label = 'ラジオボタンラベル',
			id = 'sample-radio',
			name = 'sample-radio-group',
			baseClass = 'form-radio',
			selectedModifiers, // 明示的に分離
			children, // 明示的に分離
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className='form-field-inline'>
				<input 
					id={id} 
					type='radio' 
					name={name} 
					className={finalClassString} 
					{...domProps}
				/>
				<label htmlFor={id} className='form-label-inline'>
					{label}
				</label>
			</div>
		)

		return createHandlerResult(reactElement)
	},

	// Textarea
	'form-textarea': (props) => {
		const {
			classString = '',
			label = 'テキストエリアラベル',
			placeholder = '複数行のテキストを入力',
			id = 'sample-textarea',
			rows = '4',
			baseClass = 'form-textarea',
			selectedModifiers, // 明示的に分離
			children, // 明示的に分離
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className="form-field">
				<label htmlFor={id} className='form-label'>
					{label}
				</label>
				<textarea
					id={id}
					className={finalClassString}
					rows={rows}
					placeholder={placeholder}
					{...domProps}
				/>
			</div>
		)

		return createHandlerResult(reactElement)
	},

	// Search
	'form-search': (props) => {
		const {
			classString = '',
			label = '検索',
			placeholder = '検索キーワードを入力',
			id = 'sample-search',
			baseClass = 'form-search',
			selectedModifiers, // 明示的に分離
			children, // 明示的に分離
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className="form-field">
				<label htmlFor={id} className='form-label'>
					{label}
				</label>
				<div className='form-search-container'>
					<input
						id={id}
						type='search'
						className={finalClassString}
						placeholder={placeholder}
						{...domProps}
					/>
					<span className='form-search-icon'>🔍</span>
				</div>
			</div>
		)

		return createHandlerResult(reactElement)
	},

	// Switch
	'form-switch': (props) => {
		const {
			classString = '',
			label = 'スイッチラベル',
			id = 'sample-switch',
			baseClass = 'form-switch',
			selectedModifiers, // 明示的に分離
			children, // 明示的に分離
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className='form-field-inline'>
				<div className='form-switch-container'>
					<input 
						type='checkbox' 
						className='form-switch-input' 
						id={id} 
						{...domProps}
					/>
					<label className='form-switch-label' htmlFor={id}></label>
				</div>
				<label htmlFor={id} className='form-label-inline'>
					{label}
				</label>
			</div>
		)

		return createHandlerResult(reactElement)
	},

	// Feedback
	'form-feedback': (props) => {
		const {
			classString = '',
			baseClass = 'form-feedback',
			selectedModifiers, // 明示的に分離
			children, // 明示的に分離
			...domProps // DOM要素に渡す安全なプロパティのみ
		} = props

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div {...domProps}>
				<div className={`${finalClassString} color-success form-feedback-item`}>
					正常な入力です (Success)
				</div>
				<div className={`${finalClassString} color-error form-feedback-item`}>
					エラー: 入力が不正です (Error)
				</div>
			</div>
		)

		return createHandlerResult(reactElement)
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
