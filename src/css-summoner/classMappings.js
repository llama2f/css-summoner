// クラスマッピングのインデックスファイル
// アノテーションデータと手動設定データを統合
import annotationsData from './extracted-annotations.json'; // JSONデータを直接インポート
// configs/index.js から手動設定データをインポート
import { sizes, borderRadiusOptions, modifiers, specialClasses } from './configs/index.js';

// extracted-annotations.json から必要なデータを取得
const {
  componentTypes,
  baseClasses,
  componentVariants,
  classDescriptions,
  componentExamples,
  classRuleDetails // classRuleDetails も取得
} = annotationsData;

// autoClassMappings.js は不要になるため、そこからのインポートは削除

export {
  componentTypes,
  baseClasses,
  componentVariants,
  classDescriptions,
  componentExamples,
  classRuleDetails, // extracted-annotations.json から取得したものをエクスポート
  sizes,
  borderRadiusOptions,
  modifiers,
  specialClasses
};
