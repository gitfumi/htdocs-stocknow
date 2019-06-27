/*	GoogleMap のカスタマイズ
	マーカーイベントを追加する際は、「infobox.js」を読み込んでください。
	【$markerData配列形式】
	let markerData = [
		{
			mapId:mapID,
			name:name,
			pin :pin,
			zoom: zoom,
			link:link,
			lat :lat,
			lng :lng
		},
		{
			mapId:mapID,
			name:name,
			pin :pin,
			zoom: zoom,
			link:link,
			lat :lat,
			lng :lng
		}
	]
*/
let googleMap = function($markerData,$centerPinLat,$centerPinLan,$zoom,$markerEventFlg,$pinWith,$pinHeight) {
	/* 初期設定 */
	if ($centerPinLat   == undefined) $centerPinLat   = 0;		// MAPの中心位置※緯度
	if ($centerPinLan   == undefined) $centerPinLan   = 0;		// MAPの中心位置※緯度
	if ($zoom           == undefined) $zoom           = 16;		// MAPの倍率
	if ($markerEventFlg == undefined) $markerEventFlg = false;	// インフォーメションウィンドウの判定※true:出す、false:出さない
	if ($pinWith        == undefined) $pinWith        = 33;		// ピンの横幅
	if ($pinHeight      == undefined) $pinHeight      = 50;		// ピンの高さ

	let markers = new Array();
	let markersInfo = new Array();
	let targetLatlng,mapElemtn,map;

	// 初期設定
	function init() {
		// ベースマップの設定
		let mapOptions = {
			zoom: $zoom, // 拡大比率
			"center": { // 地図の中心座標
				"lat": $centerPinLat,
				"lng": $centerPinLan
			},
			mapTypeId: google.maps.MapTypeId.ROADMAP // 表示タイプの指定
		};

		// ベースマップIDの設定
		mapElement = document.getElementById($markerData[0]['mapId']);
		map = new google.maps.Map(mapElement, mapOptions);

		// 大きな地図で見る
		let href = 'https://maps.google.com/maps?ll=' + $markerData[0]['lat'] + ',' + $markerData[0]['lng'] + '&amp;z=' + $markerData[0]['zoom'] + '&amp;t=m&amp;hl=ja&amp;gl=US&amp;mapclient=embed&amp;q=' + $markerData[0]['name'];
		let glink = '<p class="c-glink"><a target="_blank" href="' + href + '">大きな地図を見る</a></p>';
		$('#' + $markerData[0]['mapId']).after(glink);

		for (let i = 0; i < $markerData.length; i++){

			// 複数のマップの存在する場合、出力先を変更
			if(($markerData[0]['mapId'] != $markerData[i]['mapId']) && i != 0){
				mapOptions = {
					zoom: $markerData[i]['zoom'], // 拡大比率
					"center": { // 地図の中心座標
						"lat": $markerData[i]['lat'],
						"lng": $markerData[i]['lng']
					}
				}
				mapElement = document.getElementById($markerData[i]['mapId']);
				map = new google.maps.Map(mapElement, mapOptions);

				// 大きな地図で見る
				href = 'https://maps.google.com/maps?ll=' + $markerData[i]['lat'] + ',' + $markerData[i]['lng'] + '&amp;z=' + $markerData[i]['zoom'] + '&amp;t=m&amp;hl=ja&amp;gl=US&amp;mapclient=embed&amp;q=' + $markerData[i]['name'];
				glink = '<p class="c-glink"><a target="_blank" href="' + href + '">大きな地図を見る</a></p>';
				$('#' + $markerData[i]['mapId']).after(glink);
			}

			// オリジナルアイコンの取得
			if($markerData[i]['pin']){
				let icon = {
					url			: $markerData[i]['pin'], // アイコンの場所
					scaledSize 	: new google.maps.Size($pinWith,$pinHeight) // アイコンサイズ
				}
			}
			targetLatlng = new google.maps.LatLng($markerData[i]['lat'], $markerData[i]['lng']);
			// マーカーの追加
			markers[i] = new google.maps.Marker({
				position: targetLatlng,
				map: map,
				icon: icon
			});
			if($markerEventFlg){
				markerEvent(i,targetLatlng);
			}
		}

		google.maps.event.addDomListener(window, "resize", function() { let center = map.getCenter(); google.maps.event.trigger(map, "resize"); map.setCenter(center); });
	};
	google.maps.event.addDomListener(window, 'load', init);

	// マーカーイベント設定
	function markerEvent(i){
		markers[i].addListener('click', function() {

			// infobox 用の div エレメントを生成
			let infoboxContent = document.createElement('div');

			// infobox に表示するHTML
			infoboxContent.innerHTML = '<div class="infobox is-'+$markerData[i]['category']+'"><div class="inner"><h3 class="ttl">'+$markerData[i]['name']+'</h3><p class="txt">'+$markerData[i]['location']+'</p><p class="link"><a href="'+$markerData[i]['link']+'">詳細へ</a></p></div></div>';

			// infobox のオプション
			let infoboxOptions = {
				content: infoboxContent, // 生成したDOMを割り当てる
				pixelOffset: new google.maps.Size(-150, -55), // オフセット値
				alignBottom: true, // 位置の基準
				position: targetLatlng, // 位置の座標
				boxClass: "infobox", // 生成したDOMをラップするdivのclass名
				closeBoxMargin: "7px 5px 0 0", // 閉じるボタンの位置調整
				closeBoxURL: '/img/cmn/pic_mapwindow_close.png' // 閉じるボタンの画像パス
			};
			// infobox を生成して表示
			let infobox = new InfoBox(infoboxOptions);
			infobox.open(map, this);
		});
	}
}
export default googleMap;