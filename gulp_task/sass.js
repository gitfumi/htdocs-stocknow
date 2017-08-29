// スタイルガイド生成、Compass、ベンダープレフィックス付与
var gulp     = require('gulp');
var notify   = require('gulp-notify');
var plumber  = require('gulp-plumber');
var postcss  = require('gulp-postcss');
var sass     = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
// var merge    = require('merge-stream');
var cssnext  = require('postcss-cssnext');
var conf     = require('./_config');

gulp.task('sass', function() {
	var plugins = [
		cssnext({
			browsers: [
				'last 2 version',
				'ie >= 11',
				'iOS >= 9',
				'Android >= 4'
			]
		})
	];
	return gulp.src(conf.src + '/_sass/**/*.scss')
		// エラーが起こっても停止させない
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))
		// ディレクトリ単位でのsassのimportを可能にする
		.pipe(sassGlob())
		// sassのコンパイル
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		// ベンダープレフィックスの付与
		.pipe(postcss(plugins))
		.pipe(gulp.dest(conf.src));
});
