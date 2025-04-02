// handlers/headingHandlers.jsx
// 見出し関連コンポーネントのハンドラー

import React from 'react'
import { sampleIcon, createHandlerResult } from './common'

// 見出しハンドラー
export const headingHandler = (options) => {
  const { classString = '', selectedModifiers = [] } = options

  const hasIcon = selectedModifiers.includes('heading-with-icon')

  let reactElement
  if (hasIcon) {
    reactElement = (
      <h2 className={classString}>
        <span
          className='heading-icon mr-2 inline-block'
          dangerouslySetInnerHTML={{ __html: sampleIcon }}
        />
        見出しのサンプル
      </h2>
    )
  } else {
    reactElement = <h2 className={classString}>見出しのサンプル</h2>
  }

  let htmlString
  if (hasIcon) {
    htmlString = `<h2 class="${classString}">
  <span class="heading-icon mr-2 inline-block">${sampleIcon}</span>
  見出しテキスト
</h2>`
  } else {
    htmlString = `<h2 class="${classString}">
  見出しテキスト
</h2>`
  }

  return createHandlerResult(reactElement, htmlString)
}

// 見出し関連のパターンハンドラー
export const headingPatternHandler = {
  '^heading': headingHandler
}
