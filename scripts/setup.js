// /scripts/setup.js
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

async function generateHandlerManifest() {
	console.log('🔧 ハンドラーマニフェストを生成中...')

	execSync('node src/css-summoner/scripts/generate-handler-manifest.js', {
		stdio: 'inherit',
		cwd: rootDir,
	})
	console.log('✅ ハンドラーマニフェストを生成しました')
}

async function generateAstroComponents() {
	console.log('🔧 Astroコンポーネントを生成中...')

	execSync('tsx src/css-summoner/scripts/generate-astro.js --force', {
		stdio: 'inherit',
		cwd: rootDir,
	})
	console.log('✅ Astroコンポーネントを生成しました')
}

async function setup() {
	console.log('🚀 CSS Summonerのセットアップを開始します...')

	try {
		await generateHandlerManifest()
		await generateAstroComponents()

		console.log('✨ セットアップが完了しました!')
	} catch (error) {
		console.error('❌ セットアップ中にエラーが発生しました:', error.message)
		process.exit(1)
	}
}

// セットアップを実行
setup()
