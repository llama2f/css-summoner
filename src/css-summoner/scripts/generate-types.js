import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import config from './config.js'
import typeGenerator from './generators/type-generator.js'
import { logger, fileUtils } from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

async function main() {
	logger.info('型定義生成スクリプトを開始します...')

	const annotationsPath = path.resolve(
		projectRoot,
		'extracted-annotations.json'
	)
	const typesDir = config.paths.output.types

	try {
		logger.verbose(`アノテーションファイルを読み込みます: ${annotationsPath}`)
		const annotationsContent = await fs.readFile(annotationsPath, 'utf-8')
		const componentData = JSON.parse(annotationsContent)
		logger.info('アノテーションファイルの読み込みと解析が完了しました。')

		const configData = config

		if (!(await fileUtils.ensureDirectoryExists(typesDir))) {
			logger.error(`型定義ディレクトリの作成/確認に失敗しました: ${typesDir}`)
			process.exit(1)
		}
		logger.verbose(`型定義出力先ディレクトリ: ${typesDir}`)

		logger.info('型定義の生成を開始します...')
		const success = await typeGenerator.generateTypeDefinitions(
			componentData,
			configData,
			typesDir
		)

		if (success) {
			logger.info('型定義の生成が正常に完了しました。')
		} else {
			logger.error('型定義の生成中にエラーが発生しました。')
			process.exit(1)
		}
	} catch (error) {
		logger.error('型定義生成プロセスで予期せぬエラーが発生しました:', error)
		process.exit(1)
	}
}

main()
