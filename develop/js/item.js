$(function(){
	var googleMap = function(){
		var latlng = new google.maps.LatLng(35.6983373,139.6461661);/*表示したい場所の経度、緯度*/
		var myOptions = {
			zoom: 18, /*拡大比率*/
			center: latlng, /*表示枠内の中心点*/
			mapTypeControlOptions: { mapTypeIds: ['sample', google.maps.MapTypeId.ROADMAP] }
		};
		var map = new google.maps.Map(document.getElementById('googleMap'), myOptions);

		/*アイコン設定▼*/
		var icon = {
			url: '/img/cmn/icon_googlemap.png',
			scaledSize : new google.maps.Size(51.5,65.5)
		}
		var markerOptions = {
			position: latlng,
			map: map,
			icon: icon,
			title: 'SPOT'
		};
		var marker = new google.maps.Marker(markerOptions);

		/*取得スタイルの貼り付け*/
		var styleOptions = [
			{
				'stylers': [
					{ 'saturation': -100 },
					{ 'visibility': 'simplified' },
					{ 'lightness': 22 }
				]
			}
		];
		var styledMapOptions = { name: '株式会社Lig' }
		var sampleType = new google.maps.StyledMapType(styleOptions, styledMapOptions);
		map.mapTypes.set('sample', sampleType);
		map.setMapTypeId('sample');
	};
	google.maps.event.addDomListener(window, 'load', googleMap);
	$('#js-slickMain').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		fade: true,
		asNavFor: '#js-slickThum'
	});
	$('#js-slickThum').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		asNavFor: '#js-slickMain',
		dots: true,
		centerMode: true,
		focusOnSelect: true
	});

	$('.js-slickResponsive').slick({
		dots: true,
		infinite: true,
		arrows : false,
		speed: 1000,
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
		// centerMode: true, //要素を中央寄せ
		// centerPadding:'100px', //両サイドの見えている部分のサイズ
		responsive: [
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			}
		]
	});
})