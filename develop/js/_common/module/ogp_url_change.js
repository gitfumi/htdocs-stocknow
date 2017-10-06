// コンテンツの表示、非表示
let ogpUrlChange = (function() {
	var URL = location.href;
	var facebookURL = 'http://www.facebook.com/share.php?u=' + URL;
	var googleURL = 'https://plus.google.com/share?url=' + URL;
	$('#footer').find('.is-facebook a').attr('href',facebookURL);
	$('#footer').find('.is-google a').attr('href',googleURL);
}());
export default ogpUrlChange;