// config.cjs - 設定とパスの一元管理
const path = require('path')
const fs = require('fs')
const glob = require('glob')

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
	return path.resolve(__dirname, '../../')
}

/**
 * プロジェクトのルートディレクトリからの相対パスを絶対パスに変換
 * @param {string} relativePath プロジェクトルートからの相対パス
 * @returns {string} 絶対パス
 */
function resolveProjectPath(relativePath) {
	// プロジェクトのルートディレクトリ
	const projectRoot = findProjectRoot()

	// プロジェクトルートのパスをログ出力
	if (!process.env.PROJECT_ROOT_LOGGED) {
		console.log(`プロジェクトルート: ${projectRoot}`)
		process.env.PROJECT_ROOT_LOGGED = 'true'
	}

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
	stylesDir: resolveProjectPath('src/design/css-builder/styles/'),

	// 出力ディレクトリ
	output: {
		cssBuilder: resolveProjectPath('src/design/css-builder/'),
		types: resolveProjectPath('src/design/css-builder/types/'), // 型定義
		docs: resolveProjectPath('src/pages/docs/css/'), // ドキュメント作成先
		components: resolveProjectPath('src/design/css-builder/dist/components/'), // Astroコンポーネントは安全な場所に生成
		backups: resolveProjectPath('src/design/css-builder/backups/'),
	},

	// ファイル名
	files: {
		autoMappings: 'autoClassMappings.js',
		configMappings: 'classMappingsConfig.js',
		indexMappings: 'classMappings.js',
	},
}

// スタイルパターンを取得する関数（thisに依存しない）
paths.getStylesPattern = function () {
	if (!this.stylesDir) {
		console.error('エラー: stylesDir が定義されていません')
		return null
	}

	// index.css以外のCSSファイルを対象にする
	return path.join(this.stylesDir, '*', '*.css')
}
// スタイルファイルを取得する関数（thisに依存しない）
paths.getStyleFiles = function () {
	try {
		const pattern = this.getStylesPattern()

		if (!pattern) {
			console.error('エラー: スタイルパターンが取得できませんでした')
			return []
		}

		console.log(`スタイルパターン: ${pattern}`)
		// globで取得したファイルからindex.cssを除外
		const files = glob
			.sync(pattern)
			.filter((file) => !file.endsWith('/index.css'))
		console.log(`見つかったファイル数: ${files.length}`)
		return files
	} catch (error) {
		console.error('スタイルファイルの検索中にエラーが発生しました:', error)
		return []
	}
}
// 重要なパスが存在するか確認
checkPathExists(paths.stylesDir, 'CSSスタイルディレクトリ')
checkPathExists(paths.output.cssBuilder, 'CSSビルダー出力先')

/**
 * 設定オブジェクト
 */
const config = {
	paths,

	// CSS解析設定
	cssParser: {
		// CSSアノテーションの正規表現パターン（段階的パースに移行したため現在は使用されない）
		metadataRegex:
			/\/\*[\s\n]+\*?\s*@component:\s*([\w-]+)[\s\n]+\*?\s*@variant:\s*([\w-]+)[\s\n]+\*?\s*@description:\s*([^*]+)(?:[\s\n]+\*?\s*@category:\s*([\w-]+))?(?:[\s\n]+\*?\s*@example:\s*([^*]+))?\s*\*\//g,

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
		force: false, // 既存ファイルを確認なしに上書きするかどうか（全体のデフォルト値）

		// 個別ファイルタイプごとの上書き設定
		// ここを変更することで、特定のファイルタイプだけ上書き設定を変更できます
		forceByType: {
			mappings: true, // クラスマッピング関連ファイル
			types: true, // 型定義ファイル
			docs: true, // Astroドキュメントページ（デフォルトで上書き有効）
			components: false, // Astroコンポーネント
		},

		// バックアップの設定
		backup: {
			enabled: true, // バックアップを作成するかどうか
			maxBackups: 5, // 保持する最大バックアップ数（0=無制限）
		},
	},
}

module.exports = config
