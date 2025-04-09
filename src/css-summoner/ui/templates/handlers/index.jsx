// templates/handlers/index.jsx
// ビルド時に生成されたハンドラーマニフェストをインポート
import manifest from '../../configs/handler-manifest.json'

// マニフェストオブジェクトをそのままエクスポートする
// このオブジェクトには、各ハンドラータイプをキーとして、
// { metadata, path, sourceFile } という情報が含まれる。
// 'path' は実行時に動的インポートするための相対パス。
const handlers = manifest

export default handlers
