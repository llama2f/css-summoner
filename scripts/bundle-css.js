/**
 * CSS結合・圧縮スクリプト
 *
 * 指定したCSSファイルのみを選択的に結合し、minifyします
 */
import fs from 'fs-extra'
import path from 'path'
import postcss from 'postcss'
import cssnano from 'cssnano'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

// 現在のファイルの__dirnameを取得（ESモジュールでは直接使えないため）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 設定
const CONFIG = {
	// 対象CSSファイルのパターン（相対パス）
	sourcePath: './src/css-summoner/styles',
	// 出力先ディレクトリ
	outputDir: './public/assets',
	// 出力ファイル名
	outputFilename: 'css-summoner-bundle.min.css',
	// 除外するパターン
	excludePatterns: ['**/no-bundle/**'],
}

async function bundleCss() {
	try {
		console.log('CSSバンドル処理を開始します...')

		// プロジェクトルートディレクトリ取得
		const rootDir = process.cwd()

		// 出力ディレクトリの作成（なければ）
		const outputPath = path.join(rootDir, CONFIG.outputDir)
		await fs.ensureDir(outputPath)

		// 全CSSファイルの内容を結合
		let combinedCss = ''

		// globパターンでCSSファイルを検索
		const cssPattern = path.join(rootDir, CONFIG.sourcePath, '**/*.css')
		console.log(`CSSファイル検索パターン: ${cssPattern}`)

		// 除外パターンを絶対パスに変換
		const excludePatterns = CONFIG.excludePatterns.map((pattern) =>
			path.join(rootDir, CONFIG.sourcePath, pattern)
		)

		// CSSファイル検索
		const cssFiles = await glob(cssPattern, {
			ignore: excludePatterns,
		})

		// 見つかったファイル数を表示
		console.log(`検索結果: ${cssFiles.length}ファイルが見つかりました`)

		// 各ファイルを読み込んで結合
		for (const fullPath of cssFiles) {
			// パスを相対パスとして表示
			const relativePath = path.relative(rootDir, fullPath)
			console.log(`ファイル読み込み中: ${relativePath}`)

			// CSSファイル読み込み
			const css = await fs.readFile(fullPath, 'utf8')
			combinedCss += `/* Source: ${relativePath} */\n${css}\n\n`
		}

		// PostCSSでminify処理
		const result = await postcss([
			cssnano({
				preset: [
					'default',
					{
						discardComments: {
							removeAll: true,
						},
					},
				],
			}),
		]).process(combinedCss, { from: undefined })

		// 出力ファイルパス
		const outputFilePath = path.join(outputPath, CONFIG.outputFilename)

		// 結果を書き込み
		await fs.writeFile(outputFilePath, result.css)

		// ファイルサイズを取得（KB単位）
		const stats = await fs.stat(outputFilePath)
		const fileSizeKB = (stats.size / 1024).toFixed(2)

		console.log(`CSSバンドル処理が完了しました！`)
		console.log(`出力ファイル: ${outputFilePath}`)
		console.log(`ファイルサイズ: ${fileSizeKB} KB`)

		return true
	} catch (error) {
		console.error('CSSバンドル処理でエラーが発生しました:', error)
		return false
	}
}

// スクリプトが直接実行された場合のみ実行
if (import.meta.url === `file://${process.argv[1]}`) {
	bundleCss()
}

export default bundleCss
