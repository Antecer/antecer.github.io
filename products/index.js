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

// keypadk5库存管理
setStock('keypadk5', {
	'Silver': true,
	'Black': false
});

// keypadk5库存管理
setStock('keypadk6', {
	'Silver': false,
	'Black': true
});

// 处理图片加载失败事件
document.querySelectorAll('img[alt="productImg"]').forEach(img => {
	img.addEventListener('error', e => {
		img.src = "secret.png";
	});
})

// 图片切换
function switchImg(product = 'None', switches = 'None') {
	let formNode = document.querySelector(`#${product} [alt="productImg"]`);
	if (formNode) {
		formNode.src = `${product}/${switches}.jpg`;
	}
}

// 监听keypad产品属性变更
let products = document.querySelectorAll('[id^="keypad"]');
products.forEach(productItem => {
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

// 图片预加载函数
function preloadimg(imgs = []) {
	imgs.forEach(img => {
		let imgNode = new Image();
		imgNode.src = img;
	});
};

// 预加载图片资源
const imgArray = [
	'keypadk5/B&None.jpg',
	'keypadk5/B&Red.jpg',
	'keypadk5/B&Brown.jpg',
	'keypadk5/B&Blue.jpg',
	'keypadk5/B&Black.jpg',
	'keypadk5/B&Silver.jpg',
	'keypadk5/B&All.jpg',
	'keypadk5/S&None.jpg',
	'keypadk5/S&Red.jpg',
	'keypadk5/S&Brown.jpg',
	'keypadk5/S&Blue.jpg',
	'keypadk5/S&Black.jpg',
	'keypadk5/S&Silver.jpg',
	'keypadk5/S&All.jpg',
	'keypadk6/B&None.jpg',
	'keypadk6/B&Red.jpg',
	'keypadk6/B&Brown.jpg',
	'keypadk6/B&Blue.jpg',
	'keypadk6/B&Black.jpg',
	'keypadk6/B&Silver.jpg',
	// 'keypadk6/S&None.jpg',
	// 'keypadk6/S&Red.jpg',
	// 'keypadk6/S&Brown.jpg',
	// 'keypadk6/S&Blue.jpg',
	// 'keypadk6/S&Black.jpg',
	// 'keypadk6/S&Silver.jpg'
];
preloadimg(imgArray);