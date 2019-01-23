// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');
const task_watch = require('./watch');
const task_browserSync = require('./browserSync');

// **********************************************
// task set
// **********************************************

// watch
$.gulp.task('watch', done => {
	task_watch.taskMove();
	console.log('watch!!!');
	done();
});

// browserSync
$.gulp.task('browserSync', done => {
	// task_browserSync.taskMove();
	console.log('browserSync!!!');
	done();
});

// default
$.gulp.task('default', $.gulp.series('watch', 'browserSync', done => {
	done();
}));