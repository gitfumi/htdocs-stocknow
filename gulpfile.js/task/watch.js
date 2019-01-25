/*
 * ファイル監視タスク
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');
const reload = $.browserSync.reload;
const new_sass = require('./sass');
const new_babelify = require('./babelify');
const new_concat = require('./js_concat');

// **********************************************
// watch set
// **********************************************
module.exports = {
	taskMove: () =>{

		// リロード
		const w_getInfo = $.gulp.watch(config.root.src + '/**/*.*');
		let timer = '';
		w_getInfo.on('change', path => {
			if(path.match(config.browserSync.reload)
			 && !path.match(config.browserSync.noReload)){
				/* 連続イベントの間引き処理 200ミリ秒以内で再度発生した場合は無視する */
				/* 280ミリ秒は適当なので、必要に応じて調整 */
				clearTimeout(timer);
				timer = setTimeout(function () {
					console.log('リロード');
					reload();
				}, 280);
			}
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

	}
}