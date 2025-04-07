まず記憶を思い出してください

CSSコンポーネントの修正、調整をしてください

関連ファイル例
- src/css-summoner/styles/badge cssファイル
- src/css-summoner/templates/handlers/auto/badge.jsx ハンドラファイル
- src/css-summoner/templates/handlers/auto/_template.jsx ハンドラテンプレート
- src/css-builder/docs/stylingGuide.md スタイリングガイド
- src/css-summoner/configs/modifiers.mjs モディファイア調整
- src/css-summoner/configs/sizes.mjs　サイズ調整

ガイドを参考にモノクロベースへスタイルの修正
既存クラスを維持し、基本的にクラスの増減はなし
utilityクラスは@アノテーションは不要
colormixなどを使用し明暗差を表現する

badgeコンポーネントはベースをアイコンなしにする
モディファイアで左右へのアイコン追加、アイコンのみを実装する

悩んだ際は質問してください