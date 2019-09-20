var zoomCSS = document.createElement('style');
zoomCSS.innerHTML = ".zoom { cursor: zoom-in; }";
document.head.appendChild(zoomCSS);

var zoomPanel = document.createElement('div');
document.body.appendChild(zoomPanel);
var zoomHtml = `
<div onclick="this.style.display='none'"
	style="
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	cursor: zoom-out;
	display: flex;
	align-items: center;
	justify-content: center;">
	<img class="animated zoomIn" src="imgPath"
	style="width: 80%; object-fit: cover;">
</div>`;

document.querySelectorAll('.zoom').forEach(img => {
	img.addEventListener('click', e => {
		zoomPanel.innerHTML = zoomHtml.replace('imgPath', img.src);
	});
});