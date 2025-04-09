// config.js - 設定とパスの一元管理 (ESM版)
import path from 'path'
import fs from 'fs'
import { globSync } from 'glob' // globSync をインポート
import { fileURLToPath } from 'url'

// ESMでは__dirnameは使えないため、import.meta.urlから取得
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * プロジェクトのルートディレクトリを探索して取得する
 * package.jsonがある最も近い親ディレクトリをプロジェクトルートとする
 * @returns {string} プロジェクトルートの絶対パス
 */
function findProjectRoot() {
	let currentDir = __dirname
	// 最大10階層まで遡って探索
	for (let i = 0; i < 10; i++) {
		// package.jsonがあればそのディレクトリをプロジェクトルートとする
		if (fs.existsSync(path.join(currentDir, 'package.json'))) {
			return currentDir
		}
		// 親ディレクトリに移動
		const parentDir = path.dirname(currentDir)
		if (parentDir === currentDir) {
			// これ以上親がない場合は探索終了
			break
		}
		currentDir = parentDir
	}

	// 見つからない場合は現在のディレクトリから2階層上をデフォルトとする
	console.warn(
		'package.jsonが見つからないため、現在のディレクトリから2階層上をプロジェクトルートとします。'
	)
	// このスクリプトは css-summoner/scripts にあるので、../../ はプロジェクトルートになるはず
	return path.resolve(__dirname, '../../')
}

// プロジェクトルートを一度だけ計算
const projectRoot = findProjectRoot()

// プロジェクトルートのパスをログ出力 (一度だけ)
if (!process.env.PROJECT_ROOT_LOGGED) {
	console.log(`プロジェクトルート: ${projectRoot}`)
	process.env.PROJECT_ROOT_LOGGED = 'true'
}

/**
 * プロジェクトのルートディレクトリからの相対パスを絶対パスに変換
 * @param {string} relativePath プロジェクトルートからの相対パス
 * @returns {string} 絶対パス
 */
function resolveProjectPath(relativePath) {
	return path.join(projectRoot, relativePath)
}

// 実際のパスが存在するか確認し、警告を出力する関数
function checkPathExists(pathToCheck, description) {
	if (!fs.existsSync(pathToCheck)) {
		console.warn(`警告: ${description}のパスが存在しません: ${pathToCheck}`)
	}
}

/**
 * プロジェクト全体で使用するパス設定
 * すべてのパスはここで一元管理し、他のスクリプトから参照する
 */
const paths = {
	// ソースディレクトリ
	stylesDir: resolveProjectPath('src/css-summoner/styles/'),
	handlersDir: resolveProjectPath(
		'src/css-summoner/ui/templates/handlers/auto/'
	), // ハンドラーディレクトリ

	// 出力ディレクトリ
	output: {
		cssBuilder: resolveProjectPath('src/css-summoner/'),
		types: resolveProjectPath('src/css-summoner/types/'), // 型定義
		docs: resolveProjectPath('src/pages/css-summoner/'), // ドキュメント作成先
		components: resolveProjectPath('src/css-summoner/dist/components/'), // Astroコンポーネントは安全な場所に生成
		backups: resolveProjectPath('src/css-summoner/backups/'),
	},

	// ファイル名
	files: {
		indexMappings: 'classMappings.js',
	},
}

// スタイルパターンを取得する関数（paths オブジェクトを参照するように修正）
paths.getStylesPattern = function () {
	if (!paths.stylesDir) {
		// this -> paths
		console.error('エラー: stylesDir が定義されていません')
		return null
	}

	// index.css以外のCSSファイルを対象にする
	return path.join(paths.stylesDir, '*', '*.css') // this -> paths
}
// スタイルファイルを取得する関数（paths オブジェクトを参照するように修正）
paths.getStyleFiles = function () {
	try {
		const pattern = paths.getStylesPattern() // this -> paths

		if (!pattern) {
			console.error('エラー: スタイルパターンが取得できませんでした')
			return []
		}

		// console.log(`スタイルパターン: ${pattern}`); // デバッグ用ログはコメントアウト推奨
		// globSyncで取得したファイルからindex.cssを除外
		const files = globSync(pattern) // glob.sync -> globSync
			.filter((file) => !file.endsWith('/index.css'))
		// console.log(`見つかったファイル数: ${files.length}`); // デバッグ用ログはコメントアウト推奨
		return files
	} catch (error) {
		console.error('スタイルファイルの検索中にエラーが発生しました:', error)
		return []
	}
}
// 重要なパスが存在するか確認
checkPathExists(paths.stylesDir, 'CSSスタイルディレクトリ')
checkPathExists(paths.handlersDir, 'ハンドラーディレクトリ')
checkPathExists(paths.output.cssBuilder, 'CSSビルダー出力先')
checkPathExists(paths.output.components, 'Astroコンポーネント出力先')

/**
 * 設定オブジェクト
 */
const config = {
	paths,

	// CSS解析設定
	cssParser: {
		// 認識するアノテーションタグ
		recognizedTags: [
			'@component:',
			'@variant:',
			'@description:',
			'@category:',
			'@example:',
		],

		// 必須タグ
		requiredTags: ['@component:', '@variant:', '@description:'],
	},

	// 型生成設定
	typeGenerator: {
		// 型のインターフェイス命名規則
		interfaceNameSuffix: 'Props',
	},

	// ロギング設定
	logging: {
		verbose: false, // 詳細なログを表示するかどうか
		silent: false, // 最小限のログだけを表示するかどうか
	},

	// ファイル上書き設定
	fileOperations: {
		// グローバル設定（コマンドラインの--forceオプションで上書き可能）
		force: true, // 既存ファイルを確認なしに上書きするかどうか（全体のデフォルト値）

		// 個別ファイルタイプごとの上書き設定
		// ここを変更することで、特定のファイルタイプだけ上書き設定を変更できます
		forceByType: {
			mappings: true, // クラスマッピング関連ファイル
			types: true, // 型定義ファイル
			docs: true, // Astroドキュメントページ（デフォルトで上書き有効）
			components: true, // Astroコンポーネント
		},

		// バックアップの設定
		backup: {
			enabled: true, // バックアップを作成するかどうか
			maxBackups: 5, // 保持する最大バックアップ数（0=無制限）
		},
	},
}

export default config // module.exports -> export default
