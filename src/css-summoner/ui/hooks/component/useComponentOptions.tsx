// hooks/component/useComponentOptions.tsx
import { useMemo, useCallback } from 'react';

// オプションの共通型定義 (ClassBuilder.tsx でも使うためエクスポート)
export interface Option {
  value: string;
  label: string;
  description?: string; // description はオプション
}

// useClassBuilder から渡される state の部分的な型
interface PartialState {
  componentType: string;
}

// サイズ、角丸、モディファイアのオプションを格納するオブジェクトの型
// キーはコンポーネントタイプ ('button', 'card', 'common' など)
type OptionsMap = Record<string, Option[]>;

// useComponentOptions フックの戻り値の型
interface UseComponentOptionsReturn {
  getBaseComponentType: (type: string) => string;
  getSizeOptions: () => Option[];
  getBorderRadiusOptions: () => Option[];
  getModifierOptions: () => Option[];
}

/**
 * コンポーネントのオプション (サイズ、角丸、モディファイア) を計算するためのカスタムフック
 * コンポーネントタイプに応じて適切なオプションを選択し、メモ化する
 *
 * @param state - コンポーネントの状態 (componentType を含む)
 * @param sizes - サイズオプションのマッピング
 * @param borderRadiusOptions - 角丸オプションのマッピング
 * @param modifiers - モディファイアオプションのマッピング
 * @returns コンポーネントオプション関連の関数と値
 */
const useComponentOptions = (
  // state: PartialState, // PartialState の代わりに componentType を直接受け取る
  componentType: string, // state.componentType を直接受け取るように変更
  sizes: OptionsMap,
  borderRadiusOptions: OptionsMap,
  modifiers: OptionsMap
): UseComponentOptionsReturn => {
 // コンポーネントタイプのベース名を抽出する関数
 const getBaseComponentType = useCallback((type: string): string => {
		// 'heading'で始まるがハイフンが含まれる場合（例: heading-casual）
		if (type.startsWith('heading') && type.includes('-')) {
			return 'heading';
		}
		// 'form'で始まる場合も同様
		if (type.startsWith('form') && type.includes('-')) {
			return 'form';
		}
		// 'text'で始まる場合も同様
		if (type.startsWith('text') && type.includes('-')) {
			return 'text';
		}

		// 上記以外はハイフン前の部分を返す (例: 'button-outline' -> 'button')
		const parts = type.split('-');
		return parts[0];
	}, []);

	// サイズオプションのメモ化
	const sizeOptionsValue = useMemo((): Option[] => {
		// const baseType = getBaseComponentType(state.componentType); // state.componentType を componentType に変更
	       const baseType = getBaseComponentType(componentType);
		// baseType が sizes のキーとして存在するか確認
		if (Object.prototype.hasOwnProperty.call(sizes, baseType)) {
			return sizes[baseType];
		}
		return sizes.common || [];
	// }, [state.componentType, getBaseComponentType, sizes]); // 依存配列を componentType に変更
	   }, [componentType, getBaseComponentType, sizes]);

	// 角丸オプションのメモ化
	const borderRadiusOptionsValue = useMemo((): Option[] => {
		// const baseType = getBaseComponentType(state.componentType); // state.componentType を componentType に変更
	       const baseType = getBaseComponentType(componentType);
	       if (Object.prototype.hasOwnProperty.call(borderRadiusOptions, baseType)) {
			return borderRadiusOptions[baseType];
		}
		return borderRadiusOptions.common || [];
	// }, [state.componentType, getBaseComponentType, borderRadiusOptions]); // 依存配列を componentType に変更
	   }, [componentType, getBaseComponentType, borderRadiusOptions]);

	// モディファイアオプションのメモ化
	const modifierOptionsValue = useMemo((): Option[] => {
		// const baseType = getBaseComponentType(state.componentType); // state.componentType を componentType に変更
	       const baseType = getBaseComponentType(componentType);
		const componentModifiers = Object.prototype.hasOwnProperty.call(modifiers, baseType)
	           ? modifiers[baseType]
	           : [];
		// 共通モディファイアと結合して返す (重複を削除する場合 Set を使うことも検討)
		return [...(modifiers.common || []), ...componentModifiers];
	// }, [state.componentType, getBaseComponentType, modifiers]); // 依存配列を componentType に変更
	   }, [componentType, getBaseComponentType, modifiers]);

	// 各オプションを取得する関数を返す
	// useCallback でラップして不要な再生成を防ぐ
	const getSizeOptions = useCallback(() => sizeOptionsValue, [sizeOptionsValue]);
	const getBorderRadiusOptions = useCallback(() => borderRadiusOptionsValue, [borderRadiusOptionsValue]);
	const getModifierOptions = useCallback(() => modifierOptionsValue, [modifierOptionsValue]);


	return {
		getBaseComponentType,
		getSizeOptions,
		getBorderRadiusOptions,
		getModifierOptions,
	};
};

export default useComponentOptions;
