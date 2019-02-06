/*
 * HTMLを書くためのテンプレートエンジン
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// Pug set
// **********************************************
module.exports = {

	/* --------------------
		 通常のPugタスク
	----------------------*/
	taskPug: () =>{
		return $.gulp
		// .src(config.root.src + '/_pug/html/**/*.pug')
		.src(config.activeFile.path, {base: './develop/_pug/html'})
		.pipe($.progeny())
		// エラーが出ても停止させない
		.pipe($.plumber({
			errorHandler: $.notify.onError("Error: <%= error.message %>")
		}))
		// JSONの読み込み
		.pipe($.data(function(file){
			var dirname = config.root.src + '/_pug/_json/';
			// dirnameのフォルダがあれば処理
			if ($.fs.existsSync(dirname)) {
				var files = $.fs.readdirSync(dirname);
				var data  = {};
				files.forEach(function(filename) {
					var name = filename.replace('.json', '');
					var json = JSON.parse($.fs.readFileSync(dirname + filename));
					data[name] = json;
				});
				return data;
			}
		}))
		// pugのコンパイル
		.pipe($.pug({
			basedir: config.root.src,
			pretty: '\t'
		}))
		.pipe($.gulp.dest(config.root.src));
	},

	/* --------------------
		 リリース時のPugタスク
	----------------------*/
	taskPugAll: () =>{
		return $.gulp
		.src(config.root.src + '/_pug/html/**/*.pug')
		// エラーが出ても停止させない
		.pipe($.plumber({
			errorHandler: $.notify.onError("Error: <%= error.message %>")
		}))
		// JSONの読み込み
		.pipe($.data(function(file){
			var dirname = config.root.src + '/_pug/_json/';
			// dirnameのフォルダがあれば処理
			if ($.fs.existsSync(dirname)) {
				var files = $.fs.readdirSync(dirname);
				var data  = {};
				files.forEach(function(filename) {
					var name = filename.replace('.json', '');
					var json = JSON.parse($.fs.readFileSync(dirname + filename));
					data[name] = json;
				});
				return data;
			}
		}))
		// pugのコンパイル
		.pipe($.pug({
			basedir: config.root.src,
			pretty: '\t'
		}))
		.pipe($.gulp.dest(config.root.src));
	}
}