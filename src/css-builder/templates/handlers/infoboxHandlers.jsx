// handlers/infoboxHandlers.jsx
// インフォボックス関連コンポーネントのハンドラー

import React from 'react'
import { sampleIcon, createHandlerResult } from './common'

// インフォボックスハンドラー
export const infoboxHandler = (options) => {
  const { classString = '', selectedModifiers = [] } = options

  const useIcon = selectedModifiers.includes('infobox-with-icon')
  const hasTitle = selectedModifiers.includes('infobox-title')

  const reactElement = (
    <div className={classString} style={{ maxWidth: '400px' }}>
      {useIcon && (
        <div
          className='infobox-icon'
          dangerouslySetInnerHTML={{ __html: sampleIcon }}
        />
      )}
      {hasTitle && (
        <div className='infobox-title'>インフォボックスタイトル</div>
      )}
      <p>
        インフォメーションメッセージのサンプルです。重要な情報や注意事項を表示するために使用します。
      </p>
    </div>
  )

  let htmlString
  if (useIcon && hasTitle) {
    htmlString = `<div class="${classString}">
  <div class="infobox-icon">
    ${sampleIcon}
  </div>
  <div class="infobox-title">インフォボックスタイトル</div>
  <p>インフォメーションメッセージのサンプルです。重要な情報や注意事項を表示するために使用します。</p>
</div>`
  } else if (useIcon) {
    htmlString = `<div class="${classString}">
  <div class="infobox-icon">
    ${sampleIcon}
  </div>
  <p>インフォメーションメッセージのサンプルです。重要な情報や注意事項を表示するために使用します。</p>
</div>`
  } else if (hasTitle) {
    htmlString = `<div class="${classString}">
  <div class="infobox-title">インフォボックスタイトル</div>
  <p>インフォメーションメッセージのサンプルです。重要な情報や注意事項を表示するために使用します。</p>
</div>`
  } else {
    htmlString = `<div class="${classString}">
  <p>インフォメーションメッセージのサンプルです。重要な情報や注意事項を表示するために使用します。</p>
</div>`
  }

  return createHandlerResult(reactElement, htmlString)
}

// エクスポートするハンドラーマップ
export const infoboxHandlers = {
  'infobox': infoboxHandler
}
