// templates/handlers/auto/form.jsx

import React from 'react'
import { createHandlerResult, combineClasses, separateProps } from '../common' // separateProps をインポート

// メタデータ（必須）
export const metadata = {
	type: 'form',
	category: 'forms',
	description: '様々なフォーム入力要素コンポーネント',
}

// 基本レンダラー（必須） - デフォルトは input
export function render(props) {
	// プロパティ分離
	const { reactProps, domProps, commonProps } = separateProps(
		props,
		[
			'classString',
			'label',
			'placeholder',
			'baseClass',
			'selectedModifiers',
			'children',
		], // Reactプロパティ
		['id', 'type'] // DOM要素プロパティ (input要素でよく使うもの)
	)

	// Reactプロパティから必要な値を取得
	const {
		classString = '',
		label = 'ラベル',
		placeholder = 'テキストを入力',
		baseClass = 'form-input',
	} = reactProps

	// DOMプロパティから必要な値を取得 (idは必須なのでデフォルトを設定)
	const { id = 'sample-input', type = 'text', ...restDomProps } = domProps

	// baseClassとclassStringを結合
	const finalClassString = combineClasses({
		baseClass,
		additional: classString,
	})

	const reactElement = (
		<div className='form-field'>
			<label htmlFor={id} className='form-label'>
				{label}
			</label>
			<input
				id={id}
				type='text'
				className={finalClassString}
				placeholder={placeholder}
				{...restDomProps}
				{...commonProps}
			/>
		</div>
	)

	return createHandlerResult(reactElement)
}

