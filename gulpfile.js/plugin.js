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
	/* css */
	sass:  require('gulp-sass'), // sassの自動コンパイル
	postcss: require('gulp-postcss'), // ベンダープレフィックスの自動付与
	sassGlob:  require('gulp-sass-glob'), // Sassのインポート補助※フォルダ毎
	autoprefixer: require('autoprefixer'), // 対象ブラウザのコントロール
	/* js */
	babelify: require('babelify'), // ECMAScript 2016をECMAScript 2015に変換
	browserify: require('browserify'), // javascript で requireを実現
	source: require('vinyl-source-stream'), // babelifyで使用　※gulpは、vinyl というオブジェクトを用いるため、vinyl-source-stream で変換する
	concat: require('gulp-concat') // javascript で requireを実現
	/*  */
	// rename: require('gulp-rename'),
	// htmlHint: require('gulp-htmlhint'),
	// ejs: require('gulp-ejs'),
	// csscomb: require('gulp-csscomb'),
	// sourcemaps: require('gulp-sourcemaps'),
	// webpack: require('webpack'),
	// webpack_stream: require('webpack-stream'),
	// webpack_config: require('./webpack.config.js')
};