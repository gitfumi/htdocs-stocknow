// CSSプロパティ・メディアクエリの整理、圧縮
var cmq     = require('gulp-combine-media-queries');
var gulp    = require('gulp');
var cssmin  = require('gulp-cssmin');
var csscomb = require('gulp-csscomb');
var conf    = require('./_config');
/*
 * gulp-combine-media-queriesを利用する場合は
 * gulp-combine-media-queries/index.js
 * の152目コメントアウトしないとエラーがでます。
 */
gulp.task('css', function() {
	return gulp.src(conf.dest + '/**/*.css') // /css/の全てのCSS（納品ファイル）
	.pipe(csscomb())                             // プロパティの整列
	.pipe(cmq({log: true}))                      // メディアクエリの整理
	.pipe(cssmin())                              // CSSの圧縮
	.pipe(gulp.dest(conf.dest));       // 書き出し先（納品ファイル）
});
