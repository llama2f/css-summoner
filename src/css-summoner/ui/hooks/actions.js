/**
 * @file src/css-summoner/ui/hooks/actions.js
 * @description `useClassBuilder` フックで使用されるアクションタイプを定義する定数オブジェクト。
 *              Reducer関数内でどのアクションがディスパッチされたかを識別するために使用されます。
 *              アクションタイプは文字列で定義され、通常は `ACTION_NAME: 'ACTION_NAME'` の形式です。
 *
 * @exports ACTIONS - アクションタイプ文字列を値として持つ定数オブジェクト。
 */

/**
 * `useClassBuilder` Reducer で使用されるアクションタイプ定義。
 * @const {object} ACTIONS
 * @property {string} SET_COMPONENT_TYPE - 選択されたコンポーネントタイプを設定するアクション。
 * @property {string} SET_COMPONENT_VARIANT - 選択されたコンポーネントバリアントを設定するアクション。
 * @property {string} SET_SIZE - 選択されたサイズを設定するアクション。
 * @property {string} SET_BORDER_RADIUS - 選択された角丸を設定するアクション。
 * @property {string} TOGGLE_MODIFIER - 特定のモディファイアの選択状態をトグルするアクション。
 * @property {string} SET_ADDITIONAL_CLASSES - ユーザーが入力した追加クラス文字列を設定するアクション。
 * @property {string} TOGGLE_SPECIAL_CLASS - 特定の特殊クラスの選択状態をトグルするアクション。
 * @property {string} SET_PREVIEW_BG - プレビューエリアの背景色クラスを設定するアクション。
 * @property {string} SET_COLOR - 選択された色クラスを設定するアクション。
 * @property {string} SET_CUSTOM_COLOR_SETTINGS - カスタムカラーピッカーで設定された色情報を設定するアクション。
 * @property {string} RESET_SETTINGS - 全ての設定を初期状態にリセットするアクション。
 * @property {string} UPDATE_GENERATED_CLASS - 生成されたクラス文字列を更新するアクション (主に `useClassBuilder` 内部で使用)。
 */
export const ACTIONS = {
	SET_COMPONENT_TYPE: 'SET_COMPONENT_TYPE', // コンポーネントタイプ設定
	SET_COMPONENT_VARIANT: 'SET_COMPONENT_VARIANT', // コンポーネントバリアント設定
	SET_SIZE: 'SET_SIZE', // サイズ設定
	SET_BORDER_RADIUS: 'SET_BORDER_RADIUS', // 角丸設定
	TOGGLE_MODIFIER: 'TOGGLE_MODIFIER', // モディファイアのトグル
	SET_ADDITIONAL_CLASSES: 'SET_ADDITIONAL_CLASSES', // 追加クラス設定
	TOGGLE_SPECIAL_CLASS: 'TOGGLE_SPECIAL_CLASS', // 特殊クラスのトグル
	SET_PREVIEW_BG: 'SET_PREVIEW_BG', // プレビュー背景設定
	SET_COLOR: 'SET_COLOR', // 色設定
	SET_CUSTOM_COLOR_SETTINGS: 'SET_CUSTOM_COLOR_SETTINGS', // カスタムカラー設定
	RESET_SETTINGS: 'RESET_SETTINGS', // 設定リセット
	// UPDATE_GENERATED_CLASS は useClassBuilder フック内部で状態に基づいて
	// 生成されたクラス文字列を更新するために使用されるアクション。
	// 外部コンポーネントから直接ディスパッチされることは通常ないが、
	// アクションタイプを一元管理するためにここに含めている。
	UPDATE_GENERATED_CLASS: 'UPDATE_GENERATED_CLASS', // 生成クラス文字列更新
}
