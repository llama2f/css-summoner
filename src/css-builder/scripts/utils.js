// utils.js - 共通のユーティリティ関数 (ESM版)
import fs from 'fs';
import path from 'path';
// config.js をインポート (後で config.cjs から変換)
import config from './config.js';

/**
 * ロギングユーティリティ
 */
export const logger = {
  // エラーと警告のカウンター
  _errorCount: 0,
  _warningCount: 0,

  /**
   * エラーカウントを取得
   * @returns {number} エラー数
   */
  getErrorCount: () => logger._errorCount,

  /**
   * 警告カウントを取得
   * @returns {number} 警告数
   */
  getWarningCount: () => logger._warningCount,

  /**
   * カウンターをリセット
   */
  resetCounters: () => {
    logger._errorCount = 0;
    logger._warningCount = 0;
  },

  /**
   * 情報ログを出力
   * @param {string} message ログメッセージ
   */
  info: (message) => {
    if (!config.logging.silent) {
      console.log(`[INFO] ${message}`);
    }
  },

  /**
   * 詳細ログを出力（verboseモードの場合のみ）
   * @param {string} message ログメッセージ
   */
  verbose: (message) => {
    if (config.logging.verbose && !config.logging.silent) {
      console.log(`[VERBOSE] ${message}`);
    }
  },

  /**
   * 警告ログを出力
   * @param {string} message 警告メッセージ
   */
  warn: (message) => {
    logger._warningCount++;
    if (!config.logging.silent) {
      console.warn(`[WARNING] ${message}`);
    }
  },

  /**
   * エラーログを出力
   * @param {string} message エラーメッセージ
   * @param {Error} [error] エラーオブジェクト（省略可）
   */
  error: (message, error) => {
    logger._errorCount++;
    console.error(`[ERROR] ${message}`);
    if (error && config.logging.verbose) {
      console.error(error);
    }
  }
};

/**
 * ファイル操作ユーティリティ
 */
export const fileUtils = {
  /**
   * ディレクトリが存在しない場合に作成する
   * @param {string} dirPath ディレクトリパス
   * @returns {boolean} 成功したかどうか
   */
  ensureDirectoryExists: (dirPath) => {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        logger.verbose(`ディレクトリを作成しました: ${dirPath}`);
      }
      return true;
    } catch (error) {
      logger.error(`ディレクトリの作成に失敗しました: ${dirPath}`, error);
      return false;
    }
  },

  /**
   * ファイルをバックアップする
   * @param {string} filePath バックアップするファイルのパス
   * @returns {string|null} バックアップファイルのパス、またはnull（失敗時）
   */
  createBackup: (filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        // タイムスタンプ付きのバックアップ名を生成
        const timestamp = new Date()
          .toISOString()
          .replace(/[:.]/g, '-')
          .replace('T', '_')
          .split('Z')[0];

        const backupDir = config.paths.output.backups;

        // バックアップディレクトリの存在確認
        fileUtils.ensureDirectoryExists(backupDir);

        const fileName = path.basename(filePath);
        const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`);

        // ファイルをコピー
        fs.copyFileSync(filePath, backupPath);
        logger.info(`バックアップを作成しました: ${backupPath}`);

        return backupPath;
      }
      return null;
    } catch (error) {
      logger.error(`バックアップの作成に失敗しました: ${filePath}`, error);
      return null;
    }
  },

  /**
   * ファイルに内容を書き込む（安全に）
   * @param {string} filePath 書き込み先ファイルパス
   * @param {string} content 書き込む内容
   * @param {boolean} [createBackup=true] バックアップを作成するかどうか
   * @returns {boolean} 成功したかどうか
   */
  writeFileSafely: (filePath, content, createBackup = true) => {
    try {
      // ディレクトリの存在確認
      const dirPath = path.dirname(filePath);
      fileUtils.ensureDirectoryExists(dirPath);

      // バックアップの作成（必要な場合）
      if (createBackup && fs.existsSync(filePath)) {
        fileUtils.createBackup(filePath);
      }

      // ファイルの書き込み
      fs.writeFileSync(filePath, content, 'utf8');
      logger.info(`ファイルを保存しました: ${filePath}`);

      return true;
    } catch (error) {
      logger.error(`ファイルの書き込みに失敗しました: ${filePath}`, error);
      return false;
    }
  },

  /**
   * ファイルから内容を読み込む（安全に）
   * @param {string} filePath 読み込むファイルのパス
   * @param {string} [defaultContent=''] ファイルが存在しない場合のデフォルト内容
   * @returns {string} ファイルの内容、またはデフォルト内容（読み込みに失敗した場合）
   */
  readFileSafely: (filePath, defaultContent = '') => {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      }
      return defaultContent;
    } catch (error) {
      logger.error(`ファイルの読み込みに失敗しました: ${filePath}`, error);
      return defaultContent;
    }
  },

  /**
   * ファイルを安全に書き込む（上書き防止機能付き）
   * @param {string} filePath 書き込み先ファイルパス
   * @param {string} content 書き込む内容
   * @param {Object} options オプション {force: 強制上書きするか, backup: バックアップを作成するか}
   * @returns {boolean} 成功したかどうか
   */
  safeWriteFile: (filePath, content, options = {}) => {
    const { force = config.fileOperations.force, backup = true } = options;

    try {
      // ファイルが存在するか確認
      if (fs.existsSync(filePath) && !force) {
        logger.warn(`ファイルが既に存在します: ${filePath}`);
        logger.info('上書きを強制するには --force オプションを使用してください。');
        return false;
      }

      // ディレクトリの存在確認
      const dirPath = path.dirname(filePath);
      fileUtils.ensureDirectoryExists(dirPath);

      // バックアップの作成（必要な場合）
      if (backup && fs.existsSync(filePath)) {
        fileUtils.createBackup(filePath);
      }

      // ファイルの書き込み
      fs.writeFileSync(filePath, content, 'utf8');
      logger.info(`ファイルを保存しました: ${filePath}`);

      return true;
    } catch (error) {
      logger.error(`ファイルの書き込みに失敗しました: ${filePath}`, error);
      return false;
    }
  }
};

/**
 * 文字列操作ユーティリティ
 */
export const stringUtils = {
  /**
   * キャメルケースをパスカルケースに変換
   * @param {string} str 変換する文字列
   * @returns {string} パスカルケース形式の文字列
   */
  toPascalCase: (str) => {
    if (!str) return ''; // null や undefined の場合のエラー回避
    return str
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  },

  /**
   * バリアントクラスからバリアント名を抽出
   * 例: btn-primary → primary
   * @param {string} variantClass バリアントクラス
   * @returns {string} バリアント名
   */
  extractVariantName: (variantClass) => {
    if (!variantClass) return '';
    const parts = variantClass.split('-');
    return parts.slice(1).join('-');
  },

  /**
   * サイズクラスからサイズ名を抽出
   * 例: btn-lg → lg
   * @param {string} sizeClass サイズクラス
   * @returns {string} サイズ名
   */
  extractSizeName: (sizeClass) => {
    if (!sizeClass) return '';
    const parts = sizeClass.split('-');
    return parts[parts.length - 1];
  },

  /**
   * モディファイアクラスから名前を抽出
   * 例: btn-shadow → shadow
   * @param {string} modifierClass モディファイアクラス
   * @returns {string} モディファイア名
   */
  extractModifierName: (modifierClass) => {
    if (!modifierClass) return '';
    const parts = modifierClass.split('-');
    return parts.slice(1).join('-');
  }
};