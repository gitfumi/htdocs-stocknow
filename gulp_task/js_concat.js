// Javascriptの結合
var gulp   = require('gulp');
var concat = require('gulp-concat');
var conf   = require('./_config');

gulp.task('concat', function() {
	return gulp.src(conf.src + '/js/_plugin/**/*.js') // /js/plugin/の全てのJavaScript（開発ファイル）
		.pipe(concat('plugin.js'))                   // common.jsというファイル名で結合
		.pipe(gulp.dest(conf.src + '/js/'));         // 書き出し先（開発ファイル）
});
