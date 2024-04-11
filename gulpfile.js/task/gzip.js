/*
 * CSS、Javascriptをgzip圧縮
 */
// **********************************************
// require
// **********************************************
const config = require('../config'),
	gulp = require('gulp'),
	gzip = require('gulp-gzip') // CSS/jsのgzip化

// **********************************************
// gzip set
// **********************************************
module.exports = {
	taskGzip: done =>{
		return gulp
			.src(config.root.src + '/(css|js)/*.+(css|js)')
			.pipe(gzip())
			.pipe(gulp.dest(config.root.src));
	}
}