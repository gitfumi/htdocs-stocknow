/*
 * trunkへのリリースコマンド
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');
// **********************************************
// タスク呼び出し
// **********************************************
const new_clean = require('./_release_clean');
const new_copy = require('./_release_copy');
const new_css = require('./_release_css');
const new_uglify = require('./_release_uglify');
const new_gzip = require('./_release_gzip');
// **********************************************
// release set
// **********************************************
// default
$.gulp.task('release', $.gulp.series(
	new_clean.taskClean,
	new_copy.taskCopy,
	new_css.taskCss,
	new_uglify.taskUglify,
	new_gzip.taskGzip,
	done => {
		done();
	}
));