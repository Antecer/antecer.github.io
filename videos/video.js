var options = {};
// 创建播放列表
var playList = [
	"6 digit chokes.mp4",
	"-mArisa- - Teo.mp4",
	"Kongdyy - (^3^)chu Dere Rhapsody.mp4",
	"Kongdyy - Beng Huai Shi Jie De Ge Ji Chinese Ver.mp4",
	"osu!keypad Game play demo.mp4",
	"opsu.mp4"
];
// 播放器事件绑定
var player = videojs('videoPlayer', options, function onPlayerReady() {
	// 注意: `this` 指向的是Video.js的实例对像player
	let index = 0;

	// 加载默认视频
	// let loadVideo = "/videos/" + playList[index];
	// console.log('[VideoJs] 播放器准备就绪:', loadVideo)
	// this.src({
	// 	src: loadVideo,
	// 	type: "video/mp4"
	// });
	// this.play();

	// 当前视频播放结束事件
	this.on('ended', function () {
		// 循环播放列表
		if (++index >= playList.length) {
			index = 0;
		}
		// 加载下一个视频
		let loadVideo = "/videos/" + playList[index];
		console.log('[VideoJs] 加载下一个视频:', loadVideo);
		this.src({
			src: loadVideo,
			type: "video/mp4"
		});
		this.play();
	});
});