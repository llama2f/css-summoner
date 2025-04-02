// simple-file-mapper.js - CSSビルダープロジェクトのファイル一覧と役割の自動マッピング
const fs = require('fs')
const path = require('path')
const glob = require('glob')

// 設定
const PROJECT_ROOT =
	process.argv[2] || path.resolve(__dirname, '../src/css-builder')
const OUTPUT_FILE =
	process.argv[3] ||
	path.resolve(__dirname, '../src/css-builder/docs/file-map.md')

// ファイルタイプの説明マッピング
const fileTypeDescriptions = {
	'.jsx': 'Reactコンポーネント',
	'.js': 'JavaScriptモジュール',
	'.css': 'スタイルシート',
	'.astro': 'Astroコンポーネント',
}

// ファイル名に基づく特定ファイルの説明
const specialFileDescriptions = {
	'ClassBuilder.jsx': 'メインアプリケーションコンポーネント',
	'classMappings.js': '設定とマッピングのエントリポイント',
	'autoClassMappings.js':
		'CSSアノテーションから自動生成されたコンポーネント情報',
	'extract-classes.cjs': 'CSSファイルからアノテーションを抽出するスクリプト',
	'index.js': 'モジュールのエクスポート用ファイル',
	'registry.jsx': 'コンポーネントハンドラーの登録管理',
	'templateEngine.jsx': 'テンプレート生成エンジン',
	'common.jsx': '共通ユーティリティと定数',
}

// ディレクトリの説明マッピング
const directoryDescriptions = {
	configs: '設定ファイル群',
	templates: 'テンプレートシステム',
	'templates/handlers': 'コンポーネントタイプ別のハンドラー',
	'templates/core': 'テンプレートエンジンのコア機能',
	components: 'UIコンポーネント',
	'components/selectors': '選択UIコンポーネント',
	'components/preview': 'プレビュー関連コンポーネント',
	'components/display': 'コード表示関連コンポーネント',
	styles: 'CSSスタイルファイル',
	backups: 'バックアップファイル',
}

// ファイルの簡易分析でパターンベースでの自動説明生成
function guessFileRole(fileName, fileContent) {
	const baseName = path.basename(fileName)

	// 拡張子に基づく基本的な説明
	const ext = path.extname(fileName)
	let description = fileTypeDescriptions[ext] || 'その他のファイル'

	// 特定のファイル名に基づく説明
	if (specialFileDescriptions[baseName]) {
		return specialFileDescriptions[baseName]
	}

	// ファイル内容が与えられていない場合は基本説明を返す
	if (!fileContent) {
		return description
	}

	// パターンベースの説明
	if (
		fileContent.includes('import React') &&
		(fileContent.includes('function ') || fileContent.includes('=>'))
	) {
		if (baseName.includes('Selector')) {
			return `${baseName.replace('.jsx', '')} - 選択UIコンポーネント`
		}
		if (baseName.includes('Preview')) {
			return `${baseName.replace('.jsx', '')} - プレビュー表示コンポーネント`
		}
		if (baseName.includes('Display')) {
			return `${baseName.replace('.jsx', '')} - コード表示コンポーネント`
		}
		if (baseName.includes('Handler')) {
			const componentType = baseName
				.replace('Handlers.jsx', '')
				.replace('Handler.jsx', '')
			return `${componentType}コンポーネントのテンプレート生成ハンドラー`
		}
	}

	if (fileName.includes('configs/') && ext === '.js') {
		const configType = baseName.replace('.js', '')
		return `${configType}の設定定義`
	}

	if (ext === '.css' && fileContent.includes('@component')) {
		return 'コンポーネントスタイル定義（アノテーション付き）'
	}

	return description
}

