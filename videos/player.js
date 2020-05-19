// 设置视频播放器ID
const playerId = `#videoPlayer`;
// 设置视频路径
const playPath = `/videos/`;
// 设置播放列表
const playList = [
	`6 digit chokes`,
	`-mArisa- - Teo`,
	`Kongdyy - (^3^)chu Dere Rhapsody`,
	`Kongdyy - Beng Huai Shi Jie De Ge Ji Chinese Ver`,
	`osu!keypad Game play demo`,
	`opsu`
];

// 创建播放列表缓存
var blobList = [];

/**
 * 创建sleep方法(用于async / await的延时处理)
 * @param {int} ms 延时毫秒数
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 缓存列表内的视频
 * @param {Array} linkList 包含多个视频链接的数组
 */
async function LoadVideo(linkList) {
	for (let i = 0, len = linkList.length; i < len; i++) {
		let loadLink = `${playPath}${linkList[i]}`;
		let response = await fetch(loadLink);
		if (!response.ok) {
			console.log("Failed:", loadLink);
			continue;
		}
		blobList.push(window.URL.createObjectURL(await response.blob()));
		console.log("Loaded:", loadLink);
	}
}

(async () => {
	// 等待播放器加载
	while (!document.querySelector(playerId)) await sleep(500);
	let video = document.querySelector(playerId);
	video.src = URL.createObjectURL(new MediaSource());
	// 视频播放结束事件
	video.addEventListener('ended', () => {
		let index = 0;
		let videoLink = video.src;
		for (let i = 0, len = blobList.length; i < len; i++) {
			if (videoLink == blobList[i]) {
				index = ++i < blobList.length ? i : 0;
				break;
			}
		}
		video.src = blobList[index];
		video.load();
		video.play();
		// 预加载下一个视频(如果有)
		if (++index < playList.length && index >= blobList.length) {
			LoadVideo([playList[index]]);
		}
	});
	// 加载播放列表
	await LoadVideo([playList[0]]);
	// 载入第一个视频
	video.src = blobList[0];
	// 预加载下一个视频
	if (playList.length > 1) await LoadVideo([playList[1]]);
})();