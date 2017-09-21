$(function(){
/*************************
	slick 関連
*************************/
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
});

var hhhhh = function() {
	console.log('ggggg');
}