/*
 * SASS
 */
// **********************************************
// require
// **********************************************
const config = require('../config'),
	gulp = require('gulp'),
	progeny = require('gulp-progeny'), // Sassの依存関係は把握するプラグイン,
	plumber = require('gulp-plumber'), // エラーが原因でタスクが強制停止することを防止するモジュール,
	sassGlob = require('gulp-sass-glob'), // Sassのインポート補助※フォルダ毎,
	sass = require('gulp-sass'), // sassの自動コンパイル,
	postCss = require('gulp-postcss'), // ベンダープレフィックスの自動付与,
	autoprefixer = require('autoprefixer'), // 対象ブラウザのコントロール,
	notify = require('gulp-notify'), // デスクトップ通知が行えるモジュール
	mqpacker = require('css-mqpacker'), // バラバラになったメディアクエリをまとめる
	mqpackerSort = require('sort-css-media-queries'), // mqpackerのソートプロパティ
	cssDeclarationSorter = require('css-declaration-sorter'), // CSSプロパティの記述順を自動でソートする
	cssMinify = require('gulp-clean-css'), // CSSのmin化※圧縮
	browserSync = require('browser-sync');

// **********************************************
// SASS set
// **********************************************

module.exports = {

	/* --------------------
		 通常のSASSタスク
	----------------------*/
	taskSass: () => {
		let path = config.root.src + config.sass.targetFile,
			option;

		// /_sass/css/の個別ファイルの場合ビルド対象反映を変更。
		if (config.activeFile.path.match(/_sass\\css/)) {
			if (!config.activeFile.path.match(/\\_entry\\/)) {
				path = config.activeFile.path;
				option = { base: './develop/_sass' };
				console.log('change!!!!!!!!!!');
			}
		}

		return gulp
			// ファイルのビルド
			.src(path, option)
			// 関連ファイルのみビルド
			.pipe(progeny())
			// エラーが起こっても停止させない
			.pipe(plumber({
				errorHandler: notify.onError(config.plumber.errorMessage)
			}))
			// ディレクトリ単位でのsassのimportを可能にする
			.pipe(sassGlob())
			// sassのコンパイル
			.pipe(sass({
				outputStyle: 'expanded'
			}))
			// ベンダープレフィックスの付与
			.pipe(postCss([
				// ベンダープレフィックスの自動付与と各ブラウザ固有の書き方の追記
				autoprefixer({
					// css gridに対応
					grid: true,
					// 不要な整形をしない
					cascade: false
				}),
				// プロパティの整列
				cssDeclarationSorter({
					order: 'smacss'
				}),
			]))
			.pipe(gulp.dest(config.root.src))
			// ブラウザの更新
			.pipe(browserSync.reload({stream: true}));
		done();
	},

	/* --------------------
		 Release時のSASSタスク
	----------------------*/
	taskSassAll: () => {
		return gulp
			.src(config.root.src + config.sass.targetFile)
			// エラーが起こっても停止させない
			.pipe(plumber({
				errorHandler: notify.onError(config.plumber.errorMessage)
			}))
			// ディレクトリ単位でのsassのimportを可能にする
			.pipe(sassGlob())
			// sassのコンパイル
			.pipe(sass({
				outputStyle: 'expanded'
			}))
			// ベンダープレフィックスの付与
			.pipe(postCss([
				// ベンダープレフィックスの自動付与と各ブラウザ固有の書き方の追記
				autoprefixer({
					// css gridに対応
					grid: true,
					// 不要な整形をしない
					cascade: false
				})
			]))
			.pipe(gulp.dest(config.root.src));
	},

	/* --------------------
		CSS並び替え＆圧縮タスク　※見ずらいので使用してない
	----------------------*/
	taskCssmini: () => {
		const plugin = [
			// プロパティの整列
			cssDeclarationSorter({
				order: 'smacss'
			}),
			// メディアクエリの整理
			mqpacker({
				sort: mqpackerSort
			})
		];
		return gulp
			.src(config.root.src + '/**/*.css')  // 全てのCSS（納品ファイル
			.pipe(postCss(plugin))
			// .pipe(cssMinify()) // CSSの圧縮
			.pipe(gulp.dest(config.root.src)); // 書き出し先（納品ファイル）
	}
}