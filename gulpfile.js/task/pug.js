/*
 * HTMLを書くためのテンプレートエンジン
 */
// **********************************************
// require
// **********************************************
const config = require('../config'),
	gulp = require('gulp');
	progeny = require('gulp-progeny'), // Sassの依存関係は把握するプラグイン
	plumber = require('gulp-plumber'), // エラーが原因でタスクが強制停止することを防止するモジュール
	pug = require('gulp-pug'), // HTMLを書くためのテンプレートエンジン
	data = require('gulp-data'), // jsonデータの取得とテンプレートにデータを送信
	notify = require('gulp-notify'), // デスクトップ通知が行えるモジュール
	fs = require('fs'); // ディレクトリの存在の有無

// **********************************************
// Pug set
// **********************************************
module.exports = {

	/* --------------------
		 通常のPugタスク
	----------------------*/
	taskPug: () => {

		return gulp
			.src(config.root.src + config.pug.targetFile, { base: './develop/_pug/html' })
			.pipe(progeny())
			// エラーが出ても停止させない
			.pipe(plumber({
				errorHandler: notify.onError("Error: <%= error.message %>")
			}))
			// JSONの読み込み
			.pipe(data(function (file) {
				var dirname = config.root.src + '/_pug/_json/';
				// dirnameのフォルダがあれば処理
				if (fs.existsSync(dirname)) {
					var files = fs.readdirSync(dirname);
					var jsondata = {};
					files.forEach(function (filename) {
						var name = filename.replace('.json', '');
						var json = JSON.parse(fs.readFileSync(dirname + filename));
						jsondata[name] = json;
					});
					return jsondata;
				}
			}))
			// pugのコンパイル
			.pipe(pug({
				basedir: config.root.src,
				pretty: '\t',
				doctype: 'html'
			}))
			.pipe(gulp.dest(config.root.src));
	},

	/* --------------------
		 リリース時のPugタスク
	----------------------*/
	taskPugAll: () => {
		return gulp
			.src(config.root.src + '/_pug/html/**/*.pug')
			// エラーが出ても停止させない
			.pipe(plumber({
				errorHandler: notify.onError("Error: <%= error.message %>")
			}))
			// JSONの読み込み
			.pipe(data(function (file) {
				var dirname = config.root.src + '/_pug/_json/';
				// dirnameのフォルダがあれば処理
				if (fs.existsSync(dirname)) {
					var files = fs.readdirSync(dirname);
					var data = {};
					files.forEach(function (filename) {
						var name = filename.replace('.json', '');
						var json = JSON.parse(fs.readFileSync(dirname + filename));
						data[name] = json;
					});
					return data;
				}
			}))
			// pugのコンパイル
			.pipe(pug({
				basedir: config.root.src,
				pretty: '\t',
				doctype: 'html'
			}))
			.pipe(gulp.dest(config.root.src));
	}
}