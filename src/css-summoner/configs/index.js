/**
 * @file src/css-summoner/configs/index.js
 * @brief 設定ファイルの統合エントリーポイント
 * @description
 *   `src/css-summoner/configs/` ディレクトリ内の各種設定ファイルをインポートし、
 *   単一のエントリーポイントとして再エクスポートします。
 *   これにより、他のモジュールから設定を簡単にインポートできるようになります。
 *
 * @exports sizes - サイズ設定 (./sizes.mjs から)
 * @exports borderRadiusOptions - 角丸設定 (./borderRadius.mjs から)
 * @exports modifiers - モディファイア設定 (./modifiers.mjs から)
 * @exports specialClasses - 特殊クラス設定 (./specialClasses.mjs から)
 * @exports colorRegistry - カラーレジストリ (./colors.js から)
 * @exports colorOptions - カラーオプション (./colors.js から)
 *
 * @example
 * // 他のファイルから必要な設定をインポート
 * import { sizes, colorOptions } from './configs';
 *
 * @requires ./sizes.mjs
 * @requires ./borderRadius.mjs
 * @requires ./modifiers.mjs
 * @requires ./specialClasses.mjs
 * @requires ./colors.js
 */

// configs/index.js
// 設定ファイルのエクスポート

import sizes from './sizes.mjs'
import borderRadiusOptions from './borderRadius.mjs'
import modifiers from './modifiers.mjs'
import specialClasses from './specialClasses.mjs'
import { colorRegistry, colorOptions } from './colors.js'

export {
	sizes,
	borderRadiusOptions,
	modifiers,
	specialClasses,
	colorRegistry,
	colorOptions,
}
