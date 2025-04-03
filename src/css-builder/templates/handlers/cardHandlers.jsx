// handlers/cardHandlers.jsx
// カード関連コンポーネントのハンドラー

import React from 'react'
import { createHandlerResult } from './common'

// 通常カードハンドラー
export const cardHandler = (options) => {
  const { classString = '' } = options

  const reactElement = (
    <div className={classString} style={{ maxWidth: '300px' }}>
      <div className='card-header'>
        <h3 className='card-title'>カードタイトル</h3>
        <p className='card-subtitle'>サブタイトル</p>
      </div>
      <div className='card-body'>
        <p>
          カードのコンテンツがここに入ります。テキストや画像など、様々なコンテンツを含めることができます。
        </p>
      </div>
      <div className='card-footer'>
        <div className='card-actions'>
          <button className='btn-primary btn-sm'>アクション</button>
        </div>
      </div>
    </div>
  )

  const htmlString = `<div class="${classString} max-w-sm">
  <div class="card-header">
    <h3 class="card-title">カードタイトル</h3>
    <p class="card-subtitle">サブタイトル</p>
  </div>
  <div class="card-body">
    <p>カードのコンテンツがここに入ります。テキストや画像など、様々なコンテンツを含めることができます。</p>
  </div>
  <div class="card-footer">
    <div class="card-actions">
      <button class="btn-primary btn-sm">アクション</button>
    </div>
  </div>
</div>`

  return createHandlerResult(reactElement, htmlString)
}

// カードハンドラー
export const cardTitleHandler = (options) => {
  console.log('cardTitleHandler called with options:', options); // デバッグログ追加
  const { classString = '' } = options

  const reactElement = (
    <div className='card' style={{ maxWidth: '300px' }}>
      <div className='card-header'>
        <h3 className={`card-title ${classString}`}>カードタイトル</h3>
        <p className='card-subtitle'>サブタイトル</p>
      </div>
      <div className='card-body'>
        <p>
          カードのコンテンツがここに入ります。テキストや画像など、様々なコンテンツを含めることができます。
        </p>
      </div>
      <div className='card-footer'>
        <div className='card-actions'>
          <button className='btn-primary btn-sm'>アクション</button>
        </div>
      </div>
    </div>
  )

  const htmlString = `<div class="card max-w-sm">
  <div class="card-header">
    <h3 class="card-title ${classString}">カードタイトル</h3>
    <p class="card-subtitle">サブタイトル</p>
  </div>
  <div class="card-body">
    <p>カードのコンテンツがここに入ります。テキストや画像など、様々なコンテンツを含めることができます。</p>
  </div>
  <div class="card-footer">
    <div class="card-actions">
      <button class="btn-primary btn-sm">アクション</button>
    </div>
  </div>
</div>`

  console.log('cardTitleHandler reactElement:', reactElement); // デバッグログ追加
  console.log('cardTitleHandler htmlString:', htmlString); // デバッグログ追加
  return createHandlerResult(reactElement, htmlString)
}

// 横並びカードハンドラー
export const cardHorizontalHandler = (options) => {
  const { classString = '' } = options

  const reactElement = (
    <div className={classString} style={{ maxWidth: '300px' }}>
      <div className='card-image bg-primary-light flex items-center justify-center h-24'>
        <span className='text-2xl'>🖼️</span>
      </div>
      <div className='card-body'>
        <h3 className='card-title'>横並びカード</h3>
        <p>カードのコンテンツです。</p>
      </div>
    </div>
  )

  const htmlString = `<div class="${classString} max-w-md">
  <div class="card-image bg-primary-light flex items-center justify-center">
    <img src="/path/to/image.jpg" alt="画像の説明" class="object-cover h-full w-full" />
  </div>
  <div class="card-body">
    <h3 class="card-title">横並びカード</h3>
    <p>カードのコンテンツです。</p>
  </div>
</div>`

  return createHandlerResult(reactElement, htmlString)
}

// エクスポートするハンドラーマップ
export const cardHandlers = {
  'card': cardHandler,
  'card-title': cardTitleHandler,
  'card-horizontal': cardHorizontalHandler
}
