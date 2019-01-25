/*
 * CSS、Javascriptをgzip圧縮
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// gzip set
// **********************************************
module.exports = {
	taskGzip: done =>{
		return $.gulp
			.src(config.root.dest + '/**/*.+(css|js)')
			.pipe($.gzip())
			.pipe($.gulp.dest(config.root.dest));
	}
}