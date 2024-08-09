/**
 * 创建sleep方法(用于async / await的延时处理)
 * @param {int} ms 延时毫秒数
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
    while (!document.body) {
        await sleep(200);
    }
    let urlPaths = window.location.href.split('/');
    let thisPath = urlPaths[urlPaths.length - 2];
    document.title = `${thisPath}_ROMs`;
    document.body.innerHTML += `<h3>${thisPath}_Firmware_List:</h3>`;
    fetch('verlist.md')
        .then((res) => res.text())
        .then((txt) => {
            let versions = txt.split('\n');
            if (versions.length == 0) return;
            versions.forEach((val, i) => {
                document.body.innerHTML += `<a download href="${thisPath}_${val}.akp">${val}</a><br><br>`;
            });
        });
})();
