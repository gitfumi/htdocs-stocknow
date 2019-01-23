// デフォルトタスク
var gulp = require('gulp');
var conf = require('./_config');

gulp.task('default', [
	'watch',
	'browserSync'
]);