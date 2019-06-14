/*
 * ファイル監視タスク
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');
// **********************************************
// タスク呼び出し
// **********************************************
const reload = $.browserSync.reload;
const new_sass = require('./sass');
const new_babelify = require('./babelify');
const new_concat = require('./js_concat');
const new_pug = require('./pug');
const new_imagemin = require('./imagemin');
const new_delete = require('./delete');
const new_frontnone = require('./frontnone');
const new_mtappjquery = require('./_mtappjquery');

// **********************************************
// watch set
// **********************************************
module.exports = {
	taskMove: () =>{
		// リロード
		const w_getInfo = $.gulp.watch(config.root.src + '/**/*.*');
		let timer = '';
		w_getInfo.on('all', (event, path) => {

			// アクティブファイルの登録
			config.activeFile.path = path;
			config.activeFile.event = event;

			// console.log(path);

			// ファイル削除時
			if(event == 'unlink'){
				if(path.match(/\.pug/)){
					new_delete.taskDeletePug(path)
				}
				if(path.match(/\.(sass|scss)/)){
					new_delete.taskDeleteSass(path)
				}
			}

			/* 連続イベントの間引き処理 200ミリ秒以内で再度発生した場合は無視する */
			/* 320ミリ秒は適当なので、必要に応じて調整 */
			clearTimeout(timer);
			timer = setTimeout(function () {
				console.log('[ Reload finished !! ]');
				reload();
			}, 320);
		})
		/* ------------
		   監視タスク
		-------------*/
		// SASS
		const w_sass = $.gulp.watch(config.root.src + '/**' + config.sass.targetFile, new_sass.taskSass);

		// babelify
		const w_babelify = $.gulp.watch(config.root.src + '/**' + config.babelify.targetFile, new_babelify.taskBabelify);

		// concat
		const w_concat = $.gulp.watch(config.root.src + '/**' + config.concat.targetFile, new_concat.taskConcat);
		const w_mtappjquery = $.gulp.watch(config.root.src + '/**' + config.mtappjqury.targetFile, new_mtappjquery.taskMtAppjQuery);

		// imagemin
		// const w_imagemin = $.gulp.watch(config.root.src + '/**' + config.imagemin.targetFile, new_imagemin.taskImagemin);

		// Pug
		// let pugList = [];
		// // 対象ファイルを整列
		// for (var i = 0; i < config.pug.targetFile.length; i++) {
		// 	pugList[i] = config.root.src + '/**' + config.pug.targetFile[i]
		// }
		const w_pug = $.gulp.watch(config.root.src + '/**' + config.pug.targetFile, new_pug.taskPug);
		const w_pugJson = $.gulp.watch(config.root.src + '/_pug/_json/*.json', new_pug.taskPugAll);
		// const w_pugJson = $.gulp.watch(config.root.src + '/_pug/_json/*.json', $.gulp.series(new_pug.taskPugAll, new_pug.taskXml, done => {
		// 	done();
		// }));

		// frontnote
		let frontnoteList = [];
		// 対象ファイルを整列
		for (var i = 0; i < config.frontnone.targetFile.length; i++) {
			frontnoteList[i] = config.root.src + config.frontnone.targetFile[i]
		}
		// const w_frontnote = $.gulp.watch(frontnoteList, new_frontnone.taskFrontnote(frontnoteList));
	}
}