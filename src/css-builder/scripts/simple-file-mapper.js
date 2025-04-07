// simple-file-mapper.js - CSSビルダープロジェクトのファイル一覧と役割の自動マッピング (ESM版)
import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import { fileURLToPath } from 'url'

// ESMでは__dirnameは使えないため、import.meta.urlから取得
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 設定
const PROJECT_ROOT =
	process.argv[2] || path.resolve(__dirname, '..') // css-builder ディレクトリを指すように調整
const OUTPUT_FILE =
	process.argv[3] ||
	path.resolve(__dirname, '../docs/file-map.md') // css-builder/docs を指すように調整

// ファイルタイプの説明マッピング
const fileTypeDescriptions = {
	'.jsx': 'Reactコンポーネント',
	'.js': 'JavaScriptモジュール',
	'.mjs': 'JavaScript ES Module', // .mjsも考慮
	'.cjs': 'JavaScript CommonJS Module', // .cjsも考慮
	'.css': 'スタイルシート',
	'.astro': 'Astroコンポーネント',
	'.md': 'Markdownドキュメント', // .mdも追加
}

// ファイル名に基づく特定ファイルの説明
const specialFileDescriptions = {
	'ClassBuilder.jsx': 'メインアプリケーションコンポーネント',
	'classMappings.js': '設定とマッピングのエントリポイント',
	'autoClassMappings.js':
		'CSSアノテーションから自動生成されたコンポーネント情報',
	'css-builder.js': 'CSSファイルからアノテーションを抽出/処理するメインスクリプト', // 拡張子変更
	'index.js': 'モジュールのエクスポート用ファイル',
	'registry.jsx': 'コンポーネントハンドラーの登録管理',
	'templateEngine.jsx': 'テンプレート生成エンジン',
	'common.jsx': '共通ユーティリティと定数',
	'config.js': 'スクリプト設定ファイル', // 拡張子変更
	'css-parser.js': 'CSS解析ロジック', // 拡張子変更
	'type-generator.js': '型定義生成スクリプト', // 拡張子変更
	'utils.js': 'スクリプト共通ユーティリティ', // 拡張子変更
	'astro-generator.js': 'Astroコンポーネント生成スクリプト', // 拡張子変更
	'simple-file-mapper.js': 'このファイルマップ生成スクリプト', // 自分自身
}

// ディレクトリの説明マッピング
const directoryDescriptions = {
	configs: '設定ファイル群 (クラスビルダーUI用)',
	templates: 'コンポーネントプレビューテンプレートシステム',
	'templates/handlers': 'コンポーネントタイプ別のプレビューハンドラー',
	'templates/core': 'テンプレートエンジンのコア機能',
	components: 'UIコンポーネント (React)',
	'components/selectors': '選択UIコンポーネント',
	'components/preview': 'プレビュー関連コンポーネント',
	'components/display': 'コード表示関連コンポーネント',
	'components/common': '共通UIコンポーネント',
	'components/astro': 'UIコンポーネント (Astro)',
	styles: 'CSSスタイルファイル',
	'styles/button': 'Buttonコンポーネント用スタイル',
	'styles/card': 'Cardコンポーネント用スタイル',
	'styles/form': 'Form関連要素用スタイル',
	'styles/heading': 'Headingコンポーネント用スタイル',
	'styles/image': 'Image関連要素用スタイル',
	'styles/infobox': 'Infoboxコンポーネント用スタイル',
	'styles/text': 'Text装飾用スタイル',
	backups: '自動バックアップファイル',
	scripts: 'ビルド・自動化スクリプト',
	types: 'TypeScript型定義',
	'types/css-tyles': 'CSSクラス名に基づく型定義 (自動生成)', // css-tyles -> css-types のタイポ修正の可能性
	hooks: 'Reactカスタムフック',
	layouts: 'Astroレイアウトコンポーネント',
	docs: 'ドキュメントファイル',
}

