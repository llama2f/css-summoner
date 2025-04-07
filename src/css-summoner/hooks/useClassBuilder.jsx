// hooks/useClassBuilder.jsx
import { useReducer, useEffect, useCallback } from 'react'
// autoClassMappings.js の代わりに classMappings.js からインポート
import { componentVariants, baseClasses } from '@/css-summoner/classMappings.js'
import { combineClasses } from '@/css-summoner/templates/handlers/common'
import { defaultCustomColor } from '@/css-summoner/configs/colors'

// ローカルストレージのキー
const STORAGE_KEY = 'css-summoner-custom-colors'

// カスタムカラーをロード (クライアントサイドでのみ呼び出す)
const loadCustomColors = () => {
	if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
		// サーバーサイドまたはlocalStorageがない環境ではデフォルトを返す
		return defaultCustomColor
	}
	try {
		const savedColors = localStorage.getItem(STORAGE_KEY)
		return savedColors ? JSON.parse(savedColors) : defaultCustomColor
	} catch (error) {
		console.error('Error loading custom colors:', error)
		return defaultCustomColor
	}
}

// カスタムカラーを保存 (クライアントサイドでのみ呼び出す)
const saveCustomColors = (colorSettings) => {
	if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
		// サーバーサイドまたはlocalStorageがない環境では何もしない
		return
	}
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(colorSettings))
	} catch (error) {
		console.error('Error saving custom colors:', error)
	}
}

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
	SET_COLOR: 'SET_COLOR', // 色設定アクション
	SET_CUSTOM_COLOR_SETTINGS: 'SET_CUSTOM_COLOR_SETTINGS', // カスタム色設定アクション
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
	selectedColor: 'color-primary', // 選択中の色クラス
	customColorSettings: defaultCustomColor, // デフォルト値を設定
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
		case ACTIONS.SET_COLOR: // 色選択のケース
			return { ...state, selectedColor: action.payload }
		case ACTIONS.SET_CUSTOM_COLOR_SETTINGS: // カスタム色設定のケース
			// ローカルストレージに保存
			saveCustomColors(action.payload)
			return { ...state, customColorSettings: action.payload }
		case ACTIONS.UPDATE_GENERATED_CLASS:
			return { ...state, generatedClassString: action.payload }
		case ACTIONS.RESET_SETTINGS:
			return {
				...initialState,
				componentType: state.componentType,
				previewBg: state.previewBg,
				customColorSettings: state.customColorSettings,
			}
		default:
			return state
	}
}

// カスタムフック
export const useClassBuilder = () => {
	const [state, dispatch] = useReducer(reducer, initialState)

	// クライアントサイドでのみカスタムカラーをロード
	useEffect(() => {
		const loadedColors = loadCustomColors()
		// 初期値と異なる場合のみ state を更新
		if (
			JSON.stringify(loadedColors) !==
			JSON.stringify(initialState.customColorSettings)
		) {
			dispatch({
				type: ACTIONS.SET_CUSTOM_COLOR_SETTINGS,
				payload: loadedColors,
			})
		}
	}, []) // マウント時に一度だけ実行

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
			color: state.selectedColor, // 色クラスを含める
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
		state.selectedColor, // 依存配列に色クラスを追加
	])

	// カスタム色の設定をCSSに適用 (クライアントサイドでのみ実行される)
	useEffect(() => {
		// state.customColorSettings が初期値でない場合のみ実行
		if (
			JSON.stringify(state.customColorSettings) ===
			JSON.stringify(defaultCustomColor)
		) {
			return // 初期値の場合は何もしない
		}

		// サーバーサイドレンダリングを考慮し、document の存在を確認
		if (typeof document !== 'undefined') {
			const { mainColor, textColor, autoBorderColor } =
				state.customColorSettings
			const borderColor = autoBorderColor ? mainColor : null

			document.documentElement.style.setProperty('--custom-color', mainColor)
			document.documentElement.style.setProperty(
				'--custom-text-color',
				textColor
			)

			if (borderColor) {
				document.documentElement.style.setProperty(
					'--custom-border-color',
					borderColor
				)
			} else {
				// borderColor が null の場合、変数を削除またはデフォルト値を設定
				document.documentElement.style.removeProperty('--custom-border-color')
			}

			// ホバー色と押下色を自動計算
			// color-mix がサポートされているか確認が必要な場合がある
			try {
				const hoverColor = `color-mix(in srgb, ${mainColor}, #000 10%)`
				const activeColor = `color-mix(in srgb, ${mainColor}, #000 20%)`
				document.documentElement.style.setProperty(
					'--custom-hover-color',
					hoverColor
				)
				document.documentElement.style.setProperty(
					'--custom-active-color',
					activeColor
				)
			} catch (e) {
				console.warn(
					'color-mix might not be supported or color format is invalid:',
					e
				)
				// フォールバック処理やエラーハンドリングをここに追加
				document.documentElement.style.removeProperty('--custom-hover-color')
				document.documentElement.style.removeProperty('--custom-active-color')
			}
		}
	}, [state.customColorSettings]) // customColorSettings が変更されたときに実行

	// コンポーネントタイプとバリアントの変更を直接ディスパッチ（すべてメモ化）
	const actions = {
		setComponentType: useCallback(
			(type) => dispatch({ type: ACTIONS.SET_COMPONENT_TYPE, payload: type }),
			[dispatch]
		),

		setComponentVariant: useCallback(
			(variant) =>
				dispatch({ type: ACTIONS.SET_COMPONENT_VARIANT, payload: variant }),
			[dispatch]
		),

		setSize: useCallback(
			(size) => dispatch({ type: ACTIONS.SET_SIZE, payload: size }),
			[dispatch]
		),

		setBorderRadius: useCallback(
			(radius) =>
				dispatch({ type: ACTIONS.SET_BORDER_RADIUS, payload: radius }),
			[dispatch]
		),

		toggleModifier: useCallback(
			(modifier) =>
				dispatch({ type: ACTIONS.TOGGLE_MODIFIER, payload: modifier }),
			[dispatch]
		),

		setAdditionalClasses: useCallback(
			(classes) =>
				dispatch({ type: ACTIONS.SET_ADDITIONAL_CLASSES, payload: classes }),
			[dispatch]
		),

		toggleSpecialClass: useCallback(
			(specialClass) =>
				dispatch({ type: ACTIONS.TOGGLE_SPECIAL_CLASS, payload: specialClass }),
			[dispatch]
		),

		setPreviewBg: useCallback(
			(bg) => dispatch({ type: ACTIONS.SET_PREVIEW_BG, payload: bg }),
			[dispatch]
		),

		setColor: useCallback(
			(
				color // 色選択のアクション
			) => dispatch({ type: ACTIONS.SET_COLOR, payload: color }),
			[dispatch]
		),

		setCustomColorSettings: useCallback(
			(
				settings // カスタム色設定アクション
			) =>
				dispatch({
					type: ACTIONS.SET_CUSTOM_COLOR_SETTINGS,
					payload: settings,
				}),
			[dispatch]
		),

		resetSettings: useCallback(
			() => dispatch({ type: ACTIONS.RESET_SETTINGS }),
			[dispatch]
		),
	}

	return { state, actions }
}

export default useClassBuilder
