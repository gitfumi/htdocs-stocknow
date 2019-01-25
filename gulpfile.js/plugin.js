// **********************************************
// プラグインリスト
// **********************************************
module.exports = {
	gulp:  require('gulp'),
	/* 制御系 */
	plumber: require('gulp-plumber'), // エラーが原因でタスクが強制停止することを防止するモジュール
	notify: require('gulp-notify'), // デスクトップ通知が行えるモジュール
	watch: require('gulp-watch'), // ファイル監視
	requireDir: require('require-dir'), // タスク毎にファイルを分割する
	browserSync: require('browser-sync').create(), // 自動リロード
	path: require('path'), // ファイルパス
	pump: require('pump'), // ファイルパス
	gzip : require('gulp-gzip'), // CSS/jsのgzip化
	frontnote : require('gulp-frontnote'), // フォントスタイル
	/* css */
	sass:  require('gulp-sass'), // sassの自動コンパイル
	postCss: require('gulp-postcss'), // ベンダープレフィックスの自動付与
	sassGlob:  require('gulp-sass-glob'), // Sassのインポート補助※フォルダ毎
	autoprefixer: require('autoprefixer'), // 対象ブラウザのコントロール
	mqpacker: require('css-mqpacker'), // バラバラになったメディアクエリをまとめる
	mqpackerSort: require('sort-css-media-queries'), // mqpackerのソートプロパティ
	cssDeclarationSorter : require('css-declaration-sorter'), // CSSプロパティの記述順を自動でソートする
	cssMinify : require('gulp-clean-css'), // CSSのmin化※圧縮
	/* js */
	babelify: require('babelify'), // ECMAScript 2016をECMAScript 2015に変換
	browserify: require('browserify'), // javascript で requireを実現
	source: require('vinyl-source-stream'), // babelifyで使用　※gulpは、vinyl というオブジェクトを用いるため、vinyl-source-stream で変換する
	concat: require('gulp-concat'), // Javascriptの結合
	uglify : require('gulp-uglify'), // jsのmin化※圧縮
	uglifyPump: require('pump') // gulp-uglifyでerrorを出力するためのプラグイン
};