// ファイルのコピー
var gulp = require('gulp');
var conf = require('./_config');

gulp.task('copy', function() {
	return gulp.src(
		[
			conf.src + '/**/*.*',
			'!' + conf.src + '/**/*.svn/**/*.*',
			'!' + conf.src + '/**/*.htaccess',
			'!' + conf.src + '/**/*.scss',
			'!' + conf.src + '/**/_info/**/*.*',
			'!' + conf.src + '/**/_styleguide/**/*.*',
			'!' + conf.src + '/**/font/demo/**/*.*',
			'!' + conf.src + '/**/js/plugin/*.*',
			'!' + conf.src + '/**/js/common/**/*.*',
			'!' + conf.src + '/**/wordpress/**/*.*',
			'!' + conf.src + '/**/temp.html'
		],
		{
			base: conf.src,
			dot: true
		}
	)
	.pipe(gulp.dest(conf.dest));
});
