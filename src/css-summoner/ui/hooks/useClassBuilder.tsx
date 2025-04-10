// hooks/useClassBuilder.tsx
import { useReducer, useEffect, useCallback } from 'react';
// componentVariants の型を明示的に定義する必要があるかもしれない
import { componentVariants, baseClasses } from '@/css-summoner/classMappings.js';
import { combineClasses } from '@templates/handlers/common';
import { defaultCustomColor } from '@/css-summoner/configs/colors';
import { ACTIONS } from '@/css-summoner/ui/hooks/actions.ts'; // Update import path

// ローカルストレージのキー
const STORAGE_KEY = 'css-summoner-custom-colors';

// CustomColorSettings の型定義
interface CustomColorSettings {
	mainColor: string;
	textColor: string;
	autoTextColor: boolean;
	autoBorderColor: boolean;
}


// カスタムカラーをロード
const loadCustomColors = (): CustomColorSettings => {
	if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
		return defaultCustomColor;
	}
	try {
		const savedColors = localStorage.getItem(STORAGE_KEY);
		const parsed = savedColors ? JSON.parse(savedColors) : defaultCustomColor;
		if (parsed && typeof parsed.mainColor === 'string' && typeof parsed.textColor === 'string' && typeof parsed.autoTextColor === 'boolean' && typeof parsed.autoBorderColor === 'boolean') {
			return parsed;
		}
		return defaultCustomColor;
	} catch (error) {
		console.error('Error loading custom colors:', error);
		return defaultCustomColor;
	}
};

// カスタムカラーを保存
const saveCustomColors = (colorSettings: CustomColorSettings): void => {
	if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
		return;
	}
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(colorSettings));
	} catch (error) {
		console.error('Error saving custom colors:', error);
	}
};

// Stateの型定義 (エクスポートする)
export interface State {
	componentType: string;
	componentVariant: string;
	size: string;
	borderRadius: string;
	selectedModifiers: string[];
	additionalClasses: string;
	selectedSpecialClasses: string[];
	previewBg: string;
	selectedColor: string;
	customColorSettings: CustomColorSettings;
	generatedClassString: string;
	isMobileMenuOpen: boolean;
}

// Actionの型定義 (具体的な型をユニオンで定義)
type Action =
	| { type: typeof ACTIONS.SET_COMPONENT_TYPE; payload: string }
	| { type: typeof ACTIONS.SET_COMPONENT_VARIANT; payload: string }
	| { type: typeof ACTIONS.SET_SIZE; payload: string }
	| { type: typeof ACTIONS.SET_BORDER_RADIUS; payload: string }
	| { type: typeof ACTIONS.TOGGLE_MODIFIER; payload: string }
	| { type: typeof ACTIONS.SET_ADDITIONAL_CLASSES; payload: string }
	| { type: typeof ACTIONS.TOGGLE_SPECIAL_CLASS; payload: string }
	| { type: typeof ACTIONS.SET_PREVIEW_BG; payload: string }
	| { type: typeof ACTIONS.SET_COLOR; payload: string }
	| { type: typeof ACTIONS.SET_CUSTOM_COLOR_SETTINGS; payload: CustomColorSettings }
	| { type: typeof ACTIONS.UPDATE_GENERATED_CLASS; payload: string }
	| { type: typeof ACTIONS.RESET_SETTINGS } // payload なし
	| { type: typeof ACTIONS.TOGGLE_MOBILE_MENU }; // payload なし

// 初期状態
const initialState: State = {
	componentType: 'button',
	componentVariant: '',
	size: '',
	borderRadius: '',
	selectedModifiers: [],
	additionalClasses: '',
	selectedSpecialClasses: [],
	previewBg: 'bg-transparent',
	selectedColor: 'theme-primary',
	customColorSettings: defaultCustomColor,
	generatedClassString: '',
	isMobileMenuOpen: false,
};

