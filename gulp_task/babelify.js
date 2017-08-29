// ES6をES5に変換
var gulp       = require('gulp');
var browserify = require('browserify');
var babelify   = require('babelify');
var source     = require('vinyl-source-stream');
var conf       = require('./_config');

gulp.task('babelify', function() {
	browserify({
			entries: conf.src + '/js/_common/_app.js',
			extensions: ['.js']
		})
		.transform(babelify, {presets: ['es2015']})
		.bundle()
		.on('error', function (err) {
			console.log('Error : ' + err.message);
			this.emit('end');
		})
		.pipe(source('common.js'))
		.pipe(gulp.dest(conf.src + '/js/'));
});
