/*
 * 初期関数
 */
// **********************************************
// require
// **********************************************
// const $ = require('./plugin');


// import gulp  from 'gulp';
// /* 制御系 */
// import plumber from 'gulp-plumber'; // エラーが原因でタスクが強制停止することを防止するモジュール
// import notify from 'gulp-notify'; // デスクトップ通知が行えるモジュール
// import watch from 'gulp-watch'; // ファイル監視
// import requireDir from 'require-dir'; // タスク毎にファイルを分割する
// import browserSync from 'browser-sync').create(), // 自動リロード
// import path from 'path'; // ファイルパス
// import pump from 'pump'; //
// import gzip  from 'gulp-gzip'; // CSS/jsのgzip化
// import frontnote  from 'gulp-frontnote'; // フォントスタイル
// import del from 'del';  // 削除タスク
// /* css */
// import sass  from 'gulp-sass'; // sassの自動コンパイル
// import postCss from 'gulp-postcss'; // ベンダープレフィックスの自動付与
// import sassGlob  from 'gulp-sass-glob'; // Sassのインポート補助※フォルダ毎
// import cached  from 'gulp-cached'; // Sassの依存関係は把握するプラグイン
// import progeny  from 'gulp-progeny'; // Sassの依存関係は把握するプラグイン
// import autoprefixer from 'autoprefixer'; // 対象ブラウザのコントロール
// import mqpacker from 'css-mqpacker'; // バラバラになったメディアクエリをまとめる
// import mqpackerSort from 'sort-css-media-queries'; // mqpackerのソートプロパティ
// import cssDeclarationSorter  from 'css-declaration-sorter'; // CSSプロパティの記述順を自動でソートする
// import cssMinify  from 'gulp-clean-css'; // CSSのmin化※圧縮
// /* js */
// import babelify from 'babelify'; // ECMAScript 2016をECMAScript 2015に変換
// import browserify from 'browserify'; // javascript で requireを実現
// import source from 'vinyl-source-stream'; // babelifyで使用　※gulpは、vinyl というオブジェクトを用いるため、vinyl-source-stream で変換する
// import concat from 'gulp-concat'; // Javascriptの結合
// import uglify  from 'gulp-uglify'; // jsのmin化※圧縮
// import uglifyPump from 'pump'; // gulp-uglifyでerrorを出力するためのプラグイン
// /* pug */
// import pug from 'gulp-pug'; // HTMLを書くためのテンプレートエンジン
// import data from 'gulp-data'; // jsonデータの取得とテンプレートにデータを送信
// import fs from 'fs'; // ディレクトリの存在の有無
// /* img */
// import imagemin from 'gulp-imagemin'; // 画像圧縮
// import pngquant from 'imagemin-pngquant'; // 「gulp-imagemin」でpngプロパティを使用するためのプラグイン
// import mozjpeg from 'imagemin-mozjpeg'); // 「gulp-imagemin」でjpgプロパティを使用するためのプラグイン

// const config = require('./config');
// const task_watch = require('./task/watch');
// const task_browserSync = require('./task/browserSync');

// // **********************************************
// // task set
// // **********************************************

// // watch
// $.gulp.task('watch', done => {
// 	task_watch.taskMove();
// 	// console.log('watch!!!');
// 	done();
// });

// // browserSync
// $.gulp.task('browserSync', done => {
// 	task_browserSync.taskMove();
// 	// console.log('browserSync!!!');
// 	done();
// });

// // default
// $.gulp.task('default', $.gulp.series('watch', 'browserSync', done => {
// 	done();
// }));




const { src, dest, watch, series, parallel } = require('gulp'),
  config = require('./config'),
  { taskBrowserSync } = require("./task/browserSync"),
  { taskSass } = require("./task/sass"),
  { taskCssmini } = require("./task/sass"),
  { taskPug } = require("./task/pug"),
  { taskConcat } = require("./task/js_concat"),
  { taskImagemin } = require("./task/imagemin"),
  { taskFrontnote } = require("./task/frontnote"),
  { taskBabelify } = require("./task/babelify"),
  { taskGzip } = require("./task/gzip");

// コンテンツ更新の際はブラウザをリロードする
const taskWatch = done => {
  watch([config.root.src + config.pug.targetFile], taskPug)
  watch([config.root.src + config.sass.targetFile], taskSass)
  watch([config.root.src + config.concat.targetFile], taskConcat)
  watch([config.root.src + config.imagemin.targetFile], taskImagemin)
  watch([config.root.src + config.babelify.targetFile], taskBabelify)
  done()
}

// 個別のタスクを呼び出せるように定義（gulp html など）
exports.browserSync = taskBrowserSync
exports.sass = taskSass
// exports.sass = series(taskSass,taskGzip)
// exports.cssmini = taskCssmini
exports.pug = taskPug
exports.concat = taskConcat // Javascriptの結合
exports.imagemin = taskImagemin  // 画像の圧縮
exports.frontnote = taskFrontnote  // フォントスタイル
exports.babelify = taskBabelify  // ES6をES5に変換

// ビルドタスクの設定。gulp buildを実行した時。サーバーは立ち上げたくないけど、ビルドだけしたい時に使う
exports.build = parallel(taskSass,taskPug,taskConcat,taskImagemin,taskFrontnote,taskBabelify)

// gulp 実行時に発火させるデフォルトタスク
exports.default = series(/* parallel(taskSass,taskPug,taskConcat,taskImagemin, taskFrontnote ,taskBabelify ), */parallel(taskWatch, taskBrowserSync))


// gulp 実行時に発火させるデフォルトタスク
// exports.default = series(taskBrowserSync,taskSass,taskPug,taskConcat,taskImagemin,taskFrontnote,taskBabelify)