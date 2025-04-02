// handlers/index.jsx
// 全てのハンドラーをインポートして再エクスポートする

import { sampleIcon } from './common'
import { buttonHandlers } from './buttonHandlers'
import { cardHandlers } from './cardHandlers'
import { infoboxHandlers } from './infoboxHandlers'
import { headingPatternHandler } from './headingHandlers'
import { formPatternHandler } from './formHandlers'
import { imagePatternHandler } from './imageHandlers'
import { textPatternHandler } from './textHandlers'

// 全てのコンポーネントハンドラーを統合
const componentHandlers = {
  // 個別コンポーネント
  ...buttonHandlers,
  ...cardHandlers,
  ...infoboxHandlers,

  // パターンマッチング用ハンドラー
  patterns: {
    ...headingPatternHandler,
    ...formPatternHandler,
    ...imagePatternHandler,
    ...textPatternHandler
  }
}

export {
  sampleIcon,
  componentHandlers as default
}
