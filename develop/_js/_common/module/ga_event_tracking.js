// googleのイベントトラッキング
let gaEventTracking = (function() {
	$('.js-gaEventTracking a').on('click', function(event) {
		event.preventDefault();
		let data = $(this).parent().data();
		console.log('gaGroup:' + data.gaGroup);
		console.log('gaAction:' + data.gaAction);
		console.log('gaLabel:' + data.gaLabel);
		console.log('gaCount:' + data.gaCount);
		// ga('send','event',data.gaGroup,data.gaAction,data.gaLabel, data.gaCount);
		return
	});
}());
export default gaEventTracking;