// ファイルの簡易分析でパターンベースでの自動説明生成
function guessFileRole(filePath, fileContent) {
	const baseName = path.basename(filePath)
	const relativePath = path.relative(PROJECT_ROOT, path.join(PROJECT_ROOT, filePath)) // プロジェクトルートからの相対パス

	// 特定のファイル名に基づく説明 (優先)
	if (specialFileDescriptions[baseName]) {
		return specialFileDescriptions[baseName]
	}

	// 拡張子に基づく基本的な説明
	const ext = path.extname(filePath)
	let description = fileTypeDescriptions[ext] || 'その他のファイル'

	// ファイル内容が与えられていない場合は基本説明を返す
	if (!fileContent) {
		return description
	}

	// パターンベースの説明
	try {
		if (
			fileContent.includes('import React') &&
			(fileContent.includes('function ') || fileContent.includes('=>'))
		) {
			if (baseName.includes('Selector')) {
				description = `${baseName.replace('.jsx', '')} - 選択UIコンポーネント`
			} else if (baseName.includes('Preview')) {
				description = `${baseName.replace('.jsx', '')} - プレビュー表示コンポーネント`
			} else if (baseName.includes('Display')) {
				description = `${baseName.replace('.jsx', '')} - コード表示コンポーネント`
			} else if (baseName.includes('Handler')) {
				const componentType = baseName
					.replace('Handlers.jsx', '')
					.replace('Handler.jsx', '')
				description = `${componentType}コンポーネントのテンプレート生成ハンドラー`
			} else if (relativePath.startsWith('hooks/')) {
				description = `Reactカスタムフック - ${baseName.replace('.jsx', '')}`
			} else if (relativePath.startsWith('components/')) {
				description = `React UIコンポーネント - ${baseName.replace('.jsx', '')}`
			}
		} else if (relativePath.startsWith('configs/') && (ext === '.js' || ext === '.mjs')) {
			const configType = baseName.replace(ext, '')
			description = `${configType}の設定定義 (UI用)`
		} else if (ext === '.css' && fileContent.includes('@component')) {
			description = 'コンポーネントスタイル定義（アノテーション付き）'
		} else if (ext === '.astro') {
			if (relativePath.startsWith('layouts/')) {
				description = `Astroレイアウト - ${baseName.replace('.astro', '')}`
			} else if (relativePath.startsWith('components/astro/')) {
				description = `Astro UIコンポーネント - ${baseName.replace('.astro', '')}`
			} else {
				description = `Astroコンポーネント - ${baseName.replace('.astro', '')}`
			}
		} else if (ext === '.d.ts') {
			description = `TypeScript型定義 - ${baseName.replace('.d.ts', '')}`
		}
	} catch (e) {
		// fileContentが巨大な場合などにエラーになる可能性を考慮
		console.warn(`Warning: ファイル内容の解析中にエラー ${filePath}: ${e.message}`)
	}


	return description
}

