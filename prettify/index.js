/**
 * 创建sleep方法(用于async / await的延时处理)
 * @param {int} ms 延时毫秒数
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
	while (!document.querySelector('select[name="cutOptions"]')) await sleep(500);

	document.querySelector('select[name="cutOptions"]').addEventListener('change', e => {
		let cutSelected = document.querySelector('select[name="cutOptions"]').value;
		document.querySelectorAll('.cutImg').forEach(cuter => {
			if (cuter.id == cutSelected) {
				cuter.classList.remove('hide');
			} else {
				cuter.classList.add('hide');
			}
		});
	});
})();