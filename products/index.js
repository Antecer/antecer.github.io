const getType = (T) => Object.prototype.toString.call(T).slice(8, -1);
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
	let selectedBanner = BannerFiles[0];
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

// 图片资源列表
const Images = {
	"products": {
		"default": [
			"secret.png"
		],
		"keypadk5": [
			"B&default.jpg",
			"B&None.jpg",
			"B&Red.jpg",
			"B&Brown.jpg",
			"B&Blue.jpg",
			"B&Black.jpg",
			"B&Silver.jpg",
			"B&All.jpg",
			"S&default.jpg",
			"S&None.jpg",
			"S&Red.jpg",
			"S&Brown.jpg",
			"S&Blue.jpg",
			"S&Black.jpg",
			"S&Silver.jpg",
			"S&All.jpg"
		]
		,
		"keypadk6": [
			"B&default.jpg",
			"B&None.jpg",
			"B&Red.jpg",
			"B&Brown.jpg",
			"B&Blue.jpg",
			"B&Black.jpg",
			"B&Silver.jpg"
		]
	},
	"resources": {
		"images": [
			"add_to_cart.png",
			"view_cart.png"
		]
	}
};
var ImageCache = {};

// 加载图片资源
(async () => {
	// 加载图片资源列表
	let imageList = [];
	let traverseT = (item, path = '') => {
		if (getType(item) == "Object") { for (let key in item) { traverseT(item[key], `${path}/${key}`); } }
		else if (getType(item) == "Array") { for (let val of item) { imageList.push(`${path}/${val}`); } }
	};
	traverseT(Images);
	// 加载图片缓存
	let ImageCacheDB = 'ImageCache';
	ImageCache = (await localforage.getItem(ImageCacheDB)) || {};
	// 图片加载函数
	let loadImg = async (imagePath) => {
		if (ImageCache[imagePath]) return;
		let response = await fetch(imagePath);
		if (!response.ok) return console.log("FailLoad:", [imagePath]);
		ImageCache[imagePath] = await response.blob();
		await localforage.setItem(ImageCacheDB, ImageCache);
	}
	// 优先加载默认要显示的图片
	let defaultImages = imageList.filter(path => path.toLowerCase().match(/default|cart/));
	for (let imagePath of defaultImages) { await loadImg(imagePath); }
	// 加载剩余图片
	for (let imagePath of imageList) { await loadImg(imagePath); }
})();

// 页面交互逻辑
(async () => {
	// 设置图片
	let setImg = async (imageNode, imagePath) => {
		if (imageNode) {
			let imageBlob = ImageCache[imagePath];
			while (!imageBlob) {
				await sleep(100);
				imageBlob = ImageCache[imagePath];
			}
			imageNode.src = URL.createObjectURL(imageBlob);
		}
	}

	// 等待html容器加载完成
	while (!document.querySelector('.productRow')) await sleep(1000);

	// 处理图片加载失败事件
	document.querySelectorAll('img[alt="productImg"]').forEach(img => {
		img.addEventListener('error', e => {
			img.src = ImageCache[`/products/default/secret.png`];
		});
	})

	// keypadk5库存管理
	setStock('keypadk5', {
		'Silver': true,
		'Black': true
	});
	// keypadk6库存管理
	setStock('keypadk6', {
		'Silver': false,
		'Black': true
	});

	// 设置购物车图片
	document.querySelectorAll('.productItem input[type="image"]').forEach(button => {
		setImg(button, `/resources/images/add_to_cart.png`);
	});
	setImg(document.querySelector('.footer input[type="image"]'), `/resources/images/view_cart.png`);

	// 设置产品图片
	document.querySelectorAll('.productItem').forEach(productItem => {
		// 加载默认图片
		let productImg = productItem.querySelector('[alt="productImg"]');
		switch (productItem.id) {
			case 'keypadk5':
				setImg(productImg, `/products/keypadk5/B&default.jpg`);
				break;
			case 'keypadk6':
				setImg(productImg, `/products/keypadk6/B&default.jpg`);
				break;
			default:
				setImg(productImg, `/products/default/secret.png`);
				break;
		}
		productImg.style.visibility = 'visible';
		// 监听产品属性变更事件
		let productTypeNode = productItem.querySelector('select[name="os0"]');
		let productColorNode = productItem.querySelector('select[name="os1"]');
		if (productTypeNode && productColorNode) {
			let productType = productTypeNode.value.replace('Cherry-', '');
			let productColor = productColorNode.value[0];
			setImg(productImg, `/products/${productItem.id}/${productColor}&${productType}.jpg`);

			productTypeNode.addEventListener('change', e => {
				let productType = productTypeNode.value.replace('Cherry-', '');
				let productColor = productColorNode.value[0];
				setImg(productImg, `/products/${productItem.id}/${productColor}&${productType}.jpg`);
			});
			productColorNode.addEventListener('change', e => {
				let productType = productTypeNode.value.replace('Cherry-', '');
				let productColor = productColorNode.value[0];
				setImg(productImg, `/products/${productItem.id}/${productColor}&${productType}.jpg`);
			});
		}
	});
})();

// 库存管理函数
function setStock(product = 'None', colors = {}) {
	let formNode = document.querySelector(`#${product} form`);
	if (!formNode) return;
	// 总库存
	let inStock = false;
	Object.values(colors).forEach(val => { inStock ||= val; });
	if (inStock) {
		formNode.setAttribute('onsubmit', 'return true');
	} else {
		formNode.setAttribute('onsubmit', 'return false');
		return;
	}

	// 分类库存
	inStock = false;
	Object.keys(colors).forEach(color => {
		let stockColor = formNode.querySelector(`option[value=${color}]`);
		if (stockColor) {
			if (colors[color]) {
				stockColor.removeAttribute('disabled');
				stockColor.parentNode.value = color;
			} else {
				stockColor.setAttribute('disabled', 'disabled');
			}
		}
	});
}

// 欧盟可送达的国家列表
(async () => {
	// 等待国家列表加载
	while (true) {
		try {
			if (countryListCN) break;
		} catch (e) {
			await sleep(100);
		}
	}
	// 不可送达的欧盟成员国
	const EuropeanUnion = [
		'奥地利',
		'比利时',
		'保加利亚',
		'塞浦路斯',
		'克罗地亚',
		'捷克',
		'丹麦',
		'爱沙尼亚',
		'芬兰',
		'法国',
		'德国',
		'希腊',
		'匈牙利',
		'爱尔兰',
		'意大利',
		'拉脱维亚',
		'立陶宛',
		'卢森堡',
		'马耳他',
		'荷兰',
		'波兰',
		'葡萄牙',
		'罗马尼亚',
		'斯洛伐克',
		'斯洛文尼亚',
		'西班牙',
		'瑞典'
	];
	let targetCyName = countryListCN[localStorage.getItem('ShipTo')];
	if (targetCyName && (!EuropeanUnion.includes(targetCyName))) {
		document.querySelector('.bulletin').style.display = 'none';
	}
})();