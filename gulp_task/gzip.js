// gzip圧縮
var gulp = require('gulp');
var gzip = require('gulp-gzip');
var conf = require('./_config');

gulp.task('gzip', function() {
	gulp.src(conf.dest + '/**/*.js')        // /js/の全てのJavaScript（納品ファイル）
		.pipe(gzip())                          // gzip圧縮
		.pipe(gulp.dest(conf.dest));  // 書き出し先（納品ファイル）
	gulp.src(conf.dest + '/**/*.css')      // /css/の全てのCSS（納品ファイル）
		.pipe(gzip())                          // gzip圧縮
		.pipe(gulp.dest(conf.dest)); // 書き出し先（納品ファイル）
});
