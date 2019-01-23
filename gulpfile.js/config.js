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
	sass: {
		format: '/_sass/**/*.+(sass|scss)'
	}
	// activeFile: {
	// 	path: '',
	// 	dir: '',
	// 	action: '',
	// 	filename: '',
	// 	ext: ''
	// }
};