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
	if ($pinWith        == undefined) $pinWith        = 40;		// ピンの横幅
	if ($pinHeight      == undefined) $pinHeight      = 50;		// ピンの高さ

	let markers = new Array();
	let markersInfo = new Array();
	let targetLatlng,mapElement,map;
	let bounds = new google.maps.LatLngBounds();

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

			}

			// オリジナルアイコンの取得
			let pinicon = {
				url			: '/img/cmn/icon_googlemap.png', // アイコンの場所
				scaledSize 	: new google.maps.Size($pinWith,$pinHeight) // アイコンサイズ
			}
			targetLatlng = new google.maps.LatLng($markerData[i]['lat'], $markerData[i]['lng']);
			// マーカーの追加
			markers[i] = new google.maps.Marker({
				position: targetLatlng,
				map: map,
				icon: pinicon
			});
			if($markerEventFlg){
				markerEvent(i,targetLatlng);
			}
			bounds.extend(targetLatlng);
		}

		map.fitBounds(bounds);
		google.maps.event.addDomListener(window, "resize", function() { let center = map.getCenter(); google.maps.event.trigger(map, "resize"); map.setCenter(center); });
	};
	google.maps.event.addDomListener(window, 'load', init);

	// マーカーイベント設定
	function markerEvent(i){
		markers[i].addListener('click', function() {

			// infobox 用の div エレメントを生成
			let infoboxContent = document.createElement('div');

			// infobox に表示するHTML
			infoboxContent.innerHTML = '<div class="infobox"><a href="'+$markerData[i]['link']+'"><div class="inner"><h3 class="ttl">'+$markerData[i]['name']+'</h3></div></a></div>';

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