(function($){

/* ---------------------------------------------
	MT　共通ページ
----------------------------------------------------------*/
/*****************************
 少しのイライラ解消コード：
 ブログ一覧を左メニューに追加
******************************/
	var siteId = 1; //サイトIDを指定
	var protocol = location.protocol;
	var host = location.host;
	var path = location.pathname.replace('mt.cgi', '');
	var $blogMenu = $('#blog-wide-menu');
	$blogMenu.prepend(
		'<li class="item top-menu">' +
		'<div><a href="/_mt/mt.cgi?__mode=list&amp;_type=blog&amp;blog_id=' + siteId + '" class="top-menu-link menu-link"><span class="menu-label">ブログ一覧</span></a></div>' +
		'<ul class="sub-menu">' +
		'</ul>' +
		'</li>'
	);
	$.ajax({
		type: 'get',
		url: protocol + '//' + host + path + 'mt-data-api.cgi/v3/sites/' + siteId + '/children',
		dataType: 'json',
		success: function(data){
			var dataArray = data.items;
			var code;
			var $subMenu = $blogMenu.find('.sub-menu');
			$.each(dataArray, function(i){
				code = '<li class="item"><a href="/_mt/mt.cgi?__mode=list&amp;_type=blog&amp;blog_id=' + dataArray[i].id + '" class="sub-menu-link menu-link"><span class="menu-label">' + dataArray[i].name + '</span></a></li>'
				$subMenu.append(code);
			});
		}
	});
/* ---------------------------------------------
	MT　カテゴリページ
----------------------------------------------------------*/

	if($('body#edit-category').length){

		// 説明項目をコメントアウト
		$('#category-outbound-ping').next().hide();

		// 説明・トラックバック受信・トラックバック送信を非表示
		$('#description-field, #category-inbound-ping, #category-outbound-ping').hide();

		//カテゴリのカスタムフィールドの並び替え※「insertID」を付ける
		$.MTAppFieldSort({
			sort: 'label,basename,c:categorybrandlogo,c:categorystate,c:categoryonlinepay,c:categoryonlineurl,c:categoryshopname1,c:categoryshopaddress1,c:categoryshopoverview1,c:categoryshopname2,c:categoryshopaddress2,c:categoryshopoverview2,c:categoryshopname3,c:categoryshopaddress3,c:categoryshopoverview3,c:categoryshopname4,c:categoryshopaddress4,c:categoryshopoverview4,c:categoryshopurl',
			insertID: 'category-meta'
		});

		// 配送方法の選択肢の追加
		$.MTAppMultiCheckbox({
			basename: 'categorystate',
			label:    '常温,冷蔵,冷凍',
			custom:   1,
			skin: 'tags',
			debug:    0
		});

		// 支払方法の選択肢の追加
		$.MTAppMultiCheckbox({
			basename: 'categoryonlinepay',
			label:    '銀行振込,代金引換,クレジットカード,コンビニ決済',
			skin: 'tags',
			custom:   1,
			debug:    0
		});

		// 実店舗情報をまとめる
		for (var i = 1; i <= 4; i++) {
			var id;
			id = '#customfield_categoryshopname' + i + '-field';
			id += ', #customfield_categoryshopaddress' + i + '-field';
			id += ', #customfield_categoryshopoverview' + i + '-field';
			// .mtapp-shopBlockで括る
			$(id).wrapAll("<section class='mtapp-shopBlock'></section>");
		}
		// 実店舗を一括りにする
		$(".mtapp-shopBlock").wrapAll("<div class='mtapp-shop'></div>");

	}
/* ---------------------------------------------
	MT　商品詳細
----------------------------------------------------------*/
	if($('body#edit-entry').length){
		// 説明文、タグ、フェードバックを非表示に
		$('#text-field, #tags-field, #feedback-field').hide();
		//並び替え
		$.MTAppFieldSort({
			'sort': 'title,c:entryimage,c:entryimagesub1,c:entryimagesub2,c:entryprice,c:entrylimitdate,c:entryiconnew,c:entrydetails,c:entryvariationtext1,c:entryvariationimage1,c:entryvariationtext2,c:entryvariationimage2,c:entryvariationtext3,c:entryvariationimage3'
		});

		// NEWアイコンをタグ化
		// $.MTAppMultiCheckbox({
		// 	basename: 'entryiconnew',
		// 	label:    'ON',
		// 	skin: 'tags',
		// 	custom:   1,
		// 	debug:    0
		// });


		// 画像をまとめる
		$("#customfield_entryimage-field, #customfield_entryimagesub1-field, #customfield_entryimagesub2-field").wrapAll("<div class='mtapp-vertical is-picture'></div>");
		// .mtapp-verticalBlockで括る
		$('#customfield_entryimage-field').wrapAll("<section class='mtapp-verticalBlock'></section>");
		$('#customfield_entryimagesub1-field').wrapAll("<section class='mtapp-verticalBlock'></section>");
		$('#customfield_entryimagesub2-field').wrapAll("<section class='mtapp-verticalBlock'></section>");

		// 価格と賞味期限をまとめる
		$("#customfield_entryprice-field, #customfield_entrylimitdate-field, #customfield_entryiconnew-field").wrapAll("<div class='mtapp-vertical is-pli'></div>");

		// .mtapp-verticalBlockで括る
		$('#customfield_entryprice-field').wrapAll("<section class='mtapp-verticalBlock'></section>");
		$('#customfield_entrylimitdate-field').wrapAll("<section class='mtapp-verticalBlock'></section>");
		$('#customfield_entryiconnew-field').wrapAll("<section class='mtapp-verticalBlock'></section>");

		// 容量バリエーションをまとめる
		$("#customfield_entryvariationtext1-field, #customfield_entryvariationimage1-field, #customfield_entryvariationtext2-field, #customfield_entryvariationimage2-field,  #customfield_entryvariationtext3-field, #customfield_entryvariationimage3-field").wrapAll("<div class='mtapp-vertical is-variation'></div>");
		// .mtapp-verticalBlockで括る
		$('#customfield_entryvariationtext1-field, #customfield_entryvariationimage1-field').wrapAll("<section class='mtapp-verticalBlock'></section>");
		$('#customfield_entryvariationtext2-field, #customfield_entryvariationimage2-field').wrapAll("<section class='mtapp-verticalBlock'></section>");
		$('#customfield_entryvariationtext3-field, #customfield_entryvariationimage3-field').wrapAll("<section class='mtapp-verticalBlock'></section>");

	}
})(jQuery);