// 再帰的にディレクトリを探索してファイル一覧を生成
function generateFileMap() {
	// ファイルとディレクトリを収集
	const files = glob.sync('**/*.{js,jsx,css,astro}', {
		cwd: PROJECT_ROOT,
		ignore: ['node_modules/**', 'dist/**', '.git/**'],
	})

	const directories = new Set()
	files.forEach((file) => {
		const dir = path.dirname(file)
		if (dir !== '.') {
			directories.add(dir)
		}
	})

	// マークダウンレポートの構築
	let report = `# CSSビルダー ファイル一覧と役割\n\n`
	report += `*自動生成: ${new Date().toISOString()}*\n\n`

	// ディレクトリ一覧
	report += `## ディレクトリ構造\n\n`
	report += `| ディレクトリ | 説明 |\n`
	report += `|------------|------|\n`

	// ルートディレクトリを追加
	report += `| \`/\` | プロジェクトルート |\n`

	// ソート済みのディレクトリ一覧を追加
	Array.from(directories)
		.sort()
		.forEach((dir) => {
			const description = directoryDescriptions[dir] || `${dir}ディレクトリ`
			report += `| \`/${dir}/\` | ${description} |\n`
		})

	// コアファイル（ルートにあるファイル）
	const rootFiles = files.filter((file) => !file.includes('/'))
	if (rootFiles.length > 0) {
		report += `\n## コアファイル\n\n`
		report += `| ファイル | 役割 |\n`
		report += `|---------|------|\n`

		rootFiles.sort().forEach((file) => {
			let fileContent = ''
			try {
				fileContent = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf-8')
			} catch (error) {
				console.warn(
					`Warning: ファイル読み込みエラー ${file}: ${error.message}`
				)
			}

			const description = guessFileRole(file, fileContent)
			report += `| \`${file}\` | ${description} |\n`
		})
	}

	// ディレクトリごとのファイル一覧
	Array.from(directories)
		.sort()
		.forEach((dir) => {
			const dirFiles = files.filter((file) => file.startsWith(`${dir}/`))
			if (dirFiles.length > 0) {
				const dirName = dir.split('/').pop() // 最後のディレクトリ名を取得
				report += `\n## ${dirName} (${dir})\n\n`
				report += `| ファイル | 役割 |\n`
				report += `|---------|------|\n`

				dirFiles.sort().forEach((file) => {
					let fileContent = ''
					try {
						fileContent = fs.readFileSync(
							path.join(PROJECT_ROOT, file),
							'utf-8'
						)
					} catch (error) {
						console.warn(
							`Warning: ファイル読み込みエラー ${file}: ${error.message}`
						)
					}

					const fileName = path.basename(file)
					const description = guessFileRole(file, fileContent)
					report += `| \`${fileName}\` | ${description} |\n`
				})
			}
		})

	// 簡易的な利用方法
	report += `\n## 使い方\n\n`
	report += `このドキュメントはプロジェクトの全体像を把握するために自動生成されています。\n`
	report += `主要コンポーネントの関係性や詳細については以下を参照してください：\n\n`
	report += `1. \`ClassBuilder.jsx\` - メインのReactコンポーネント\n`
	report += `2. \`classMappings.js\` - 設定とマッピングのエントリポイント\n`
	report += `3. \`extract-classes.cjs\` - CSSアノテーション抽出スクリプト\n`
	report += `4. \`templates/\` - テンプレート生成システム\n\n`
	report += `ファイルマップを更新するには：\n\n`
	report += `\`\`\`bash\nnode simple-file-mapper.js [プロジェクトルートパス] [出力ファイルパス]\n\`\`\`\n`

	return report
}

try {
	console.log(`CSSビルダープロジェクトのファイルマップを生成しています...`)
	console.log(`プロジェクトルート: ${PROJECT_ROOT}`)
	console.log(`出力ファイル: ${OUTPUT_FILE}`)

	const report = generateFileMap()

	// 出力ディレクトリが存在するか確認
	const outputDir = path.dirname(OUTPUT_FILE)
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true })
	}

	// レポートを書き出し
	fs.writeFileSync(OUTPUT_FILE, report, 'utf-8')
	console.log(`ファイルマップが正常に生成されました: ${OUTPUT_FILE}`)
} catch (error) {
	console.error(`エラーが発生しました: ${error.message}`)
	process.exit(1)
}
