// **********************************************
// 初期変数設定
// **********************************************
module.exports = {
	host: 'gulp.dev.localhost',
	root: {
		src: 'develop',
		dest: 'trunk'
	},
	browserSync: {
		viewPage: '',
		reload: 'css|html|php|js',
		noReload: '_js'
	},
	autoprefixer: {
		format: [
			'last 2 version',
			'ie >= 11',
			'iOS >= 9',
			'Android >= 4'
		]
	},
	/* watch.js */
	sass: {
		targetFile: '/_sass/**/*.+(sass|scss)'
	},
	babelify: {
		targetFile: '/js/_common/**/*.js',
		outPutDir: '/js/',
		outPutFileName: 'common.js'
	},
	/* js_concat.js */
	concat: {
		targetFile: '/js/_plugin/**/*.js',
		outPutDir: '/js/',
		outPutFileName: 'plugin.js'
	},
	/* sass.js */
	plumber: {
		errorMessage: 'Error: <%= error.message %>'
	},
	/* babelify.js */
	browserify: {
		targetFile: '/js/_common/_app.js'
	},
	/* _release_copy.js */
	clean: {
		targetFile: [
			'/**/*',
			'/**/.*',
			'/**'
		]
	},
	/* _release_copy.js */
	copy: {
		escapeFile: [
			'/**/*.htaccess',
			'/**/*.+(sass|scss)',
			'/**/_pug/**/*.*',
			'/**/_js/**/*.*',
			'/**/js/_common/**/*.*',
			'/**/js/_plugin/**/*.*',
			'/**/_styleguide/**/*.*',
			'/**/font/demo/**/*.*',
			'/**/_mt/**/*.*',
			'/**/assets_c/**/*.*'
		]
	}
};