// handlers/imageHandlers.jsx
// 画像関連コンポーネントのハンドラー

import React from 'react'
import { createHandlerResult } from './common'

// 画像ハンドラー
export const imageHandler = (options) => {
  const { classString = '', componentType } = options

  // 画像ギャラリー
  if (componentType === 'image-gallery') {
    const reactElement = (
      <div className={classString} style={{ maxWidth: '300px' }}>
        <div className='grid grid-cols-2 gap-2'>
          <div className='bg-primary-light flex items-center justify-center h-20'>
            <span className='text-xl'>🖼️</span>
          </div>
          <div className='bg-secondary-light flex items-center justify-center h-20'>
            <span className='text-xl'>🖼️</span>
          </div>
          <div className='bg-accent-light flex items-center justify-center h-20'>
            <span className='text-xl'>🖼️</span>
          </div>
          <div className='bg-neutral-200 flex items-center justify-center h-20'>
            <span className='text-xl'>🖼️</span>
          </div>
        </div>
      </div>
    )

    const htmlString = `<div class="${classString} max-w-sm">
  <div class="grid grid-cols-2 gap-2">
    <img src="/path/to/image1.jpg" alt="画像1" class="w-full h-auto" />
    <img src="/path/to/image2.jpg" alt="画像2" class="w-full h-auto" />
    <img src="/path/to/image3.jpg" alt="画像3" class="w-full h-auto" />
    <img src="/path/to/image4.jpg" alt="画像4" class="w-full h-auto" />
  </div>
</div>`

    return createHandlerResult(reactElement, htmlString)
  }
  // 通常の画像
  else {
    const reactElement = (
      <div className={classString}>
        <div
          className='bg-primary-light flex items-center justify-center'
          style={{ width: '200px', height: '150px' }}
        >
          <span className='text-3xl'>🖼️</span>
        </div>
      </div>
    )

    const htmlString = `<div class="${classString}">
  <img src="/path/to/image.jpg" alt="サンプル画像" style="width: 200px; height: 150px;" />
</div>`

    return createHandlerResult(reactElement, htmlString)
  }
}

// 画像関連のパターンハンドラー
export const imagePatternHandler = {
  '^image': imageHandler
}
