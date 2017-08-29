// ファイルの削除
var gulp  = require('gulp');
var clean = require('gulp-clean');
var conf  = require('./_config');

gulp.task('clean', function() {
	gulp.src(conf.dest, {read: false})
	.pipe(clean());
});