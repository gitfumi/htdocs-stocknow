// ホスト名
var host = 'stocknow.dev.localhost'

// ディレクトリ設定
var dir = {
	src : 'develop', // 開発ファイル用フォルダ
	dest: 'trunk'    // 納品ファイル用フォルダ
}

module.exports = {
	host: host,
	src: dir.src,
	dest: dir.dest
};