// リデューサー
const reducer = (state: State, action: Action): State => {
	// payload を持たないアクションを先に処理
	if (action.type === ACTIONS.RESET_SETTINGS) {
		return {
			...initialState,
			componentType: state.componentType,
			previewBg: state.previewBg,
			customColorSettings: state.customColorSettings,
			isMobileMenuOpen: state.isMobileMenuOpen,
		};
	}
	if (action.type === ACTIONS.TOGGLE_MOBILE_MENU) {
		return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen };
	}

	// これ以降の case では action は payload を持つことが保証される
	switch (action.type) {
		case ACTIONS.SET_COMPONENT_TYPE:
			return {
				...state,
				componentType: action.payload,
				selectedModifiers: [],
				size: '',
				borderRadius: '',
			};
		case ACTIONS.SET_COMPONENT_VARIANT:
			return { ...state, componentVariant: action.payload };
		case ACTIONS.SET_SIZE:
			return { ...state, size: action.payload };
		case ACTIONS.SET_BORDER_RADIUS:
			return { ...state, borderRadius: action.payload };
		case ACTIONS.TOGGLE_MODIFIER: {
			const modifierValue = action.payload;
			const exists = state.selectedModifiers.includes(modifierValue);
			return {
				...state,
				selectedModifiers: exists
					? state.selectedModifiers.filter((m) => m !== modifierValue)
					: [...state.selectedModifiers, modifierValue],
			};
		}
		case ACTIONS.SET_ADDITIONAL_CLASSES:
			return { ...state, additionalClasses: action.payload };
		case ACTIONS.TOGGLE_SPECIAL_CLASS: {
			const classValue = action.payload;
			const exists = state.selectedSpecialClasses.includes(classValue);
			return {
				...state,
				selectedSpecialClasses: exists
					? state.selectedSpecialClasses.filter((c) => c !== classValue)
					: [...state.selectedSpecialClasses, classValue],
			};
		}
		case ACTIONS.SET_PREVIEW_BG:
			return { ...state, previewBg: action.payload };
		case ACTIONS.SET_COLOR:
			return { ...state, selectedColor: action.payload };
		case ACTIONS.SET_CUSTOM_COLOR_SETTINGS:
			saveCustomColors(action.payload);
			return { ...state, customColorSettings: action.payload };
		case ACTIONS.UPDATE_GENERATED_CLASS:
			return { ...state, generatedClassString: action.payload };
		default:
			// 網羅性チェック: action が never 型であることを確認
			// payload を持たないアクションは上で処理済みのため、ここに来る action は payload を持つはず
			const exhaustiveCheck: never = action;
			console.error(`Unhandled action type: ${(action as any).type}`);
			return state;
	}
};

// カスタムフックの戻り値の型
interface UseClassBuilderReturn {
	state: State;
	actions: {
		setComponentType: (type: string) => void;
		setComponentVariant: (variant: string) => void;
		setSize: (size: string) => void;
		setBorderRadius: (radius: string) => void;
		toggleModifier: (modifier: string) => void;
		setAdditionalClasses: (classes: string) => void;
		toggleSpecialClass: (specialClass: string) => void;
		setPreviewBg: (bg: string) => void;
		setColor: (color: string) => void;
		setCustomColorSettings: (settings: CustomColorSettings) => void;
		resetSettings: () => void;
		toggleMobileMenu: () => void;
	};
}


