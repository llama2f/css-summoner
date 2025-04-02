// handlers/textHandlers.jsx
// テキスト関連コンポーネントのハンドラー

import React from 'react'
import { createHandlerResult } from './common'

// テキストハンドラー
export const textHandler = (options) => {
  const { classString = '', componentType } = options

  // デフォルトのテキストコンテンツ
  const sampleText = 'これは通常のテキストパラグラフのサンプルです。文章の長さはある程度必要ですので、少し長めの文章を入れています。マーカーや文字色、配置などの効果を確認できます。'

  // テキストタイプごとに適切なレンダリングを行う
  let reactElement, htmlString

  // テキストマーカー
  if (componentType.startsWith('text-marker')) {
    reactElement = <span className={classString}>{sampleText}</span>
    htmlString = `<span class="${classString}">${sampleText}</span>`
  }
  // テキスト下線
  else if (componentType.startsWith('text-underline')) {
    reactElement = <span className={classString}>{sampleText}</span>
    htmlString = `<span class="${classString}">${sampleText}</span>`
  }
  // テキスト取り消し線
  else if (componentType.startsWith('text-strikethrough')) {
    reactElement = <span className={classString}>{sampleText}</span>
    htmlString = `<span class="${classString}">${sampleText}</span>`
  }
  // テキストハイライト
  else if (componentType.startsWith('text-highlight')) {
    reactElement = <span className={classString}>{sampleText}</span>
    htmlString = `<span class="${classString}">${sampleText}</span>`
  }
  // テキストシャドウ
  else if (componentType.startsWith('text-shadow')) {
    reactElement = <span className={classString}>{sampleText}</span>
    htmlString = `<span class="${classString}">${sampleText}</span>`
  }
  // テキストぼかし
  else if (componentType === 'text-blur') {
    reactElement = <span className={classString}>{sampleText}</span>
    htmlString = `<span class="${classString}">${sampleText}</span>`
  }
  // テキストボーダー
  else if (componentType === 'text-bordered') {
    reactElement = <span className={classString}>{sampleText}</span>
    htmlString = `<span class="${classString}">${sampleText}</span>`
  }
  // セリフフォント
  else if (componentType === 'text-serif') {
    reactElement = <span className={classString}>{sampleText}</span>
    htmlString = `<span class="${classString}">${sampleText}</span>`
  }
  // 等幅フォント
  else if (componentType === 'text-monospace') {
    reactElement = <span className={classString}>{sampleText}</span>
    htmlString = `<span class="${classString}">${sampleText}</span>`
  }
  // 引用
  else if (componentType.startsWith('text-quote')) {
    reactElement = <blockquote className={classString}>{sampleText}</blockquote>
    htmlString = `<blockquote class="${classString}">${sampleText}</blockquote>`
  }
  // 縦書き
  else if (componentType === 'text-vertical') {
    reactElement = <div className={classString} style={{ minHeight: '200px' }}>{sampleText}</div>
    htmlString = `<div class="${classString}" style="min-height: 200px;">${sampleText}</div>`
  }
  // その他のテキスト系コンポーネント
  else {
    reactElement = <p className={classString}>{sampleText}</p>
    htmlString = `<p class="${classString}">${sampleText}</p>`
  }

  return createHandlerResult(reactElement, htmlString)
}

// テキスト関連のパターンハンドラー
export const textPatternHandler = {
  '^text-': textHandler
}
