// 画像の圧縮
var gulp     = require('gulp');
var imagemin = require('gulp-imagemin');
var conf     = require('./_config');

gulp.task('imagemin', function() {
	gulp.src(conf.dest + '/**/*.+(jpg|jpeg|png|gif|svg)') // 全ての画像ファイルを圧縮（納品ファイル）
		.pipe(plugins.imagemin())
		.pipe(gulp.dest(conf.dest));                      // 書き出し先（納品ファイル）
});