/**
 * @file src/css-summoner/ui/components/selectors/BorderRadiusSelector.jsx
 * @description Tailwind CSSの角丸クラス (例: 'rounded-sm', 'rounded-lg', 'rounded-full') を
 *              選択するためのボタン形式のセレクターコンポーネント。
 *              選択された値は `onSelect` コールバックを通じて親コンポーネントに通知されます。
 *
 * @imports
 * - React, { useCallback, useMemo } from 'react'
 *
 * @props {object} props
 *   @prop {Array<object>} [options=[]] - 選択可能な角丸オプションの配列。各オブジェクトは `{ value: string, label: string }` 形式。
 *   @prop {string} selectedRadius - 現在選択されている角丸クラスの値 (例: 'rounded-lg')。
 *   @prop {function} onSelect - 角丸が選択されたときに呼び出されるコールバック関数。引数として選択された値 (string) を受け取ります。
 *
 * @exports BorderRadiusSelector - このReactコンポーネント (React.memoでラップ)。
 *
 * @component BorderRadiusSelector
 */
import React, { useCallback, useMemo } from 'react'

// --- JSDocコメント (既存) ---
/**
 * 角丸を選択するセレクター
 *
 * @param {Object} props
 * @param {Array} props.options - 選択可能な角丸オプションリスト
 * @param {string} props.selectedRadius - 現在選択中の角丸
 * @param {Function} props.onSelect - 選択時のコールバック
 * @param {boolean} props.showTitle - タイトル表示の有無
 */
// --- ここまで既存のJSDoc ---
const BorderRadiusSelector = ({
	options = [],
	selectedRadius,
	onSelect,
	showTitle = true,
}) => {
	if (!options || options.length === 0) {
		return null // または適切なフォールバックUI
	}

	// --- メモ化された値 (useMemo) ---
	/**
	 * @returns {Array<object>} 「デフォルト」を含む全角丸オプションの配列
	 */
	const allOptions = useMemo(() => {
		// value: '' は、特定の角丸クラスを指定しない（デフォルトのスタイルを適用する）ことを意味する
		return [{ value: '', label: 'default' }, ...options]
	}, [options]) // options 配列が変更されたときのみ再計算

	// --- コールバック関数 (useCallback) ---
	/**
	 * @param {React.MouseEvent} e - クリックイベントオブジェクト
	 * @param {string} value - 選択された角丸クラスの値
	 */
	const handleSelect = useCallback(
		(e, value) => {
			e.preventDefault() // ボタンクリックによる意図しないページ遷移やフォーム送信を防ぐ
			onSelect(value) // 親コンポーネントに選択された値を通知
		},
		[onSelect]
	) // onSelect コールバック関数が変更されたときのみ再生成

	/**
	 * @param {string} value - 角丸クラスの値 (例: 'rounded-lg')
	 * @returns {string} 対応するTailwindの角丸クラス (例: 'rounded-lg', 'rounded-full')
	 */
	const getRadiusVisual = useCallback((value) => {
		// 値に含まれるキーワードに基づいて適切なクラスを返す
		if (value.includes('full')) return 'rounded-full' // 完全な円
		if (value.includes('lg')) return 'rounded-lg' // 大きい角丸
		if (value.includes('md')) return 'rounded-md' // 中程度の角丸
		if (value.includes('sm')) return 'rounded-sm' // 小さい角丸
		if (value.includes('none')) return 'rounded-none' // 角丸なし
		return 'rounded' // デフォルトの角丸 (valueが空文字列の場合など)
	}, []) // この関数は外部の状態に依存しないため、依存配列は空

	// --- レンダリング ---
	return (
		// セレクター全体のコンテナ
		<div>
			{showTitle && (
				<h2 className='label-config label-radius text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-x-1.5'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 448 512'
						className='h-4 w-4 fill-current'
					>
						<path d='M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z' />
					</svg>
					Radius
				</h2>
			)}

			{/* 角丸選択ボタンを配置するコンテナ */}
			<div className='container-config container-config-radius flex flex-wrap gap-1'>
				{/* allOptions 配列をループして各角丸ボタンを生成 */}
				{allOptions.map((option) => (
					// 各ボタンを囲むdiv (将来的にツールチップなどを追加する場合に備える)
					<div key={option.value} className='relative'>
						{/* 角丸選択ボタン */}
						<button
							// ボタンのスタイルクラス: 基本スタイル、サイズ、形状、視覚的角丸、選択状態
							className={`btn btn-outline btn-xs btn-square selector-button selector-radius transition-all duration-150 ease-in-out
			                             ${option.value ? getRadiusVisual(option.value) : 'rounded'}
			                             ${selectedRadius === option.value ? 'btn-active border-primary-light text-primary-light bg-primary' : 'border-neutral-300 dark:border-neutral-400 text-neutral-600 dark:text-neutral-200 hover:text-primary hover:border-neutral-400 dark:hover:border-neutral-500'}
			                           `}
							onClick={(e) => handleSelect(e, option.value)} // クリックハンドラ
							aria-pressed={selectedRadius === option.value} // アクセシビリティ: 選択状態を示す
							title={option.label} // ツールチップ用のタイトル
						>
							{/* ボタンのテキストラベル */}
							{option.label}
						</button>
					</div>
				))}
			</div>
		</div>
	)
}

// パフォーマンス最適化のため、React.memoでコンポーネントをラップしてエクスポート
// Propsが変更されない限り再レンダリングをスキップする
export default React.memo(BorderRadiusSelector)
