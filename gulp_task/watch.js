// ファイル更新監視
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var conf        = require('./_config');

gulp.task('watch', function() {
	var w_file = gulp.watch([
		conf.src + '/**/*.js',
		conf.src + '/**/*.html',
		conf.src + '/**/*.php',
		'!' + conf.src + '/**/_styleguide/**/*.*',
	], reload);
	var w_sass          = gulp.watch([conf.src + '/**/*.scss'], ['sass', reload]);
	var w_babelify      = gulp.watch([conf.src + '/**/js/_common/**/*.js'], ['babelify', reload]);
	var w_concat        = gulp.watch([conf.src + '/**/js/_plugin/**/*.js'], ['concat', reload]);
	// var w_frontnote     = gulp.watch([
	// 	conf.src + '/_sass/object/component/**/*.scss',
	// 	conf.src + '/_sass/object/module/**/*.scss'
	// ], ['frontnote', reload]);

	w_file.on('change', function(event){
		console.log(event.path + ' was ' + event.type);
	});
	w_sass.on('change', function(event){
		console.log('CSS File ' + event.path + ' was ' + event.type + ', running task sass...');
	});
	w_babelify.on('change', function(event){
		console.log('javascript File ' + event.path + ' was ' + event.type);
	});
	w_concat.on('change', function(event){
		console.log('javascript File ' + event.path + ' was ' + event.type + ', running task concat...');
	});
});
