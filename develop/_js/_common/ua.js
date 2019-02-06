// ユーザーエージェントを取得
let ua = (function() {
	return {
		ltIE7: typeof window.addEventListener == "undefined" && typeof document.querySelectorAll == "undefined",
		ltIE8: typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined",
		ltIE9: !(typeof history.pushState === "function") && document.uniqueID,
		gtIE10:document.uniqueID && window.matchMedia,
		IE: document.uniqueID,
		Firefox: window.sidebar,
		Opera: window.opera,
		Webkit: !document.uniqueID && !window.opera && !window.sidebar && window.localStorage && typeof window.orientation == "undefined",
		Mobile: typeof window.orientation != "undefined",
		iPad: navigator.userAgent.indexOf('iPad') > 0,
		iPhone: navigator.userAgent.indexOf('iPhone') > 0,
		iPod: navigator.userAgent.indexOf('iPod') > 0,
		androidTablet: (navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') == -1),
		androidPhone: (navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0)
	}
}());
export default ua;