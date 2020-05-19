/**
 * 创建sleep方法(用于async / await的延时处理)
 * @param {int} ms 延时毫秒数
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 网络环境判断
 * @param {Function} good 判定成功后执行的回调函数
 * @param {Function} fail 判定失败后执行的回调函数
 */
function checkWebSiteOnline(good, fail) {
	// 添加超时判断 0-未知,1-成功,2-失败,3-超时
	let isTimeOver = 0;
	// 新建image元素,作为判断依据
	let image = new Image();
	// 访问正常
	image.onload = function () {
		if (isTimeOver == 0) {
			isTimeOver = 1;
			good();
		}
	};
	// 访问失败
	image.onerror = function () {
		if (isTimeOver == 0) {
			isTimeOver = 2;
			fail();
		}
	};
	// 访问超时(做失败处理)
	setTimeout(() => {
		if (isTimeOver == 0) {
			isTimeOver = 3;
			fail();
		}
	}, 500);
	// 访问目标图片
	image.src = `http://youtube.com/favicon.ico?${Math.random()}`;
}

(async () => {
	while (!document.querySelector('.videoBox>iframe')) await sleep(500);
	let playBox = document.querySelector('.videoBox>iframe');
	checkWebSiteOnline(
		() => {
			if (window.location.host != `antecer.github.io`)
				playBox.src = `//antecer.github.io/videos/`;
		},
		() => {
			if (window.location.host != `antecer.gitee.io`)
			playBox.src = `//antecer.gitee.io/videos/`;
		}
	);
})();