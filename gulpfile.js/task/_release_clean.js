/*
 * trunkフォルダの削除
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');
const del = require('del');

// **********************************************
// clean set
// **********************************************
module.exports = {
	taskClean: done =>{
		let cleanlist = [];
		// 削除対象ファイルを整列
		for (var i = 0; i < config.clean.targetFile.length; i++) {
			cleanlist[i] = config.root.dest + config.clean.targetFile[i]
		};
		cleanlist[i] = '!' + config.root.dest;
		return del(cleanlist);
	}
}