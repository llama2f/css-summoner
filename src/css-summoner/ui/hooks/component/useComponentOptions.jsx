// hooks/component/useComponentOptions.jsx
import { useMemo, useCallback } from 'react'

/**
 * コンポーネントのオプション (サイズ、角丸、モディファイア) を計算するためのカスタムフック
 * コンポーネントタイプに応じて適切なオプションを選択し、メモ化する
 *
 * @param {object} state - コンポーネントの状態
 * @param {object} sizes - サイズオプションのマッピング
 * @param {object} borderRadiusOptions - 角丸オプションのマッピング
 * @param {object} modifiers - モディファイアオプションのマッピング
 * @returns {object} コンポーネントオプション関連の関数と値
 */
const useComponentOptions = (state, sizes, borderRadiusOptions, modifiers) => {
	// コンポーネントタイプのベース名を抽出する関数
	const getBaseComponentType = useCallback((type) => {
		// 'heading'で始まるがハイフンが含まれる場合（例: heading-casual）
		if (type.startsWith('heading') && type.includes('-')) {
			return 'heading'
		}

		const parts = type.split('-')
		return parts[0] // 最初の部分を返す
	}, [])

	// サイズオプションのメモ化
	const sizeOptionsValue = useMemo(() => {
		// コンポーネントタイプのベース名を取得
		const baseType = getBaseComponentType(state.componentType)

		// そのコンポーネントタイプに特化したサイズがある場合はそれを返す
		if (sizes[baseType]) {
			return sizes[baseType]
		}

		// コンポーネント特化のサイズがない場合は共通サイズを返す
		return sizes.common || []
	}, [state.componentType, getBaseComponentType, sizes])

	// 角丸オプションのメモ化
	const borderRadiusOptionsValue = useMemo(() => {
		// コンポーネントタイプのベース名を取得
		const baseType = getBaseComponentType(state.componentType)

		// そのコンポーネントタイプに特化した角丸がある場合はそれを返す
		if (borderRadiusOptions[baseType]) {
			return borderRadiusOptions[baseType]
		}

		// コンポーネント特化の角丸がない場合は共通角丸を返す
		return borderRadiusOptions.common || []
	}, [state.componentType, getBaseComponentType, borderRadiusOptions])

	// モディファイアオプションのメモ化
	const modifierOptionsValue = useMemo(() => {
		// ベースコンポーネントタイプを取得
		const baseType = getBaseComponentType(state.componentType)

		// ベースタイプに対応するモディファイアを取得
		const componentModifiers = modifiers[baseType] || []

		// 共通モディファイアと結合して返す
		return [...(modifiers.common || []), ...componentModifiers]
	}, [state.componentType, getBaseComponentType, modifiers])

	return {
		getBaseComponentType,
		getSizeOptions: () => sizeOptionsValue,
		getBorderRadiusOptions: () => borderRadiusOptionsValue,
		getModifierOptions: () => modifierOptionsValue,
	}
}

export default useComponentOptions
