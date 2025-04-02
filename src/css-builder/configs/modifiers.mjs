// configs/modifiers.js
// モディファイア設定の管理

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
		{
			value: 'text-nowrap',
			label: '折り返し無し',
			description: 'テキストを折り返さずに表示します',
		},
		{
			value: 'text-shadow',
			label: '影付き',
			description: 'テキストに影を付けます',
		},
		{
			value: 'text-shadow-sm',
			label: '影付き（小）',
			description: 'テキストに影を付けます',
		},
		{
			value: 'text-blur',
			label: 'ぼかし',
			description: 'テキストにぼかし効果を適用します',
		},
		{
			value: 'text-outlined',
			label: 'アウトライン',
			description: 'テキストにアウトラインを追加します',
		},
		{
			value: 'font-serif',
			label: 'セリフ体',
			description: 'テキストをセリフ体で表示します',
		},
		{
			value: 'font-sans',
			label: 'サンセリフ体',
			description: 'テキストをサンセリフ体で表示します',
		},
		{
			value: 'font-mono',
			label: 'モノスペース',
			description: 'テキストをモノスペース体で表示します',
		},
		{
			value: 'text-vertical',
			label: '縦書き',
			description: 'テキストを縦書きにします',
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

export default modifiers
