/*
 * trunkフォルダの削除
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// clean set
// **********************************************
module.exports = {

	/* --------------------
		 リリース時の削除タスク
	----------------------*/
	taskDeleteRelease: done =>{
		let cleanlist = [];
		// 削除対象ファイルを整列
		for (var i = 0; i < config.clean.targetFile.length; i++) {
			cleanlist[i] = config.root.dest + config.clean.targetFile[i]
		};
		cleanlist[i] = '!' + config.root.dest;
		return $.del(cleanlist);
	},

	/* --------------------
		 Pugファイル削除時の削除タスク
	----------------------*/
	taskDeletePug: (path) =>{
		const htmlFile = path.replace(config.delete.targetHtmlFile, '$1.html');
		console.log(`[ deleted ] \${htmlFile}`);
		return $.del([htmlFile]);
	},

	/* --------------------
		 Sass｜Scssファイル削除時の削除タスク
	----------------------*/
	taskDeleteSass: (path) =>{
		const cssFile = path.replace(config.delete.targetSassFile, '$1.css');
		console.log(`[ deleted ] \${cssFile}`);
		return $.del([cssFile]);
	},

	/* --------------------
		 ディレクトリ削除時の削除タスク
	----------------------*/
	// taskDeleteDir: (path) =>{
	// 	const htmlFile = path.replace(config.delete.targetHtmlFile, '$1.html');
	// 	console.log(`[ deleted ] \${htmlFile}`);
	// 	return del([htmlFile]);
	// },
}