// カスタムフック
export const useClassBuilder = (): UseClassBuilderReturn => {
	const [state, dispatch] = useReducer(reducer, initialState);

	// --- useEffect フック (変更なし) ---
	useEffect(() => {
		const loadedColors = loadCustomColors();
		if (JSON.stringify(loadedColors) !== JSON.stringify(initialState.customColorSettings)) {
			dispatch({
				type: ACTIONS.SET_CUSTOM_COLOR_SETTINGS,
				payload: loadedColors,
			});
		}
	}, []);

	useEffect(() => {
		const variants = componentVariants[state.componentType as keyof typeof componentVariants];
		if (variants && Array.isArray(variants) && variants.length > 0) {
			dispatch({
				type: ACTIONS.SET_COMPONENT_VARIANT,
				payload: variants[0].value,
			});
		} else {
			dispatch({ type: ACTIONS.SET_COMPONENT_VARIANT, payload: '' });
		}
	}, [state.componentType]);

	useEffect(() => {
		const combinedClasses = combineClasses({
			baseClass: '',
			variant: state.componentVariant,
			size: state.size,
			radius: state.borderRadius,
			modifiers: state.selectedModifiers,
			specialClasses: state.selectedSpecialClasses,
			color: state.selectedColor,
			additional: state.additionalClasses,
		});

		dispatch({ type: ACTIONS.UPDATE_GENERATED_CLASS, payload: combinedClasses });
	}, [
		state.componentVariant,
		state.size,
		state.borderRadius,
		state.selectedModifiers,
		state.selectedSpecialClasses,
		state.additionalClasses,
		state.selectedColor,
	]);

	useEffect(() => {
		if (JSON.stringify(state.customColorSettings) === JSON.stringify(defaultCustomColor)) {
			return;
		}

		if (typeof document !== 'undefined') {
			const { mainColor, textColor, autoBorderColor } = state.customColorSettings;
			const borderColor = autoBorderColor ? mainColor : null;

			document.documentElement.style.setProperty('--custom-color', mainColor);
			document.documentElement.style.setProperty('--custom-text-color', textColor);

			if (borderColor) {
				document.documentElement.style.setProperty('--custom-border-color', borderColor);
			} else {
				document.documentElement.style.removeProperty('--custom-border-color');
			}

			try {
				const hoverColor = `color-mix(in srgb, ${mainColor}, #000 10%)`;
				const activeColor = `color-mix(in srgb, ${mainColor}, #000 20%)`;
				document.documentElement.style.setProperty('--custom-hover-color', hoverColor);
				document.documentElement.style.setProperty('--custom-active-color', activeColor);
			} catch (e) {
				console.warn('color-mix might not be supported or color format is invalid:', e);
				document.documentElement.style.removeProperty('--custom-hover-color');
				document.documentElement.style.removeProperty('--custom-active-color');
			}
		}
	}, [state.customColorSettings]);
    // --- useEffect フック ここまで ---

	// アクション関数 (useCallbackでメモ化)
	const actions = {
		setComponentType: useCallback(
			(type: string) => dispatch({ type: ACTIONS.SET_COMPONENT_TYPE, payload: type }),
			[dispatch]
		),
		setComponentVariant: useCallback(
			(variant: string) => dispatch({ type: ACTIONS.SET_COMPONENT_VARIANT, payload: variant }),
			[dispatch]
		),
		setSize: useCallback(
			(size: string) => dispatch({ type: ACTIONS.SET_SIZE, payload: size }),
			[dispatch]
		),
		setBorderRadius: useCallback(
			(radius: string) => dispatch({ type: ACTIONS.SET_BORDER_RADIUS, payload: radius }),
			[dispatch]
		),
		toggleModifier: useCallback(
			(modifier: string) => dispatch({ type: ACTIONS.TOGGLE_MODIFIER, payload: modifier }),
			[dispatch]
		),
		setAdditionalClasses: useCallback(
			(classes: string) => dispatch({ type: ACTIONS.SET_ADDITIONAL_CLASSES, payload: classes }),
			[dispatch]
		),
		toggleSpecialClass: useCallback(
			(specialClass: string) => dispatch({ type: ACTIONS.TOGGLE_SPECIAL_CLASS, payload: specialClass }),
			[dispatch]
		),
		setPreviewBg: useCallback(
			(bg: string) => dispatch({ type: ACTIONS.SET_PREVIEW_BG, payload: bg }),
			[dispatch]
		),
		setColor: useCallback(
			(color: string) => dispatch({ type: ACTIONS.SET_COLOR, payload: color }),
			[dispatch]
		),
		setCustomColorSettings: useCallback(
			(settings: CustomColorSettings) => dispatch({ type: ACTIONS.SET_CUSTOM_COLOR_SETTINGS, payload: settings }),
			[dispatch]
		),
		resetSettings: useCallback(
			() => dispatch({ type: ACTIONS.RESET_SETTINGS }),
			[dispatch]
		),
		toggleMobileMenu: useCallback(
			() => dispatch({ type: ACTIONS.TOGGLE_MOBILE_MENU }),
			[dispatch]
		),
	};

	return { state, actions };
};

export default useClassBuilder;
