// handlers/formHandlers.jsx
// フォーム関連コンポーネントのハンドラー

import React from 'react'
import { createHandlerResult } from './common'

// フォーム入力ハンドラー
export const formInputHandler = (options) => {
	const { classString = '' } = options

	const reactElement = (
		<div>
			<label htmlFor='sample-input' className='block mb-2'>
				labelテキスト
			</label>
			<input
				id='sample-input'
				type='text'
				className={classString}
				placeholder='テキストを入力'
			/>
		</div>
	)

	const htmlString = `<div>
  <label for="sample-input" class="block mb-2">labelテキスト</label>
  <input id="sample-input" type="text" class="${classString}" placeholder="テキストを入力" />
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// セレクトボックスハンドラー
export const formSelectHandler = (options) => {
	const { classString = '' } = options

	const reactElement = (
		<div>
			<label htmlFor='sample-select' className='block mb-2'>
				labelテキスト
			</label>
			<select id='sample-select' className={classString}>
				<option value=''>項目を選択</option>
				<option value='1'>選択肢1</option>
				<option value='2'>選択肢2</option>
				<option value='3'>選択肢3</option>
			</select>
		</div>
	)

	const htmlString = `<div>
  <label for="sample-select" class="block mb-2">labelテキスト</label>
  <select id="sample-select" class="${classString}">
    <option value="">項目を選択</option>
    <option value="1">選択肢1</option>
    <option value="2">選択肢2</option>
    <option value="3">選択肢3</option>
  </select>
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// チェックボックスハンドラー
export const formCheckboxHandler = (options) => {
	const { classString = '' } = options

	const reactElement = (
		<div className='flex items-center'>
			<input id='sample-checkbox' type='checkbox' className={classString} />
			<label htmlFor='sample-checkbox' className='ml-2'>
				チェックボックスlabel
			</label>
		</div>
	)

	const htmlString = `<div class="flex items-center">
  <input id="sample-checkbox" type="checkbox" class="${classString}" />
  <label for="sample-checkbox" class="ml-2">チェックボックスlabel</label>
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// ラジオボタンハンドラー
export const formRadioHandler = (options) => {
	const { classString = '' } = options

	const reactElement = (
		<div className='flex items-center'>
			<input
				id='sample-radio'
				type='radio'
				name='sample-radio-group'
				className={classString}
			/>
			<label htmlFor='sample-radio' className='ml-2'>
				ラジオボタンlabel
			</label>
		</div>
	)

	const htmlString = `<div class="flex items-center">
  <input id="sample-radio" type="radio" name="sample-radio-group" class="${classString}" />
  <label for="sample-radio" class="ml-2">ラジオボタンlabel</label>
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// テキストエリアハンドラー
export const formTextareaHandler = (options) => {
	const { classString = '' } = options

	const reactElement = (
		<div>
			<label htmlFor='sample-textarea' className='block mb-2'>
				テキストエリアラベル
			</label>
			<textarea
				id='sample-textarea'
				className={classString}
				rows='4'
				placeholder='複数行のテキストを入力'
			></textarea>
		</div>
	)

	const htmlString = `<div>
  <label for="sample-textarea" class="block mb-2">テキストエリアラベル</label>
  <textarea id="sample-textarea" class="${classString}" rows="4" placeholder="複数行のテキストを入力"></textarea>
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// 検索フォームハンドラー
export const formSearchHandler = (options) => {
	const { classString = '' } = options

	const reactElement = (
		<div>
			<label htmlFor='sample-search' className='block mb-2'>
				検索
			</label>
			<div className='relative'>
				<input
					id='sample-search'
					type='search'
					className={classString}
					placeholder='検索キーワードを入力'
				/>
				<span className='absolute right-3 top-1/2 transform -translate-y-1/2'>
					🔍
				</span>
			</div>
		</div>
	)

	const htmlString = `<div>
  <label for="sample-search" class="block mb-2">検索</label>
  <div class="relative">
    <input id="sample-search" type="search" class="${classString}" placeholder="検索キーワードを入力" />
    <span class="absolute right-3 top-1/2 transform -translate-y-1/2">🔍</span>
  </div>
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// スイッチハンドラー
export const formSwitchHandler = (options) => {
	const { classString = '' } = options

	const reactElement = (
		<div className='flex items-center'>
			<div className={`form-switch ${classString}`}>
				<input type='checkbox' className='form-switch-input' id='sample-switch' />
				<label className='form-switch-label' htmlFor='sample-switch'></label>
			</div>
			<label htmlFor='sample-switch' className='ml-2'>
				スイッチラベル
			</label>
		</div>
	)

	const htmlString = `<div class="flex items-center">
  <div class="form-switch ${classString}">
    <input type="checkbox" class="form-switch-input" id="sample-switch" />
    <label class="form-switch-label" for="sample-switch"></label>
  </div>
  <label for="sample-switch" class="ml-2">スイッチラベル</label>
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// フォームフィードバックハンドラー
export const formFeedbackHandler = (options) => {
	const { classString = '' } = options

	const reactElement = (
		<div>
			<div className={`form-feedback is-valid ${classString} mb-2`}>
				正常な入力です
			</div>
			<div className={`form-feedback is-invalid ${classString}`}>
				エラー: 入力が不正です
			</div>
		</div>
	)

	const htmlString = `<div>
  <div class="form-feedback is-valid ${classString} mb-2">正常な入力です</div>
  <div class="form-feedback is-invalid ${classString}">エラー: 入力が不正です</div>
</div>`

	return createHandlerResult(reactElement, htmlString)
}

// フォームハンドラー用パターンマッチング
export const formPatternHandler = {
	'^form-input': formInputHandler,
	'^form-select': formSelectHandler,
	'^form-checkbox': formCheckboxHandler,
	'^form-radio': formRadioHandler,
	'^form-textarea': formTextareaHandler,
	'^form-search': formSearchHandler,
	'^form-switch': formSwitchHandler,
	'^form-feedback': formFeedbackHandler,
	// 汎用的マッチングは最後に置く
	'^form': formInputHandler
}

// フォームハンドラーマップ
export const formHandlers = {
	'form-input': formInputHandler,
	'form-select': formSelectHandler,
	'form-checkbox': formCheckboxHandler,
	'form-radio': formRadioHandler,
	'form-textarea': formTextareaHandler,
	'form-search': formSearchHandler,
	'form-switch': formSwitchHandler,
	'form-feedback': formFeedbackHandler
}
