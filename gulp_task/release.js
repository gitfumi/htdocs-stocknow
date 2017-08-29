// リリース用ビルド
var gulp        = require('gulp');
var runSequence = require('run-sequence');
var conf        = require('./_config');

gulp.task('release', function(callback) {
	// タスクを直列処理する
	return runSequence(
		'clean',
		'sass',
		'copy',
		// 'copyWP',
		'imagemin',
		'css',
		'uglify',
		'gzip',
		callback
	);
});
