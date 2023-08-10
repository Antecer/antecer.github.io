// 设置视频播放器ID
const playerId = `#videoPlayer`;
// 视频资源路径
const VideoPath = `/videos/`;
const VideoList = [
	`6 digit chokes.mp4`,
	`-mArisa- - Teo.mp4`,
	`Kongdyy - (^3^)chu Dere Rhapsody.mp4`,
	`Kongdyy - Beng Huai Shi Jie De Ge Ji Chinese Ver.mp4`,
	`osu!keypad Game play demo.mp4`,
	`opsu.mp4`
];
var VideoCache = {};

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
	let VideoCacheDB = 'VideoCache';
	VideoCache = (await localforage.getItem(VideoCacheDB)) || {};
	for (let videoName of VideoList) {
		if (VideoCache[videoName]) continue;
		let videoUrl = `${VideoPath}${videoName}`;
		let response = await fetch(videoUrl);
		if (!response.ok) return console.log("FailLoad:", [videoUrl]);
		VideoCache[videoName] = await response.blob();
		localforage.setItem(VideoCacheDB, VideoCache);
	}
})();

/**
 * 播放视频
 */
(async () => {
	while (!document.querySelector(playerId)) await sleep(500);
	let videoNode = document.querySelector(playerId);
	let videoName;
	// 视频播放结束事件
	videoNode.addEventListener('ended', async function () {
		let playIndex = VideoList.indexOf(videoName) + 1;
		videoName = VideoList[playIndex] || VideoList[0];
		let videoBlob = VideoCache[videoName];
		if (!videoBlob) {
			for (let key in VideoCache) {
				videoName = key;
				videoBlob = VideoCache[videoName];
				break;
			}
		}
		videoNode.src = URL.createObjectURL(videoBlob);
	});
	// 视频资源已加载事件
	videoNode.addEventListener('loadedmetadata', function () {
		this.style.opacity = 1;
		this.currentTime = 1;
	}, false);
	// 载入第一个视频
	while (!videoName) {
		await sleep(100);
		for (let key in VideoCache) {
			videoName = key;
			break;
		}
	}
	videoNode.src = URL.createObjectURL(VideoCache[videoName]);
})();