// バリアント特化処理
export const variants = {
	// Input (基本レンダラーと同じだが、明示的に定義)
	'form-input': (props) => {
		// プロパティ分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			[
				'classString',
				'label',
				'placeholder',
				'baseClass',
				'selectedModifiers',
				'children',
			], // Reactプロパティ
			['id', 'type'] // DOM要素プロパティ
		)

		// Reactプロパティから必要な値を取得
		const {
			classString = '',
			label = 'ラベル',
			placeholder = 'テキストを入力',
			baseClass = 'form-input',
		} = reactProps

		// DOMプロパティから必要な値を取得
		const { id = 'sample-input', type = 'text', ...restDomProps } = domProps

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className='form-field'>
				<label htmlFor={id} className='form-label'>
					{label}
				</label>
				<input
					id={id}
					type={type}
					className={finalClassString}
					placeholder={placeholder}
					{...restDomProps}
					{...commonProps}
				/>
			</div>
		)

		return createHandlerResult(reactElement)
	},

	// Select
	'form-select': (props) => {
		// プロパティ分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			[
				'classString',
				'label',
				'baseClass',
				'selectedModifiers',
				'children',
				'options',
			], // Reactプロパティ
			['id'] // DOM要素プロパティ
		)

		// Reactプロパティから必要な値を取得
		const {
			classString = '',
			label = 'ラベル',
			baseClass = 'form-select',
			options = [
				{ value: '', label: '項目を選択' },
				{ value: '1', label: '選択肢1' },
				{ value: '2', label: '選択肢2' },
				{ value: '3', label: '選択肢3' },
			],
		} = reactProps

		// DOMプロパティから必要な値を取得
		const { id = 'sample-select', ...restDomProps } = domProps

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
			<div className='form-field'>
				<label htmlFor={id} className='form-label'>
					{label}
				</label>
				<select
					id={id}
					className={finalClassString}
					{...restDomProps}
					{...commonProps}
				>
					{reactOptions}
				</select>
			</div>
		)

		return createHandlerResult(reactElement)
	},

	// Checkbox
	'form-checkbox': (props) => {
		// プロパティ分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			['classString', 'label', 'baseClass', 'selectedModifiers', 'children'], // Reactプロパティ
			['id', 'type'] // DOM要素プロパティ
		)

		// Reactプロパティから必要な値を取得
		const {
			classString = '',
			label = 'チェックボックスラベル',
			baseClass = 'form-checkbox',
		} = reactProps

		// DOMプロパティから必要な値を取得
		const {
			id = 'sample-checkbox',
			type = 'checkbox',
			...restDomProps
		} = domProps

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
					{...restDomProps}
					{...commonProps}
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
		// プロパティ分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			['classString', 'label', 'baseClass', 'selectedModifiers', 'children'], // Reactプロパティ
			['id', 'type', 'name'] // DOM要素プロパティ
		)

		// Reactプロパティから必要な値を取得
		const {
			classString = '',
			label = 'ラジオボタンラベル',
			baseClass = 'form-radio',
		} = reactProps

		// DOMプロパティから必要な値を取得
		const {
			id = 'sample-radio',
			type = 'radio',
			name = 'sample-radio-group',
			...restDomProps
		} = domProps

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
					{...restDomProps}
					{...commonProps}
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
		// プロパティ分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			[
				'classString',
				'label',
				'placeholder',
				'baseClass',
				'selectedModifiers',
				'children',
			], // Reactプロパティ
			['id', 'rows'] // DOM要素プロパティ
		)

		// Reactプロパティから必要な値を取得
		const {
			classString = '',
			label = 'テキストエリアラベル',
			placeholder = '複数行のテキストを入力',
			baseClass = 'form-textarea',
		} = reactProps

		// DOMプロパティから必要な値を取得
		const { id = 'sample-textarea', rows = '4', ...restDomProps } = domProps

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className='form-field'>
				<label htmlFor={id} className='form-label'>
					{label}
				</label>
				<textarea
					id={id}
					className={finalClassString}
					rows={rows}
					placeholder={placeholder}
					{...restDomProps}
					{...commonProps}
				/>
			</div>
		)

		return createHandlerResult(reactElement)
	},

	// Search
	'form-search': (props) => {
		// プロパティ分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			[
				'classString',
				'label',
				'placeholder',
				'baseClass',
				'selectedModifiers',
				'children',
			], // Reactプロパティ
			['id', 'type'] // DOM要素プロパティ
		)

		// Reactプロパティから必要な値を取得
		const {
			classString = '',
			label = '検索',
			placeholder = '検索キーワードを入力',
			baseClass = 'form-search',
		} = reactProps

		// DOMプロパティから必要な値を取得
		const { id = 'sample-search', type = 'search', ...restDomProps } = domProps

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className='form-field'>
				<label htmlFor={id} className='form-label'>
					{label}
				</label>
				<div className='form-search-container'>
					<input
						id={id}
						type='search'
						className={finalClassString}
						placeholder={placeholder}
						{...restDomProps}
						{...commonProps}
					/>
					<span className='form-search-icon'>🔍</span>
				</div>
			</div>
		)

		return createHandlerResult(reactElement)
	},

	// Switch
	'form-switch': (props) => {
		// プロパティ分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			['classString', 'label', 'baseClass', 'selectedModifiers', 'children'], // Reactプロパティ
			['id', 'type'] // DOM要素プロパティ (input要素用)
		)

		// Reactプロパティから必要な値を取得
		const {
			classString = '', // スイッチコンテナ用クラス
			label = 'スイッチラベル',
			baseClass = 'form-switch', // スイッチコンテナ用ベースクラス
		} = reactProps

		// DOMプロパティから必要な値を取得 (input要素用)
		const {
			id = 'sample-switch',
			type = 'checkbox',
			...restDomProps
		} = domProps

		// スイッチコンテナのクラスを結合 (baseClassはここで使う)
		const containerClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div className='form-field-inline'>
				<div className={containerClassString}>
					<input
						type={type}
						className='form-switch-input'
						id={id}
						{...restDomProps}
						{...commonProps}
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
		// プロパティ分離
		const { reactProps, domProps, commonProps } = separateProps(
			props,
			['classString', 'baseClass', 'selectedModifiers', 'children'], // Reactプロパティ
			[] // DOM要素プロパティ (コンテナdiv用)
		)

		// Reactプロパティから必要な値を取得
		const { classString = '', baseClass = 'form-feedback' } = reactProps

		// baseClassとclassStringを結合
		const finalClassString = combineClasses({
			baseClass,
			additional: classString,
		})

		const reactElement = (
			<div {...domProps} {...commonProps}>
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
