// 2. classMappingsConfig.js - 手動管理部分（最初に1回だけ生成し、以降は変更しない）
export const sizes = {
	// 全般的なサイズ
	common: [
		{ value: 'xs', label: 'XS' },
		{ value: 'sm', label: 'Small' },
		{ value: 'md', label: 'Medium' },
		{ value: 'lg', label: 'Large' },
		{ value: 'xl', label: 'XL' },
	],
	// ボタン専用のサイズクラス
	button: [
		{ value: 'btn-xs', label: 'XS' },
		{ value: 'btn-sm', label: 'Small' },
		{ value: 'btn-md', label: 'Medium' },
		{ value: 'btn-lg', label: 'Large' },
		{ value: 'btn-xl', label: 'XL' },
	],

	// 見出し専用のサイズクラス
	heading: [
		{ value: 'heading-sm', label: 'Small' },
		{ value: 'heading-md', label: 'Medium' },
		{ value: 'heading-lg', label: 'Large' },
		{ value: 'heading-xl', label: 'XL' },
	],

	// フォーム専用のサイズクラス
	form: [
		{ value: 'form-xs', label: 'XS' },
		{ value: 'form-sm', label: 'Small' },
		{ value: 'form-md', label: 'Medium' },
		{ value: 'form-lg', label: 'Large' },
		{ value: 'form-xl', label: 'XL' },
	],
}

// 角丸のサイズオプション
export const borderRadiusOptions = [
	{ value: 'rounded-none', label: 'なし' },
	{ value: 'rounded-sm', label: 'Small' },
	{ value: 'rounded', label: 'Medium' },
	{ value: 'rounded-lg', label: 'Large' },
	{ value: 'rounded-xl', label: 'XL' },
	{ value: 'rounded-2xl', label: '2XL' },
	{ value: 'rounded-3xl', label: '3XL' },
	{ value: 'rounded-full', label: 'Full' },
]

// コンポーネント固有の角丸クラス

export const modifiers = {
	// 全般的なモディファイア
	common: [
		{ value: 'shadow-sm', label: '弱い影', description: '影を弱めに付けます' },
		{
			value: 'shadow',
			label: '標準の影',
			description: '標準的な強さの影を付けます',
		},
		{ value: 'shadow-lg', label: '強い影', description: '強めの影を付けます' },
		{ value: 'border', label: '枠線', description: '枠線を追加します' },
	],

	// ボタン専用のモディファイア
	button: [
		{
			value: 'btn-shadow',
			label: '影付き',
			description: 'ボタンに影を付けます',
		},
		{
			value: 'btn-full',
			label: '幅100%',
			description: '親要素の幅いっぱいに広がります',
		},
		{
			value: 'btn-animate-up',
			label: '上浮かせ',
			description: 'ホバー時に上に移動するアニメーション',
		},
		{
			value: 'btn-animate-down',
			label: '押し込み',
			description: 'ホバー時に下に移動するアニメーション',
		},
		{
			value: 'btn-animate-pulse',
			label: '脈動',
			description: 'ホバー時に脈打つようなアニメーション',
		},
		{
			value: 'btn-icon-left',
			label: 'アイコン左',
			description: 'アイコンを左側に配置',
		},
		{
			value: 'btn-icon-right',
			label: 'アイコン右',
			description: 'アイコンを右側に配置',
		},
		{
			value: 'btn-icon-only',
			label: 'アイコンのみ',
			description: 'アイコンのみのボタン',
		},
	],

	// カード専用のモディファイア
	card: [
		{
			value: 'card-shadow-sm',
			label: '弱い影',
			description: 'カードに弱い影を付けます',
		},
		{
			value: 'card-shadow',
			label: '標準の影',
			description: 'カードに標準的な影を付けます',
		},
		{
			value: 'card-shadow-lg',
			label: '強い影',
			description: 'カードに強い影を付けます',
		},
	],

	// 見出し専用のモディファイア
	heading: [
		{
			value: 'heading-with-icon',
			label: 'アイコン付き',
			description: 'アイコンを追加できるレイアウト',
		},
		{
			value: 'heading-animated',
			label: 'アニメーション',
			description: 'ホバー時のアニメーション効果',
		},
	],

	// テキスト専用のモディファイア
	text: [
		{
			value: 'text-center',
			label: '中央揃え',
			description: 'テキストを中央に揃えます',
		},
		{
			value: 'text-right',
			label: '右揃え',
			description: 'テキストを右に揃えます',
		},
		{
			value: 'text-justify',
			label: '両端揃え',
			description: 'テキストを両端に揃えます',
		},
	],

	// フォーム専用のモディファイア
	form: [
		{
			value: 'form-disabled',
			label: '無効状態',
			description: 'フォーム要素を無効状態にします',
		},
		{
			value: 'form-error',
			label: 'エラー状態',
			description: 'エラー表示のスタイルを適用します',
		},
		{
			value: 'form-success',
			label: '成功状態',
			description: '成功表示のスタイルを適用します',
		},
	],

	// 画像専用のモディファイア
	image: [
		{ value: 'img-shadow', label: '影付き', description: '画像に影を付けます' },
		{
			value: 'img-bordered',
			label: '枠線付き',
			description: '画像に枠線を追加します',
		},
		{
			value: 'img-overlay',
			label: 'オーバーレイ',
			description: '画像の上に半透明のオーバーレイを追加します',
		},
	],

	// インフォボックス専用のモディファイア
	infobox: [
		{
			value: 'infobox-outline',
			label: 'アウトライン',
			description: '背景透明で枠線のみ',
		},
		{
			value: 'infobox-bordered',
			label: '枠線付き',
			description: '標準の枠線を追加',
		},
		{ value: 'infobox-shadow', label: '影付き', description: '影を追加' },
		{
			value: 'infobox-square',
			label: '角丸なし',
			description: '角を丸くしない設定',
		},
		{
			value: 'infobox-with-icon',
			label: 'アイコン付き',
			description: 'アイコンのスペースを確保',
		},
		{
			value: 'infobox-compact',
			label: 'コンパクト',
			description: '余白が少ないコンパクトスタイル',
		},
	],
}

export const specialClasses = [
	{
		value: 'tran-200',
		label: '遷移効果 200ms',
		description: '200msのトランジション効果',
	},
	{
		value: 'tran-300',
		label: '遷移効果 300ms',
		description: '300msのトランジション効果',
	},
	{
		value: 'tran-500',
		label: '遷移効果 500ms',
		description: '500msのトランジション効果',
	},
	{
		value: 'abs-center',
		label: '絶対中央',
		description: '絶対配置で中央に配置',
	},
]
