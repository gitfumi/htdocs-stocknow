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
const new_delete = require('./delete');
const new_sass = require('./sass');
const new_babelify = require('./babelify');
const new_concat = require('./js_concat');
const new_pug = require('./pug');
const new_copy = require('./_release_copy');
const new_css = require('./_release_css');
const new_uglify = require('./_release_uglify');
const new_gzip = require('./_release_gzip');
// **********************************************
// release set
// **********************************************
// release
$.gulp.task('release', $.gulp.series(
	new_delete.taskDeleteRelease,
	new_sass.taskSassAll,
	new_babelify.taskBabelify,
	new_concat.taskConcat,
	new_pug.taskPugAll,
	new_copy.taskCopy,
	new_css.taskCss,
	new_uglify.taskUglify,
	new_gzip.taskGzip,
	done => {
		done();
	}
));