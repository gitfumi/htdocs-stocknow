// **********************************************
// 初期変数設定
// **********************************************
module.exports = {
	/*******************
	 init
	********************/
	host: 'stocknow.dev.localhost',
	root: {
		src: 'develop',
		dest: 'trunk',
		temp: '_temp'
	},
	browserSync: {
		viewPage: '',
		reload: 'css|html|php|js|pug',
		noReload: '_js'
	},
	activeFile: {
		path: '',
		event: ''
	},
	/*******************
	 watch.js
	********************/
	sass: {
		targetFile: '/_sass/**/*.+(sass|scss)'
	},
	babelify: {
		targetFile: '/_js/_common/**/*.js',
		outPutDir: '/js/',
		outPutFileName: 'common.js'
	},
	/*******************
	 js_concat.js
	********************/
	concat: {
		targetFile: '/_js/_plugin/**/*.js',
		outPutDir: '/js/',
		outPutFileName: 'plugin.js'
	},
	/*******************
	 sass.js
	********************/
	plumber: {
		errorMessage: 'Error: <%= error.message %>'
	},
	autoprefixer: {
		format: [
			'last 2 version',
			'ie >= 11',
			'iOS >= 9',
			'Android >= 4'
		]
	},
	/*******************
	 babelify.js
	********************/
	browserify: {
		targetFile: '/_js/_common/_app.js'
	},
	/*******************
	 pug.js
	********************/
	pug: {
		targetFile: '/_pug/**/*.pug'
	},
	/*******************
	 imagemin.js
	********************/
	imagemin: {
		targetFile: '/**/*.+(jpg|png|svg)'
	},
	/*******************
	 frontnone.js
	********************/
	frontnone: {
		targetFile: [
			'/_sass/_object/component/**/*.scss',
			'/_sass/_object/module/**/*.scss',
			// '/_sass/_object/utility/**/*.scss
		],
		outPutDir: '/_styleguide',
		includeCss: '../css/base.css'
	},
	/*******************
	 _release_clean.js
	********************/
	clean: {
		targetFile: [
			'/**/*',
			'/**/.*',
			'/**'
		]
	},
	/*******************
	 _release_copy.js
	********************/
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
	},
	/*******************
	 delete.js
	********************/
	delete: {
		targetHtmlFile: /_pug\\html\\(.*).pug$/,
		targetSassFile: /_sass\\(.*).+(sass|scss)$/
	}
};