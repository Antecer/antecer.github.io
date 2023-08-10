/**
 * 创建sleep方法(用于async / await的延时处理)
 * @param {int} ms 延时毫秒数
 */
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
// 背景图资源路径
const BannerPath = '/resources/images/';
const BannerFiles = ['banner1.jpg', 'banner2.jpg'];
var BannerList = {};
// 加载背景图片
(async () => {
	let BannerListDB = 'BannerList';
	BannerList = (await localforage.getItem(BannerListDB)) || {};
	for (let bannerName of BannerFiles) {
		if (BannerList[bannerName]) continue;
		let bannerUrl = `${BannerPath}${bannerName}`;
		let response = await fetch(bannerUrl);
		if (!response.ok) return console.log("FailLoad:", [bannerUrl]);
		BannerList[bannerName] = await response.blob();
		localforage.setItem(BannerListDB, BannerList);
	}
})();
// 设置背景图片
(async () => {
	let selectedBanner = BannerFiles[1];
	let backdropSelector = '.backdrop';
	while (!document.querySelector(backdropSelector)) await sleep(100);
	let bannerBlob;
	while (!bannerBlob) {
		await sleep(100);
		for (let banner in BannerList) {
			if (banner == selectedBanner) { bannerBlob = BannerList[banner]; break; }
		}
	}
	let bannerStyle = `linear-gradient(rgb(0, 0, 0), transparent, rgb(0, 0, 0)), url(${URL.createObjectURL(bannerBlob)})`;
	document.querySelector(backdropSelector).style.backgroundImage = bannerStyle;
})();