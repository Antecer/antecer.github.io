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
function NetworkChecker(good, fail) {
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
	image.src = `https://static.xx.fbcdn.net/rsrc.php/yo/r/iRmz9lCMBD2.ico?${Math.random()}`;
}

// Generic 库存管理函数
function setStock(product = 'None', colors = {
	'Color': false
}) {
	let formNode = document.querySelector(`#${product} form`);
	if (formNode) {
		// 总库存
		let inStock = false;
		Object.values(colors).forEach(val => {
			inStock = inStock || val;
		});
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
}

// 图片资源列表
const ImgPath = {
	"products": {
		"default": [
			"secret.png"
		],
		"keypadk5": [
			"BlackLedColor.jpg",
			"B&None.jpg",
			"B&Red.jpg",
			"B&Brown.jpg",
			"B&Blue.jpg",
			"B&Black.jpg",
			"B&Silver.jpg",
			"B&All.jpg",
			"SilverLedColor.jpg",
			"S&None.jpg",
			"S&Red.jpg",
			"S&Brown.jpg",
			"S&Blue.jpg",
			"S&Black.jpg",
			"S&Silver.jpg",
			"S&All.jpg"
		],
		"keypadk6": [
			"BlackLedColor.jpg",
			"B&None.jpg",
			"B&Red.jpg",
			"B&Brown.jpg",
			"B&Blue.jpg",
			"B&Black.jpg",
			"B&Silver.jpg"
		]
	}
};
var Images = {};
// 图片资源管理器
async function imageLoader(imageOrigin) {
	let products = Object.getOwnPropertyNames(ImgPath.products);
	for (let p = 0, l = products.length; p < l; ++p) {
		let productName = products[p];
		let productImgs = ImgPath.products[productName];
		let imageUrls = {};
		for (let i = 0, c = productImgs.length; i < c; ++i){
			let imageName = productImgs[i];
			let imageLink = `${imageOrigin}/products/${productName}/${imageName}`;
			imageUrls[imageName.slice(0, imageName.lastIndexOf('.'))] = imageLink;
			// 从网络预加载图片
			(new Image()).src = imageLink;
		}
		Images[productName] = imageUrls;
	}
	console.log(Images);
}

// 图片切换
function switchImg(product = 'None', switches = 'None') {
	let productImg = document.querySelector(`#${product} [alt="productImg"]`);
	if (productImg) {
		productImg.src = Images[product][switches];
	}
}

// 设置产品图片
async function setProductImgs() {
	while (!document.querySelector('.productRow')) await sleep(1000);

	// 处理图片加载失败事件
	document.querySelectorAll('img[alt="productImg"]').forEach(img => {
		img.addEventListener('error', e => {
			img.src = Images.secret.default;
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

	// 设置产品图片
	document.querySelectorAll('.productItem').forEach(productItem => {
		// 加载默认图片
		let productImg = productItem.querySelector('[alt="productImg"]');
		switch (productItem.id) {
			case 'keypadk5':
				productImg.src = Images.keypadk5.BlackLedColor;
				break;
			case 'keypadk6':
				productImg.src = Images.keypadk6.BlackLedColor;
				break;
			default:
				productImg.src = Images.default.secret;
				break;
		}
		productImg.style.visibility = 'visible';
		// 监听产品属性变更事件
		let switchTypeNode = productItem.querySelector('select[name="os0"]');
		let productColorNode = productItem.querySelector('select[name="os1"]');
		if (switchTypeNode && productColorNode) {
			let switchType = switchTypeNode.value.replace('Cherry-', '');
			let productColor = productColorNode.value[0];
			switchImg(productItem.id, `${productColor}&${switchType}`);

			switchTypeNode.addEventListener('change', e => {
				let switchType = switchTypeNode.value.replace('Cherry-', '');
				let productColor = productColorNode.value[0];
				switchImg(productItem.id, `${productColor}&${switchType}`);
			});
			productColorNode.addEventListener('change', e => {
				let switchType = switchTypeNode.value.replace('Cherry-', '');
				let productColor = productColorNode.value[0];
				switchImg(productItem.id, `${productColor}&${switchType}`);
			});
		}
	});
}

// 加载图片
(() => {
	NetworkChecker(
		async () => {
			await imageLoader(`https://antecer.github.io`);
			await setProductImgs();
		},
		async () => {
			await imageLoader(`https://antecer.gitee.io`);
			await setProductImgs();
		});
})();