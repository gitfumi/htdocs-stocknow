// モーダル表示
let magnificPopup = (function() {
	$('.js-magnificPopupSingle').magnificPopup({
		delegate: 'a',
		type: 'image',
		zoom: {
			enabled: true,
			duration: 300
		}
	});
	$('.js-magnificPopupGallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		gallery: {
			enabled: true
		},
		zoom: {
			enabled: true,
			duration: 300
		}
	});
	$('.js-magnificPopupIframe').magnificPopup({
		delegate: 'a',
		type: 'iframe',
		zoom: {
			enabled: true,
			duration: 300
		}
	});
	$('.js-magnificPopupInline').magnificPopup({
		delegate: 'a',
		type: 'inline',
		zoom: {
			enabled: true,
			duration: 300
		}
	});
}());
export default magnificPopup;