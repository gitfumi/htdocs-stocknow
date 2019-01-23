// BrowserSync
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var conf        = require('./_config');

gulp.task('browserSync', function() {
	browserSync.init({
		proxy: conf.host,
		open: 'external'
	});
});