// 再帰的にディレクトリを探索してファイル一覧を生成
async function generateFileMap() { // glob.syncをasync版に変更するためasync化
	// ファイルとディレクトリを収集
	const files = await glob('**/*.{js,jsx,css,astro,mjs,cjs,ts,md}', { // 拡張子追加
		cwd: PROJECT_ROOT,
		ignore: ['node_modules/**', 'dist/**', '.git/**', 'backups/**'], // backupsを除外
		nodir: true, // ディレクトリ自体は含めない
	})

	const directories = new Set()
	files.forEach((file) => {
		const dir = path.dirname(file)
		if (dir !== '.') {
			// 親ディレクトリもすべて追加
			let currentPath = ''
			dir.split(path.sep).forEach(part => {
				currentPath = path.join(currentPath, part)
				directories.add(currentPath)
			})
		}
	})

	// マークダウンレポートの構築
	let report = `# CSSビルダー ファイル一覧と役割\n\n`
	report += `*自動生成: ${new Date().toISOString()}*\n\n`

	// ディレクトリ構造の表示（ツリー形式）
	report += `## ディレクトリ構造\n\n\`\`\`\n`
	report += `.\n`
	const sortedDirs = Array.from(directories).sort()
	const tree = {}

    sortedDirs.forEach(dir => {
        let currentLevel = tree;
        const parts = dir.split(path.sep);
        parts.forEach((part, index) => {
            if (!currentLevel[part]) {
                currentLevel[part] = {};
            }
            // 最後の要素でなければ次のレベルへ
            if (index < parts.length - 1) {
                 currentLevel = currentLevel[part];
            } else {
                // 最後の要素なら説明を追加
                currentLevel[part].__description = directoryDescriptions[dir] || `${dir}ディレクトリ`;
            }
        });
    });

	function printTree(level, indent = '  ') {
		Object.keys(level).sort().forEach(key => {
			if (key === '__description') return;
			const description = level[key].__description ? ` (${level[key].__description})` : '';
			report += `${indent}├── ${key}${description}\n`;
			printTree(level[key], indent + '│ ');
		});
	}
	printTree(tree);
	report += `\`\`\`\n\n`;


	// ファイル一覧（ディレクトリごと）
	report += `## ファイル詳細\n\n`

	const fileMapByDir = files.reduce((acc, file) => {
		const dir = path.dirname(file)
		if (!acc[dir]) {
			acc[dir] = []
		}
		acc[dir].push(file)
		return acc
	}, {})

	// ルートファイル
	if (fileMapByDir['.']) {
		report += `### ルート (/)\n\n`
		report += `| ファイル | 役割 |\n`
		report += `|---------|------|\n`
		fileMapByDir['.'].sort().forEach((file) => {
			let fileContent = ''
			try {
				fileContent = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf-8')
			} catch (error) {
				console.warn(
					`Warning: ファイル読み込みエラー ${file}: ${error.message}`
				)
			}
			const description = guessFileRole(file, fileContent)
			report += `| \`${path.basename(file)}\` | ${description} |\n`
		})
		report += `\n`
	}


	// 各ディレクトリのファイル
	sortedDirs.forEach((dir) => {
		if (fileMapByDir[dir]) {
			const dirName = dir // フルパスを表示
			report += `### ${dirName}/\n\n`
			report += `| ファイル | 役割 |\n`
			report += `|---------|------|\n`
			fileMapByDir[dir].sort().forEach((file) => {
				let fileContent = ''
				try {
					fileContent = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf-8')
				} catch (error) {
					console.warn(
						`Warning: ファイル読み込みエラー ${file}: ${error.message}`
					)
				}
				const fileName = path.basename(file)
				const description = guessFileRole(file, fileContent)
				report += `| \`${fileName}\` | ${description} |\n`
			})
			report += `\n`
		}
	})


	// 簡易的な利用方法
	report += `## 使い方\n\n`
	report += `このドキュメントはプロジェクトの全体像を把握するために自動生成されています。\n`
	report += `主要な機能やスクリプトについては以下を参照してください：\n\n`
	report += `*   **UI:** \`ClassBuilder.jsx\` (メインUI), \`components/\` (UI部品)\n`
	report += `*   **状態管理:** \`hooks/useClassBuilder.jsx\`\n`
	report += `*   **プレビュー生成:** \`templates/\`\n`
	report += `*   **スタイル定義:** \`styles/\`\n`
	report += `*   **クラス設定:** \`configs/\`, \`classMappings.js\`, \`autoClassMappings.js\`\n`
	report += `*   **自動化スクリプト:** \`scripts/\` (例: \`css-builder.js\`)\n\n`
	report += `ファイルマップを更新するには：\n\n`
	report += `\`\`\`bash\nnpm run map\n# または\nnode src/css-builder/scripts/simple-file-mapper.js\n\`\`\`\n`

	return report
}

try {
	console.log(`CSSビルダープロジェクトのファイルマップを生成しています...`)
	console.log(`プロジェクトルート: ${PROJECT_ROOT}`)
	console.log(`出力ファイル: ${OUTPUT_FILE}`)

	// generateFileMapを呼び出し、完了を待つ
	generateFileMap().then(report => {
		// 出力ディレクトリが存在するか確認
		const outputDir = path.dirname(OUTPUT_FILE)
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true })
		}

		// レポートを書き出し
		fs.writeFileSync(OUTPUT_FILE, report, 'utf-8')
		console.log(`ファイルマップが正常に生成されました: ${OUTPUT_FILE}`)
	}).catch(error => {
		console.error(`ファイルマップ生成中にエラーが発生しました: ${error.message}`)
		process.exit(1)
	})

} catch (error) {
	console.error(`スクリプト実行エラー: ${error.message}`)
	process.exit(1)
}