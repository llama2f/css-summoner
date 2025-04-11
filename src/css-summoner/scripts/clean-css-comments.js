/**
 * 余計なコメントを削除するスクリプト
 *
 * このスクリプトは、CSSファイル内の余計なコメントを削除し、必要最小限のドキュメンテーションのみを残すためのものです。
 * @component、@variant、@description などの必要なドキュメンテーションは残します。
 *
 * 使用方法:
 * node scripts/clean-css-comments.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// __dirname の代替
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 処理対象のディレクトリ
const styleDir = path.join(__dirname, '..', 'styles')

// 除外するパターン (必要なドキュメント用コメント)
const keepPatterns = [
	/@component:/,
	/@variant:/,
	/@description:/,
	/@category:/,
	/@example:/,
]

// 不要なインライン・1行コメントを削除する関数
function removeInlineComments(content) {
	// 1行コメント (/* コメント */) を削除 ただし keepPatterns にマッチするものは残す
	let result = content.replace(
		/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,
		(match) => {
			// keepPatternsのいずれかにマッチする場合はそのまま残す
			if (keepPatterns.some((pattern) => pattern.test(match))) {
				return match
			}
			// それ以外の場合は削除
			return ''
		}
	)

	// Tailwindのapply後のコメントを削除
	result = result.replace(/@apply[^;]+;(\s*\/\*[^*]*\*\/)/g, (match) => {
		return match.replace(/(\s*\/\*[^*]*\*\/)/, '')
	})

	// CSS宣言後のインラインコメントを削除
	result = result.replace(/:\s*[^;]+;(\s*\/\*[^*]*\*\/)/g, (match) => {
		return match.replace(/(\s*\/\*[^*]*\*\/)/, '')
	})

	// 変数定義後のコメントを削除 (例: --variable: value; /* コメント */)
	result = result.replace(/--[^:]+:\s*[^;]+;(\s*\/\*[^*]*\*\/)/g, (match) => {
		return match.replace(/(\s*\/\*[^*]*\*\/)/, '')
	})

	return result
}

// 空の宣言ブロックを削除する関数
function removeEmptyBlocks(content) {
	// 空のクラス宣言ブロックを削除
	return content.replace(/\.\w+(-\w+)*\s*\{\s*\}/g, '')
}

// 複数の連続した空行を1つにまとめる関数
function normalizeEmptyLines(content) {
	return content.replace(/\n\s*\n\s*\n/g, '\n\n')
}

// ディレクトリ内のすべてのCSSファイルを再帰的に処理する関数
async function processDirectory(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)

		if (entry.isDirectory()) {
			await processDirectory(fullPath)
		} else if (entry.isFile() && path.extname(entry.name) === '.css') {
			console.log(`Processing: ${fullPath}`)

			// ファイルの内容を読み込む
			let content = fs.readFileSync(fullPath, 'utf8')

			// 不要なコメントを削除
			content = removeInlineComments(content)

			// 空の宣言ブロックを削除
			content = removeEmptyBlocks(content)

			// 複数の連続した空行を1つにまとめる
			content = normalizeEmptyLines(content)

			// 処理した内容をファイルに書き戻す
			fs.writeFileSync(fullPath, content, 'utf8')

			console.log(`Cleaned: ${fullPath}`)
		}
	}
}

// メイン処理を実行
;(async function main() {
	try {
		await processDirectory(styleDir)
		console.log('All CSS files have been cleaned successfully!')
	} catch (error) {
		console.error('Error cleaning CSS files:', error)
	}
})()
