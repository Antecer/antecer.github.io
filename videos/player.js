// 设置视频播放器ID
const playerId = `#videoPlayer`;
// 设置视频路径
const playPath = `/videos/`;
// 设置播放列表
const playList = [
	`6 digit chokes.mp4`,
	`-mArisa- - Teo.mp4`,
	`Kongdyy - (^3^)chu Dere Rhapsody.mp4`,
	`Kongdyy - Beng Huai Shi Jie De Ge Ji Chinese Ver.mp4`,
	`osu!keypad Game play demo.mp4`,
	`opsu.mp4`
];

// 创建播放列表缓存
var blobList = {};

/**
 * 创建sleep方法(用于async / await的延时处理)
 * @param {int} ms 延时毫秒数
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 缓存列表内的视频
 */
(async () => {
	for (let playName of playList) {
		let videoBlob = await localforage.getItem(playName);
		if (videoBlob) {
			blobList[playName] = videoBlob;
			console.log('local loaded:', [playName]);
			continue;
		}

		let loadLink = `${playPath}${playName}`;
		console.log('fetch loading:', [loadLink]);
		let response = await fetch(loadLink);
		if (!response.ok) { console.log("FailLoad:", [loadLink]); continue; }
		videoBlob = await response.blob();
		blobList[playName] = videoBlob;
		console.log('fetch loaded:', [playName]);
		localforage.setItem(playName, videoBlob);
	}
})();

/**
 * 播放视频
 */
(async () => {
	while (!document.querySelector(playerId)) await sleep(500);
	let video = document.querySelector(playerId);
	let playName;
	// 视频播放结束事件
	video.addEventListener('ended', async function () {
		let playIndex = playList.indexOf(playName) + 1;
		playName = playList[playIndex] || playList[0];
		let playBlob = blobList[playName];
		if (!playBlob) {
			for (let key in blobList) {
				playName = key;
				playBlob = blobList[playName];
				break;
			}
		}
		video.src = URL.createObjectURL(playBlob);
	});
	// 视频资源已加载事件
	video.addEventListener('loadedmetadata', function () {
		this.style.opacity = 1;
		this.currentTime = 1;
	}, false);
	// 载入第一个视频
	while (!playName) {
		await sleep(100);
		for (let key in blobList) {
			playName = key;
			break;
		}
	}
	video.src = URL.createObjectURL(blobList[playName]);
})();