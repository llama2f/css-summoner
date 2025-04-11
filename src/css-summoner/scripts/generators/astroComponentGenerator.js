import componentInterface from './componentInterface.js'

/**
 * 文字列をパスカルケースに変換
 * @param {string} str 変換する文字列
 * @returns {string} パスカルケースに変換された文字列
 */
function toPascalCase(str) {
	if (!str) return ''
	return str
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('')
}

/**
 * デフォルトのAstroコンポーネント文字列を生成する
 * @param {object} componentData - componentInterface.generateComponentPropsから返される形式のデータ
 * @returns {string} 生成されたAstroコンポーネントの文字列
 */
export function generateDefaultAstroComponent(componentData) {
	if (!componentData || !componentData.componentName) {
		console.error(
			'❌ generateDefaultAstroComponent: componentDataまたはcomponentNameが存在しません。'
		)
		return `---
// Error: Invalid component data provided to generateDefaultAstroComponent
---
<div>Error generating component</div>
`
	}

	console.log(
		`⚙️ デフォルトAstroコンポーネント生成中: ${componentData.componentName}`
	)

	try {
		const componentContent =
			componentInterface.generateAstroComponent(componentData)
		return componentContent
	} catch (error) {
		console.error(
			`❌ ${componentData.componentName} のデフォルトAstroコンポーネント生成中にエラーが発生しました:`,
			error
		)
		return `---
// Error generating component: ${componentData.componentName}
// ${error.message}
---
<div>Error generating component: ${componentData.componentName}</div>
`
	}
}
