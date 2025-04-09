import { glob } from 'glob'
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// プロジェクトルートからの相対パスを解決するためのヘルパー
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// スクリプトの場所 (src/css-summoner/scripts) からプロジェクトルート (css-summoner/) を特定
const projectRoot = path.resolve(__dirname, '../../../')
// src ディレクトリのパス
const srcDir = path.resolve(projectRoot, 'src')

// ハンドラーファイルが存在するディレクトリ
const handlersDir = path.resolve(
	projectRoot,
	'src/css-summoner/ui/templates/handlers/auto'
)
// 生成されるマニフェストファイルのパス
const manifestPath = path.resolve(
	projectRoot,
	'src/css-summoner/configs/handler-manifest.json'
)
// globで使用するパターン (OS間の互換性のためにスラッシュを使用)
const handlersGlobPattern = path.join(handlersDir, '*.jsx').replace(/\\/g, '/')

// metadataオブジェクトを抽出する正規表現
const metadataRegex =
	/export\s+const\s+metadata\s*=\s*({(?:[^{}]|{[^{}]*})*});?/

async function generateManifest() {
	console.log(`[Handler Manifest Generator]`)
	console.log(`Project root assumed based on script location: ${projectRoot}`)
	console.log(
		`Searching for handler files in: ${path.relative(projectRoot, handlersDir)}`
	)
	console.log(`Using glob pattern: ${handlersGlobPattern}`)

	const handlerFiles = await glob(handlersGlobPattern)

	if (handlerFiles.length === 0) {
		console.warn('⚠️ No handler files found. Manifest will be empty.')
	} else {
		console.log(`Found ${handlerFiles.length} potential handler files:`)
		handlerFiles.forEach((file) =>
			console.log(`  - ${path.relative(projectRoot, file)}`)
		)
	}

	const manifest = {}

	for (const filePath of handlerFiles) {
		// 実行時の import() で使用するパスを計算 (例: '/src/css-summoner/templates/handlers/auto/button.jsx')
		// src ディレクトリからの相対パスを取得し、先頭に '/' を付ける
		const relativePathFromSrc = path
			.relative(srcDir, filePath)
			.replace(/\\/g, '/')
		const importPath = `/src/${relativePathFromSrc}` // ルートからの絶対パス形式

		const fileName = path.basename(filePath)
		const fileRelativePath = path.relative(projectRoot, filePath)

		try {
			// ファイルの内容をテキストとして読み込む
			const fileContent = await fs.readFile(filePath, 'utf-8')
			// 正規表現でmetadata部分を抽出
			const match = fileContent.match(metadataRegex)

			if (match && match[1]) {
				const metadataString = match[1]
				let metadata
				try {
					// 抽出した文字列をオブジェクトに変換
					metadata = new Function(`return ${metadataString}`)()
				} catch (parseError) {
					console.warn(
						`⚠️ Warning: Skipping ${fileName}. Could not parse metadata object.`
					)
					console.warn(`   Extracted string: ${metadataString}`)
					console.warn(`   Parse error: ${parseError.message}`)
					continue
				}

				if (metadata && typeof metadata === 'object' && metadata.type) {
					const handlerType = metadata.type

					if (manifest[handlerType]) {
						console.warn(
							`⚠️ Warning: Duplicate handler type "${handlerType}" found.`
						)
						console.warn(`   - Existing: ${manifest[handlerType].sourceFile}`)
						console.warn(`   - New:      ${fileRelativePath}`)
						console.warn(`   Overwriting with entry from ${fileName}.`)
					}

					manifest[handlerType] = {
						metadata: metadata,
						path: importPath, // ルートからの絶対パス形式を保存
						sourceFile: fileRelativePath,
					}
					console.log(
						`  👍 Processed: ${fileName} (Type: ${handlerType}, Path: ${importPath})`
					)
				} else {
					console.warn(
						`⚠️ Warning: Skipping ${fileName}. Parsed metadata is invalid or missing 'type' property.`
					)
					console.warn(`   Parsed metadata:`, metadata)
				}
			} else {
				console.warn(
					`⚠️ Warning: Skipping ${fileName}. Could not find 'export const metadata = { ... }' pattern.`
				)
			}
		} catch (error) {
			console.error(`❌ Error processing file ${fileName}:`)
			console.error(error)
		}
	}

	try {
		await fs.mkdir(path.dirname(manifestPath), { recursive: true })
		await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))
		console.log(
			`\n✨ Successfully generated handler manifest: ${path.relative(projectRoot, manifestPath)}`
		)
		console.log(`   Contains ${Object.keys(manifest).length} handlers.`)
	} catch (error) {
		console.error(
			`❌ Error writing manifest file: ${path.relative(projectRoot, manifestPath)}`
		)
		console.error(error)
		process.exit(1)
	}
}

generateManifest()
