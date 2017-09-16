// Javascriptの圧縮
var gulp       = require('gulp');
var stripDebug = require('gulp-strip-debug');
var uglify     = require('gulp-uglify');
var conf       = require('./_config');
var mtDir      = ''

gulp.task('uglify', function() {
	return gulp.src(conf.dest + '/js/**/*.js') // /js/の全てのJavaScript（納品ファイル）
		.pipe(stripDebug())                    // consoleやalertをvoid 0;に変換
		.pipe(uglify())                        // 圧縮
		.pipe(gulp.dest(conf.dest + '/js/'));  // 書き出し先（納品ファイル）
});

gulp.task('uglify_MTAppjQuery', function() {
	return gulp.src([
			conf.src + '/js/_MTAppjQuery/**/*.js']
		) // /js/の全てのJavaScript（納品ファイル）
		.pipe(stripDebug())                    // consoleやalertをvoid 0;に変換
		.pipe(uglify())                        // 圧縮
		.pipe(gulp.dest(conf.src + '/_mt/mt-static/plugins/MTAppjQuery/user-files/'));  // 書き出し先（納品ファイル）
});
