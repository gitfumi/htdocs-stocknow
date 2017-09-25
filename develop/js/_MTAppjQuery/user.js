(function($){

/* ---------------------------------------------
	MT　共通ページ
----------------------------------------------------------*/
	$(function(){
		$.getJSON(
			"http://stocknow.dev.localhost/_mt/mt-data-api.cgi/v3/sites",
			function(data){
				console.log(data);
			}
		);
	});
	$.ajax({
		type: "get",
		url: "/_mt/mt-data-api.cgi/v3/sites",
		dataType: "json",
		success: function(data, dataType){

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