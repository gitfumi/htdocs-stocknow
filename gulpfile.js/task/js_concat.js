/*
 * Javascriptの結合
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// concat set
// **********************************************
module.exports = {
	taskConcat: () =>{
		return $.gulp.src(config.root.src + '/_js/plugin/**/*.js')
			// ファイルを結合
			.pipe($.concat('plugin.js'))
			.pipe($.gulp.dest(config.root.src + '/js/'));
	}
}