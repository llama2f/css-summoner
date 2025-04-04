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
			value: 'card-bordered',
			label: '枠線付き',
			description: '境界線のあるカードスタイル。視覚的な区切りを強調します。',
		},
		{
			value: 'card-hover',
			label: 'ホバー効果',
			description: 'ホバー時に浮き上がる効果のあるカード。インタラクティブ性を高めます。',
		},
		{
			value: 'card-compact',
			label: 'コンパクト',
			description: '内部の余白が小さいコンパクトなカード。スペースを節約したい場合に使用します。',
		},
		{
			value: 'card-hover-down',
			label: 'ホバー効果(下)',
			description: 'ホバー時に下に移動する効果のあるカード。',
		},
		{
			value: 'card-hover-scale',
			label: 'ホバー効果(拡大)',
			description: 'ホバー時に拡大する効果のあるカード。',
		},
		{
			value: 'card-hover-overlay',
			label: 'ホバー効果(オーバーレイ)',
			description: 'ホバー時にオーバーレイを表示する効果のあるカード。',
		},
		{
			value: 'card-hover-border',
			label: 'ホバー効果(枠線)',
			description: 'ホバー時に枠線の色を強調する効果のあるカード。',
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
			label: '下線アニメーション',
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
		{
			value: 'form-checkbox-square',
			label: 'チェックボックスの四角アイコン',
			description: 'チェックボックスの四角アイコンを表示します',
		}
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

	// バッジ専用のモディファイア
	badge: [
		{
			value: 'badge-icon-only', // アイコンのみクラス
			label: 'アイコンのみ',
			description: 'アイコンのみを表示します',
		},
		{
			value: 'badge-rounded-full', // 角丸クラス
			label: '完全な円',
			description: 'バッジを完全な円にします',
		},
		// 影関連は common にあるため、ここでは不要
	],

	// インフォボックス専用のモディファイア (variants.css, utilities.css に基づく)
	infobox: [
		{ value : 'infobox-with-icon', label: 'アイコンつき', description: 'アイコンを表示します' },
		// サイズ (variants.css)
		{
			value: 'infobox-compact',
			label: 'コンパクト',
			description: '余白が少ないコンパクトスタイル',
		},
		// ホバー効果 (utilities.css)
		{ value: 'infobox-hover', label: 'ホバー(上)', description: 'ホバー時に上に移動します' },
		{ value: 'infobox-hover-down', label: 'ホバー(下)', description: 'ホバー時に下に移動します' },
		{ value: 'infobox-hover-scale', label: 'ホバー(拡大)', description: 'ホバー時に拡大します' },
		{ value: 'infobox-hover-overlay', label: 'ホバー(オーバーレイ)', description: 'ホバー時にオーバーレイを表示します' },
		{ value: 'infobox-hover-border', label: 'ホバー(枠線強調)', description: 'ホバー時に枠線を強調します (outline/ghost向け)' },
		{ value: 'infobox-hover-ghost', label: 'ホバー(ゴースト)', description: 'ホバー時に背景を薄く表示します (ghost向け)' },
	],
}

export default modifiers
