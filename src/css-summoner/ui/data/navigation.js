// src/css-summoner/ui/data/navigation.js
import {
	faBars,
	faPalette,
	faBook,
	faCode,
	faHome,
	faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'

/**
 * ナビゲーション構造の定義
 * action: カスタムイベントのアクション名
 * href: 通常のリンク先
 * icon: FontAwesomeアイコン
 * showOnlyIn: 表示するページタイプ(['main', 'docs', 'usage', 'all'])
 */
export const navigationItems = [
	{
		title: 'Page Navigation',
		showOnlyIn: ['all'],
		items: [
			{
				label: 'CSS Summoner',
				href: '/',
				icon: faHome,
				description: 'CSS Summonerトップページ',
			},
			{
				label: 'Usage',
				href: '/usage',
				icon: faBook,
				description: 'CSS Summonerの使用方法',
			},
		],
	},
	{
		title: 'Component Document',
		showOnlyIn: ['all'],
		dynamicItems: 'component-docs',
		icon: faCode,
	},
]

/**
 * 現在のページタイプを判定する関数
 * @param {string} pathname - 現在のURL pathname
 * @returns {string} - ページタイプ ('main', 'docs', 'usage', 'other')
 */
export function getPageType(pathname) {
	if (pathname === '/' || pathname === '/index.html' || pathname === '') {
		return 'main'
	} else if (pathname.includes('/component-docs/')) {
		return 'docs'
	} else if (pathname.includes('/usage')) {
		return 'usage'
	}
	return 'other'
}

/**
 * 現在のページに表示すべきナビゲーション項目をフィルタリングする関数
 * @param {string} pathname - 現在のURL pathname
 * @returns {Array} - フィルタリングされたナビゲーション項目
 */
export function getNavigationForPage(pathname) {
	const pageType = getPageType(pathname)

	return navigationItems.filter((group) => {
		// 'all'が指定されているか、現在のページタイプが含まれている場合に表示
		return (
			!group.showOnlyIn ||
			group.showOnlyIn.includes('all') ||
			group.showOnlyIn.includes(pageType)
		)
	})
}
