// コンテンツの表示、非表示
let currentLink = (function() {
	return {
		Uri: function(path) {
			let self = this;
			this.originalPath = path;
			//絶対パスを取得
			this.absolutePath = (function() {
				let e = document.createElement('span');
				e.innerHTML = '<a href="' + path + '" />';
				return e.firstChild.href;
			})();
			//絶対パスを分解
			let fields = {'schema' : 2, 'username' : 5, 'password' : 6, 'host' : 7, 'path' : 9, 'query' : 10, 'fragment' : 11};
			let r = /^((\w+):)?(\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/.exec(this.absolutePath);
			for (let field in fields) {
				this[field] = r[fields[field]];
			}
			this.querys = {};
			if (this.query) {
				$.each(self.query.split('&'), function() {
					let a = this.split('=');
					if (a.length == 2) self.querys[a[0]] = a[1];
				});
			}
		},
		selflink: function (options) {
			let c = $.extend({
				selfLinkAreaSelector:'body',
				selfLinkClass:'is-current',
				parentsLinkClass:'is-current',
				postfix: '_on',
				changeImgSelf:false,
				changeImgParents:false
			}, options);
			$(c.selfLinkAreaSelector+((c.selfLinkAreaSelector)?' ':'')+'a[href]').each(function() {
				let href = new currentLink.Uri(this.getAttribute('href'));
				let setImgFlg = false;
				if ((href.absolutePath == location.href) && !href.fragment) {
					//同じ文書にリンク
					$(this).addClass(c.selfLinkClass);
					setImgFlg = c.changeImgSelf;
				} else if (0 <= location.href.search(href.absolutePath)) {
					//親ディレクトリリンク
					$(this).addClass(c.parentsLinkClass);
					setImgFlg = c.changeImgParents;
				}
				if (setImgFlg) {
					//img要素が含まれていたら現在用画像（_cr）に設定
					$(this).find('img').each(function() {
						this.originalSrc = $(this).attr('src');
						this.currentSrc = this.originalSrc.replace(new RegExp('('+c.postfix+')?(\.gif|\.jpg|\.png)$'), c.postfix+"$2");
						$(this).attr('src',this.currentSrc);
					});
				}
			});
		}
	}
}());
export default currentLink;
currentLink.selflink();