$(function(){
	var googleMap = (function(){
		var latlng = new google.maps.LatLng(35.166875,136.880485);/*表示したい場所の経度、緯度*/
		var myOptions = {
		zoom: 18, /*拡大比率*/
		center: latlng, /*表示枠内の中心点*/
		mapTypeId: google.maps.MapTypeId.ROADMAP/*表示タイプの指定*/
		};
		var map = new google.maps.Map(document.getElementById('googleMap'), myOptions);
	}());
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