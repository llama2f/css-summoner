// configs/borderRadius.cjs
// 角丸設定の管理

import { text } from '@fortawesome/fontawesome-svg-core'

export const borderRadiusOptions = {
	common: [
		{ value: 'rounded-none', label: 'なし' },
		{ value: 'rounded-sm', label: 'Small' },
		{ value: 'rounded', label: 'Medium' },
		{ value: 'rounded-lg', label: 'Large' },
		{ value: 'rounded-xl', label: 'XL' },
		{ value: 'rounded-2xl', label: '2XL' },
		{ value: 'rounded-3xl', label: '3XL' },
		{ value: 'rounded-full', label: 'Full' },
	],
	button: [
		{ value: 'btn-rounded-sm', label: 'Small' },
		{ value: 'btn-rounded-lg', label: 'Large' },
		{ value: 'btn-rounded-full', label: 'Full' },
		{ value: 'btn-square', label: 'Square (角なし)' },
	],
	text: [
	]
}
// コンポーネントごとの角丸設定
/* export const componentBorderRadius = {
	button: [
		{ value: 'btn-rounded-sm', label: 'Small' },
		{ value: 'btn-rounded-lg', label: 'Large' },
		{ value: 'btn-rounded-full', label: 'Full' },
		{ value: 'btn-square', label: 'Square (角なし)' },
	],
}
 */
export default borderRadiusOptions
