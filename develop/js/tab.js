$(function(){
/*************************
	tab
*************************/
	var $tab = $('.js-tab');
	var $btn = $('.js-btn');
	var $parent = $('.parent');
	var $child = $('.child');
	var $list = $('.stationList');
	$child.children().not('.is-active').hide();
	$list.children().not('.is-active').hide();
	$tab.children().each(function(){
		var $self = $(this);
		$self.on('click', function(event){
			event.preventDefault();
			/* Act on the event */
			var area = $(this).attr('class');
			if(area.indexOf('is-active')){
				area = area.replace(" is-active", "");
			}

			$child.children().removeClass('is-active').hide();
			$list.children().removeClass('is-active');
			$(this).siblings().removeClass('is-active');

			$child.children('.' + area).show().addClass('is-active');
			$list.children('.' + area).show().addClass('is-active');
			$(this).show().addClass('is-active');
		});
	});
	// $btn.children().children().each(function(){
	// 	var $self = $(this);
	// 	$self.on('click', function(event){
	// 		event.preventDefault();
	// 		/* Act on the event */
	// 		var station = $(this).attr('class');
	// 		if(station.indexOf('is-active')){
	// 			station = station.replace(" is-active", "");
	// 		}
	// 		console.log(station);
	// 		$list.children().removeClass('is-active').hide();
	// 		$(this).siblings().removeClass('is-active');
	// 		$list.children('.' + station).show().addClass('is-active');
	// 		$(this).show().addClass('is-active');
	// 	});
	// });
});