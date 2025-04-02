// handlers/formHandlers.jsx
// フォーム関連コンポーネントのハンドラー

import React from 'react'
import { createHandlerResult } from './common'

// フォームハンドラー共通関数
export const formHandler = (options) => {
	const { classString = '', componentType } = options

	let reactElement, htmlString

	// フォーム入力
	if (componentType === 'form-input') {
		reactElement = (
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

		htmlString = `<div>
  <label for="sample-input" class="block mb-2">labelテキスト</label>
  <input id="sample-input" type="text" class="${classString}" placeholder="テキストを入力" />
</div>`
	}

	// セレクトボックス
	else if (componentType === 'form-select') {
		reactElement = (
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

		htmlString = `<div>
  <label for="sample-select" class="block mb-2">labelテキスト</label>
  <select id="sample-select" class="${classString}">
    <option value="">項目を選択</option>
    <option value="1">選択肢1</option>
    <option value="2">選択肢2</option>
    <option value="3">選択肢3</option>
  </select>
</div>`
	}

	// チェックボックス
	else if (componentType === 'form-checkbox') {
		reactElement = (
			<div className='flex items-center'>
				<input id='sample-checkbox' type='checkbox' className={classString} />
				<label htmlFor='sample-checkbox' className='ml-2'>
					チェックボックスlabel
				</label>
			</div>
		)

		htmlString = `<div class="flex items-center">
  <input id="sample-checkbox" type="checkbox" class="${classString}" />
  <label for="sample-checkbox" class="ml-2">チェックボックスlabel</label>
</div>`
	}

	// ラジオボタン
	else if (componentType === 'form-radio') {
		reactElement = (
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

		htmlString = `<div class="flex items-center">
  <input id="sample-radio" type="radio" name="sample-radio-group" class="${classString}" />
  <label for="sample-radio" class="ml-2">ラジオボタンlabel</label>
</div>`
	}

	// その他のフォーム要素のデフォルト処理
	else {
		reactElement = (
			<div>
				<label htmlFor='sample-form' className='block mb-2'>
					{componentType} label
				</label>
				<input
					id='sample-form'
					type='text'
					className={classString}
					placeholder={`${componentType} プレースホルダー`}
				/>
			</div>
		)

		htmlString = `<div>
  <label for="sample-form" class="block mb-2">${componentType} label</label>
  <input id="sample-form" type="text" class="${classString}" placeholder="${componentType} プレースホルダー" />
</div>`
	}

	return createHandlerResult(reactElement, htmlString)
}

// フォーム関連のパターンハンドラー
export const formPatternHandler = {
	'^form': formHandler,
}
