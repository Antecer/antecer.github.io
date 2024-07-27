(async () => {
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	const getType = (T) => Object.prototype.toString.call(T).slice(8, -1);
	const transform = (selector) => {
		let zoomVal = 1;
		if (outerWidth / outerHeight >= 2) {
			zoomVal = (innerHeight < outerHeight ? innerHeight : outerHeight) / 1000;
		} else {
			zoomVal = (innerWidth < outerWidth ? innerWidth : outerWidth) / 2000;
		}
		if (zoomVal > 1) zoomVal = 1;
		document.querySelector(selector).style.transform = `scale(${zoomVal},${zoomVal})`;
	};
	const drawLayout = (selectPanel) => {
		var rowList = [];
		selectPanel.layout.forEach(row => {
			var rowClass = "layout";
			var rowStyle = "";
			if (getType(row) == "Object") {
				if (row.h) rowClass = `vh-${row.h}`;
				if (row.a && (getType(row.a) == "Array")) row = row.a;
				if (row.t) rowStyle = `style="${row.t || ''}"`;
			}
			if (getType(row) != "Array") {
				rowList.push(`<div class="${rowClass}" ${rowStyle}></div>`);
				return;
			}

			var domList = [];
			row.forEach(dom => {
				var domClass = "";
				var domStyle = "";
				if (getType(dom) == "String") {
					if (dom == "encoder") domList.push(`<div class="keycap encoder"></div>`);
					else domList.push(`<div class="keycap">${dom.replace("\n", "<br/>")}</div>`);
					return;
				}

				if (getType(dom) == "Object") {
					if (dom.t) domStyle = `style="${dom.t || ''}"`;
					if (dom.w) domClass += ` vw-${dom.w}`;
					if (dom.h) domClass += ` vh-${dom.h}`;
					if (dom.fx) domClass += ` offset-vw${dom.fx}`;
					if (dom.fy) domClass += ` offset-vh${dom.fy}`;
					if (dom.led) {
						domClass = `led-${dom.led}` + domClass;
						domList.push(`<div class="${domClass}" ${domStyle}></div>`);
						return;
					}
					if (dom.k && (getType(dom.k) == "String")) {
						if (dom.k == "encoder") domList.push(`<div class="keycap encoder${domClass}" ${domStyle}></div>`);
						else domList.push(`<div class="keycap${domClass}" ${domStyle}>${dom.k.replace("\n", "<br/>")}</div>`);
						return;
					}
					domList.push(`<div class="${domClass}" ${domStyle}></div>`);
				}
			});

			rowList.push(`<div class="${rowClass}" ${rowStyle}>${domList.join('')}</div>`);
		});

		var labelHtml = `<div class="typeLabel">${selectPanel.name}</div>`;
		if (selectPanel.label) {
			var labelText = selectPanel.label.v || selectPanel.name;
			var labelStyle = `style="${selectPanel.label.t || ''}"`;
			labelHtml = `<div class="typeLabel" ${labelStyle}>${labelText}</div>`;
		}

		return `<div class="exhibit ${selectPanel.name}" style="${selectPanel.t || ''}"><div class="typesetting">${rowList.join('')}</div>${labelHtml}</div>`;
	};
	const drawKeyTable = (selectKeys) => {
		var tabPanelRows = [];
		for (let i = 0, j = selectKeys.length; i < j; ++i) {
			let keyvals = selectKeys[i];
			let keyHtmlList = [];
			for (let k in keyvals) keyHtmlList.push(`<div class="keycap" code="${k}">${keyvals[k].replace(/\n/, '<br/>')}</div>`);
			tabPanelRows.push(`<div class="keyshelf">${keyHtmlList.join('')}</div>`);
		}
		return tabPanelRows.join('');
	}

	// 载入缓存的资源
	var PartLayout = await localforage.getItem("PartLayout");
	var KeyCodes = await localforage.getItem("KeyCodes");
	var HID_KeyboardPage = await localforage.getItem("HID_KeyboardPage");
	var HID_ConsumerPage = await localforage.getItem("HID_ConsumerPage");
	var HID_Special = await localforage.getItem("HID_Special");
	// 更新资源
	var fetch_PartLayout = fetch(`resources/PartLayout.json`).then(res => res.json())
		.then(json => localforage.setItem("PartLayout", json));
	var fetch_KeyCodes = fetch(`resources/KeyCodes.json`).then(res => res.json())
		.then(json => localforage.setItem("KeyCodes", json));
	var fetch_HID_KeyboardPage = fetch(`resources/HID_KeyboardPage.json`).then(res => res.json())
		.then(json => localforage.setItem("HID_KeyboardPage", json));
	var fetch_HID_ConsumerPage = fetch(`resources/HID_ConsumerPage.json`).then(res => res.json())
		.then(json => localforage.setItem("HID_ConsumerPage", json));
	var fetch_HID_ConsumerPage = fetch(`resources/HID_Special.json`).then(res => res.json())
		.then(json => localforage.setItem("HID_Special", json));
	// 初始化
	if (PartLayout == null) PartLayout = await fetch_PartLayout;
	if (KeyCodes == null) KeyCodes = await fetch_KeyCodes;
	if (HID_KeyboardPage == null) HID_KeyboardPage = await fetch_HID_KeyboardPage;
	if (HID_ConsumerPage == null) HID_ConsumerPage = await fetch_HID_ConsumerPage;
	if (HID_Special == null) HID_Special = await fetch_HID_ConsumerPage;

	// 绘制键盘布局
	document.querySelector(".content").setHTML(drawLayout(PartLayout[0]));
	// 绑定界面缩放
	while (!document.querySelector('.exhibit')) sleep(100);
	var resizeTimer = setTimeout(() => { transform('.exhibit') }, 100);
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => { transform('.exhibit') }, 100);
	});
	// 绑定键盘布局点击事件
	var selectedKeycap = null;
	document.querySelector('.content').addEventListener('click', (e) => {
		if (selectedKeycap != null) selectedKeycap.classList.remove('blink');
		if (e.target.classList.contains('keycap')) {
			selectedKeycap = e.target;
			selectedKeycap.classList.add('blink');
		}
		console.log(`你点击了:`, e.target);
	});

	// 获取键值表
	const tabPanel = document.querySelector('.tab_panel');
	// 绑定标签列表点击事件
	var selectedTabLabel = null;
	document.querySelector('.tab_list').addEventListener('click', (e) => {
		if (!e.target.classList.contains('tab_label')) return;
		document.querySelectorAll('.tab_list>.tab_label').forEach(node => node.removeAttribute('selected'));
		selectedTabLabel = e.target;
		selectedTabLabel.setAttribute('selected', '');
		switch (selectedTabLabel.textContent) {
			case 'Ansi':
				tabPanel.setHTML(drawKeyTable(KeyCodes.Ansi));
				break;
			case 'Basic':
				tabPanel.setHTML(drawKeyTable(KeyCodes.Basic));
				break;
			case 'Media':
				tabPanel.setHTML(drawKeyTable(KeyCodes.Media));
				break;
			case 'Special':
				tabPanel.setHTML(drawKeyTable(KeyCodes.Special));
				break;
			case 'Layers':
				tabPanel.setHTML(drawKeyTable(KeyCodes.Layers));
				break;
			default:
				tabPanel.setHTML(``);
				console.log(`你点击了: `, selectedTabLabel);
				break;
		}
	});
	document.querySelector('.tab_list>*').click();
	// 绑定键值表点击事件
	document.querySelector('.tab_panel').addEventListener('click', (e) => {
		if (e.target.classList.contains('keycap')) {
			if (selectedKeycap != null) {
				selectedKeycap.setHTML(e.target.innerHTML);
				selectedKeycap.setAttribute('code', e.target.getAttribute('code'));
				selectedKeycap.classList.remove('blink');
				let prevNode = selectedKeycap;
				let nextNode = prevNode.nextElementSibling;
				while (true) {
					if (nextNode != null) {
						if (nextNode.classList.contains('keycap')) {
							nextNode.click();
							break;
						}
						else {
							prevNode = nextNode;
							nextNode = prevNode.nextElementSibling;
							continue;
						}
					}
					nextNode = prevNode.parentNode.nextElementSibling;
					if (nextNode == null) {
						selectedKeycap = null;
						break;
					}
					nextNode = nextNode.firstElementChild;
				}
			}
		}
	});
	// 绑定鼠标悬停事件
	const tabTips = document.querySelector('.tab_tips');
	document.querySelector('.tab_panel').addEventListener('mouseover', (e) => {
		tabTips.setHTML('');
		if (e.target.classList.contains('keycap')) {
			let nodeCode = e.target.getAttribute('code');
			switch (selectedTabLabel.textContent) {
				case 'Basic':
				case 'Ansi':
					tabTips.setHTML(`KeyCode= ${nodeCode};    KeyValue= ${HID_KeyboardPage[nodeCode]}`);
					break;
				case 'Media':
					tabTips.setHTML(`KeyCode= ${nodeCode};    KeyValue= ${HID_ConsumerPage[nodeCode]}`);
					break;
				case 'Special':
					tabTips.setHTML(`KeyCode= ${nodeCode};    KeyValue= ${HID_Special[nodeCode]}`);
					break;
				case 'Layers':
					if (e.target.textContent.startsWith('Fn')) {
						tabTips.setHTML(`${e.target.textContent}:  Hold to select layer ${e.target.textContent.slice(2)}`);
					}
					if (e.target.textContent.startsWith('DL')) {
						tabTips.setHTML(`${e.target.textContent}:  Set the default layer ${e.target.textContent.slice(2)}`);
					}
					break;
				default:
					tabPanel.setHTML(``);
					console.log(`你点击了: `, selectedTabLabel);
					break;
			}
		}
	});


})();
