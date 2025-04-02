// hooks/useClassBuilder.jsx
import { useReducer, useEffect, useCallback } from 'react'
import { componentVariants, baseClasses } from '@/css-builder/autoClassMappings.js'
import { combineClasses } from '@/css-builder/templates/handlers/common'

// アクション定義
export const ACTIONS = {
	SET_COMPONENT_TYPE: 'SET_COMPONENT_TYPE',
	SET_COMPONENT_VARIANT: 'SET_COMPONENT_VARIANT',
	SET_SIZE: 'SET_SIZE',
	SET_BORDER_RADIUS: 'SET_BORDER_RADIUS',
	TOGGLE_MODIFIER: 'TOGGLE_MODIFIER',
	SET_ADDITIONAL_CLASSES: 'SET_ADDITIONAL_CLASSES',
	TOGGLE_SPECIAL_CLASS: 'TOGGLE_SPECIAL_CLASS',
	SET_PREVIEW_BG: 'SET_PREVIEW_BG',
	RESET_SETTINGS: 'RESET_SETTINGS',
}

// 初期状態
const initialState = {
	componentType: 'button',
	componentVariant: '',
	size: '',
	borderRadius: '',
	selectedModifiers: [],
	additionalClasses: '',
	selectedSpecialClasses: [],
	previewBg: 'bg-transparent',
	generatedClassString: '',
}

// リデューサー
const reducer = (state, action) => {
	switch (action.type) {
		case ACTIONS.SET_COMPONENT_TYPE:
			return {
				...state,
				componentType: action.payload,
				// コンポーネントタイプを変更した際に、関連設定をリセット
				selectedModifiers: [],
				size: '',
				borderRadius: '',
			}
		case ACTIONS.SET_COMPONENT_VARIANT:
			return { ...state, componentVariant: action.payload }
		case ACTIONS.SET_SIZE:
			return { ...state, size: action.payload }
		case ACTIONS.SET_BORDER_RADIUS:
			return { ...state, borderRadius: action.payload }
		case ACTIONS.TOGGLE_MODIFIER: {
			const modifierValue = action.payload
			const exists = state.selectedModifiers.includes(modifierValue)
			return {
				...state,
				selectedModifiers: exists
					? state.selectedModifiers.filter((m) => m !== modifierValue)
					: [...state.selectedModifiers, modifierValue],
			}
		}
		case ACTIONS.SET_ADDITIONAL_CLASSES:
			return { ...state, additionalClasses: action.payload }
		case ACTIONS.TOGGLE_SPECIAL_CLASS: {
			const classValue = action.payload
			const exists = state.selectedSpecialClasses.includes(classValue)
			return {
				...state,
				selectedSpecialClasses: exists
					? state.selectedSpecialClasses.filter((c) => c !== classValue)
					: [...state.selectedSpecialClasses, classValue],
			}
		}
		case ACTIONS.SET_PREVIEW_BG:
			return { ...state, previewBg: action.payload }
		case ACTIONS.UPDATE_GENERATED_CLASS:
			return { ...state, generatedClassString: action.payload }
		case ACTIONS.RESET_SETTINGS:
			return {
				...initialState,
				componentType: state.componentType,
				previewBg: state.previewBg,
			}
		default:
			return state
	}
}

// カスタムフック
export const useClassBuilder = () => {
	const [state, dispatch] = useReducer(reducer, initialState)

	// コンポーネントタイプが変更されたら、対応するバリアントの最初の項目を選択
	useEffect(() => {
		// コンポーネントタイプに対応するバリアントがあれば設定
		if (
			componentVariants[state.componentType] &&
			componentVariants[state.componentType].length > 0
		) {
			dispatch({
				type: ACTIONS.SET_COMPONENT_VARIANT,
				payload: componentVariants[state.componentType][0].value,
			})
		} else {
			dispatch({ type: ACTIONS.SET_COMPONENT_VARIANT, payload: '' })
		}
	}, [state.componentType])

	// 選択に基づいてクラス文字列を生成する
	useEffect(() => {
		// 一貫性のある方法でクラスを結合
		const combinedClasses = combineClasses({
			// ベースクラスは含めないケースがあるため空文字列に
			// 生成時はベースクラスは他のコンポーネントが処理する
			baseClass: '',
			variant: state.componentVariant,
			size: state.size,
			radius: state.borderRadius,
			modifiers: state.selectedModifiers,
			specialClasses: state.selectedSpecialClasses,
			additional: state.additionalClasses,
		})

		dispatch({ type: ACTIONS.UPDATE_GENERATED_CLASS, payload: combinedClasses })
	}, [
		state.componentVariant,
		state.size,
		state.borderRadius,
		state.selectedModifiers,
		state.selectedSpecialClasses,
		state.additionalClasses,
	])

	// コンポーネントタイプとバリアントの変更を直接ディスパッチ（すべてメモ化）
	const actions = {
		setComponentType: useCallback((type) =>
			dispatch({ type: ACTIONS.SET_COMPONENT_TYPE, payload: type }),
		[dispatch]),
		
		setComponentVariant: useCallback((variant) =>
			dispatch({ type: ACTIONS.SET_COMPONENT_VARIANT, payload: variant }),
		[dispatch]),
		
		setSize: useCallback((size) =>
			dispatch({ type: ACTIONS.SET_SIZE, payload: size }),
		[dispatch]),
		
		setBorderRadius: useCallback((radius) =>
			dispatch({ type: ACTIONS.SET_BORDER_RADIUS, payload: radius }),
		[dispatch]),
		
		toggleModifier: useCallback((modifier) =>
			dispatch({ type: ACTIONS.TOGGLE_MODIFIER, payload: modifier }),
		[dispatch]),
		
		setAdditionalClasses: useCallback((classes) =>
			dispatch({ type: ACTIONS.SET_ADDITIONAL_CLASSES, payload: classes }),
		[dispatch]),
		
		toggleSpecialClass: useCallback((specialClass) =>
			dispatch({ type: ACTIONS.TOGGLE_SPECIAL_CLASS, payload: specialClass }),
		[dispatch]),
		
		setPreviewBg: useCallback((bg) =>
			dispatch({ type: ACTIONS.SET_PREVIEW_BG, payload: bg }),
		[dispatch]),
		
		resetSettings: useCallback(() =>
			dispatch({ type: ACTIONS.RESET_SETTINGS }),
		[dispatch])
	}

	return { state, actions }
}

export default useClassBuilder
