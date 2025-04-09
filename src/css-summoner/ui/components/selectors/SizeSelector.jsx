/**
 * @file src/css-summoner/ui/components/selectors/SizeSelector.jsx
 * @description コンポーネントのサイズ (例: 'sm', 'md', 'lg') を選択するための
 *              ボタン形式のセレクターコンポーネント。
 *              選択された値は `onSelect` コールバックを通じて親コンポーネントに通知されます。
 *
 * @imports
 * - React, { useCallback, useMemo } from 'react'
 *
 * @props {object} props
 *   @prop {Array<object>} [sizes=[]] - 選択可能なサイズオプションの配列。各オブジェクトは `{ value: string, label: string }` 形式。
 *   @prop {string} selectedSize - 現在選択されているサイズクラスの値 (例: 'btn-sm', 'lg')。
 *   @prop {function} onSelect - サイズが選択されたときに呼び出されるコールバック関数。引数として選択された値 (string) を受け取ります。
 *
 * @exports SizeSelector - このReactコンポーネント (React.memoでラップ)。
 *
 * @component SizeSelector
 */
import React, { useCallback, useMemo } from 'react'

const SizeSelector = ({ sizes = [], selectedSize, onSelect }) => {
	// --- レンダリング条件 ---
	// sizes 配列が空または存在しない場合は何もレンダリングしない
	if (!sizes || sizes.length === 0) {
		return null
	}
	// --- メモ化された値 (useMemo) ---
	/**
	 * Propsで受け取った `sizes` 配列から、値が空文字列 ('') のオプションを除外した新しい配列を生成 (メモ化)。
	 * 空文字列は「デフォルトサイズ」を表す場合があるが、このセレクターでは明示的なサイズ選択のみを扱う。
	 * @returns {Array<object>} 値が空でないサイズオプションの配列
	 */
	const allOptions = useMemo(() => {
		// sizes 配列をコピーし、value が空文字列でないものだけをフィルタリング
		return [...sizes].filter((option) => option.value !== '')
	}, [sizes]) // sizes 配列が変更されたときのみ再計算

	// --- コールバック関数 (useCallback) ---
	/**
	 * サイズ選択ボタンがクリックされたときに呼び出されるハンドラ (メモ化)。
	 * イベントのデフォルト動作を防ぎ、`onSelect` コールバックを実行する。
	 * @param {React.MouseEvent} e - クリックイベントオブジェクト
	 * @param {string} value - 選択されたサイズクラスの値
	 */
	const handleSelect = useCallback(
		(e, value) => {
			e.preventDefault() // ボタンクリックによる意図しない動作を防ぐ
			onSelect(value) // 親コンポーネントに選択された値を通知
		},
		[onSelect]
	) // onSelect コールバック関数が変更されたときのみ再生成

	// --- レンダリング ---
	return (
		// セレクター全体のコンテナ
		<div className='mb-4'>
			{' '}
			{/* 下マージン追加 */}
			{/* セクションタイトル */}
			<h2 className='label-config label-size text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1'>
				Size
			</h2>
			{/* サイズ選択ボタンを配置するコンテナ */}
			<div className='container-config container-config-size flex flex-wrap gap-1'>
				{/* allOptions 配列をループして各サイズボタンを生成 */}
				{allOptions.map((option) => (
					// 各ボタンを囲むdiv (将来的な拡張用)
					<div key={option.value} className='relative'>
						{/* サイズ選択ボタン */}
						<button
							// ボタンのスタイルクラス: 基本スタイル、サイズ、形状、選択状態
							className={`btn btn-outline btn-xs btn-square selector-button selector-size transition-all duration-150 ease-in-out
			                             ${selectedSize === option.value ? 'btn-active border-primary text-primary' : 'border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500'} {/* 選択/非選択/ホバー状態 */}
			                           `}
							onClick={(e) => handleSelect(e, option.value)} // クリックハンドラ
							aria-pressed={selectedSize === option.value} // アクセシビリティ: 選択状態
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
export default React.memo(SizeSelector)
