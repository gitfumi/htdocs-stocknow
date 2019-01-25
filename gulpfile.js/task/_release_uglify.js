/*
 * Javascriptの圧縮
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// uglify set
// **********************************************
module.exports = {
	taskUglify: done =>{
		return $.pump([
			$.gulp.src(config.root.dest + '/**/*.js'),
			$.uglify(),
			$.gulp.dest(config.root.dest)
		]);
	}
}