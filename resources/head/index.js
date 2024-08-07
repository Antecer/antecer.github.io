// 高亮导航栏当前页标签
var pageMatch = parent.location.href.replace(location.origin, '').match('/[^/]+/');
if (pageMatch) {
	var pageTab = document.querySelector(`.navlink a[href="${pageMatch[0]}"]`);
	if (pageTab) {
		pageTab.href = 'javascript:;';
		pageTab.className += ' selected';
	}
}
// 显示导航(移动端)
var mobileNav = document.querySelector('.navpanel>.navlink>a.selected');
if (mobileNav) {
	mobileNav.addEventListener('click', (e) => {
		var header = document.querySelector('.header');
		if (header.className.indexOf('fold') > -1) {
			header.className = header.className.replace(' fold', '');
		} else {
			header.className += ' fold';
			document.querySelector('.cypanel').style.display = 'none';
		}
	});
}

const shippingList = [
	'AT',
	'AU',
	'BE',
	'BR',
	'CA',
	'CH',
	'DE',
	'DK',
	'ES',
	'FI',
	'FR',
	'GB',
	'GR',
	'HK',
	'HU',
	'ID',
	'IE',
	'IL',
	'IT',
	'JP',
	'KR',
	'KZ',
	'LU',
	'MX',
	'MY',
	'NL',
	'NO',
	'NZ',
	'PL',
	'PT',
	'RU',
	'SA',
	'SE',
	'SG',
	'TH',
	'TR',
	'UA',
	'US',
	'VN',
	'CZ',
	'LT',
	'SI',
	'SK',
	'LV',
	'CN'
];

const countryListEN = {
	AD: 'Republic of Andorra',
	AE: 'United Arab Emirates',
	AF: 'Afghanistan',
	AG: 'Antigua and Barbuda',
	AI: 'Anguilla',
	AL: 'Albania',
	AM: 'Armenia',
	AO: 'Angola',
	AR: 'Argentina',
	AT: 'Austria',
	AU: 'Australia',
	AZ: 'Azerbaijan',
	BB: 'Barbados',
	BD: 'Bangladesh',
	BE: 'Belgium',
	BF: 'Burkina Faso',
	BG: 'Bulgaria',
	BH: 'Bahrain',
	BI: 'Burundi',
	BJ: 'Benin',
	BL: 'Palestine',
	BM: 'Bermuda Islands',
	BN: 'Brunei',
	BO: 'Bolivia',
	BR: 'Brazil',
	BS: 'Bahamas',
	BW: 'Botswana',
	BY: 'Belarus',
	BZ: 'Belize',
	CA: 'Canada',
	CF: 'Central African Republic',
	CG: 'Congo',
	CH: 'Switzerland',
	CK: 'Cook Islands',
	CL: 'Chile',
	CM: 'Cameroon',
	CN: 'China',
	CO: 'Colombia',
	CR: 'Costa Rica',
	CS: 'Czech',
	CU: 'Cuba',
	CY: 'Cyprus',
	CZ: 'Czech',
	DE: 'Germany',
	DJ: 'Djibouti',
	DK: 'Denmark',
	DO: 'Dominican Republic',
	DZ: 'Algeria',
	EC: 'Ecuador',
	EE: 'Estonia',
	EG: 'Egypt',
	ES: 'Spain',
	ET: 'Ethiopia',
	FI: 'Finland',
	FJ: 'Fiji',
	FR: 'France',
	GA: 'Gabon',
	GB: 'United Kingdom',
	GD: 'Grenada',
	GE: 'Georgia',
	GF: 'French Guiana',
	GH: 'Ghana',
	GI: 'Gibraltar',
	GM: 'Gambia',
	GN: 'Guinea',
	GR: 'Greece',
	GT: 'Guatemala',
	GU: 'Guam',
	GY: 'Guyana',
	HK: 'Hong Kong',
	HN: 'Honduras',
	HT: 'Haiti',
	HU: 'Hungary',
	ID: 'Indonesia',
	IE: 'Ireland',
	IL: 'Israel',
	IN: 'India',
	IQ: 'Iraq',
	IR: 'Iran',
	IS: 'Iceland',
	IT: 'Italy',
	JM: 'Jamaica',
	JO: 'Jordan',
	JP: 'Japan',
	KE: 'Kenya',
	KG: 'Kyrgyzstan',
	KH: 'Cambodia',
	KP: 'North Korea',
	KR: 'Korea',
	KT: "Republic of Côte d'Ivoire",
	KW: 'Kuwait',
	KZ: 'Kazakhstan',
	LA: 'Laos',
	LB: 'Lebanon',
	LC: 'Saint Lucia',
	LI: 'Liechtenstein',
	LK: 'Sri Lanka',
	LR: 'Liberia',
	LS: 'Lesotho',
	LT: 'Lithuania',
	LU: 'Luxembourg',
	LV: 'Latvia',
	LY: 'Libya',
	MA: 'Morocco',
	MC: 'Monaco',
	MD: 'Moldova',
	MG: 'Madagascar',
	ML: 'Mali',
	MM: 'Myanmar',
	MN: 'Mongolia',
	MO: 'Macau',
	MS: 'Montserrat Island',
	MT: 'Malta',
	MU: 'Mauritius',
	MV: 'Maldives',
	MW: 'Malawi',
	MX: 'Mexico',
	MY: 'Malaysia',
	MZ: 'Mozambique',
	NA: 'Namibia',
	NE: 'Niger',
	NG: 'Nigeria',
	NI: 'Nicaragua',
	NL: 'Netherlands',
	NO: 'Norway',
	NP: 'Nepal',
	NR: 'Nauru',
	NZ: 'New Zealand',
	OM: 'Oman',
	PA: 'Panama',
	PE: 'Peru',
	PF: 'French Polynesia',
	PG: 'Papua New Guinea',
	PH: 'Philippines',
	PK: 'Pakistan',
	PL: 'Poland',
	PR: 'Puerto Rico',
	PT: 'Portugal',
	PY: 'Paraguay',
	QA: 'Qatar',
	RO: 'Romania',
	RU: 'Russia',
	SA: 'Saudi Arabia',
	SB: 'Solomon Islands',
	SC: 'Seychelles',
	SD: 'Sudan',
	SE: 'Sweden',
	SG: 'Singapore',
	SI: 'Slovenia',
	SK: 'Slovakia',
	SL: 'Sierra Leone',
	SM: 'San Marino',
	SN: 'Senegal',
	SO: 'Somalia',
	SR: 'Suriname',
	ST: 'Sao Tome and Principe',
	SV: 'El Salvador',
	SY: 'Syria',
	SZ: 'Swaziland',
	TD: 'Tchad',
	TG: 'Togo',
	TH: 'Thailand',
	TJ: 'Tajikistan',
	TM: 'Turkmenistan',
	TN: 'Tunisia',
	TO: 'Tonga',
	TR: 'Turkey',
	TT: 'Trinidad and Tobago',
	TW: 'China Taiwan',
	TZ: 'Tanzania',
	UA: 'Ukraine',
	UG: 'Uganda',
	US: 'United States',
	UY: 'Uruguay',
	UZ: 'Uzbekistan',
	VC: 'St. Vincent',
	VE: 'Venezuela',
	VN: 'Vietnam',
	YE: 'Yemen',
	YU: 'Yugoslavia',
	ZA: 'South Africa',
	ZM: 'Zambia',
	ZR: 'Zaire',
	ZW: 'Zimbabwe',
	CN: 'China'
};

const countryListCN = {
	AD: '安道尔共和国',
	AE: '阿拉伯联合酋长国',
	AF: '阿富汗',
	AG: '安提瓜和巴布达',
	AI: '安圭拉岛',
	AL: '阿尔巴尼亚',
	AM: '亚美尼亚',
	AO: '安哥拉',
	AR: '阿根廷',
	AT: '奥地利',
	AU: '澳大利亚',
	AZ: '阿塞拜疆',
	BB: '巴巴多斯',
	BD: '孟加拉国',
	BE: '比利时',
	BF: '布基纳法索',
	BG: '保加利亚',
	BH: '巴林',
	BI: '布隆迪',
	BJ: '贝宁',
	BL: '巴勒斯坦',
	BM: '百慕大群岛',
	BN: '文莱',
	BO: '玻利维亚',
	BR: '巴西',
	BS: '巴哈马',
	BW: '博茨瓦纳',
	BY: '白俄罗斯',
	BZ: '伯利兹',
	CA: '加拿大',
	CF: '中非共和国',
	CG: '刚果',
	CH: '瑞士',
	CK: '库克群岛',
	CL: '智利',
	CM: '喀麦隆',
	CN: '中国',
	CO: '哥伦比亚',
	CR: '哥斯达黎加',
	CS: '捷克',
	CU: '古巴',
	CY: '塞浦路斯',
	CZ: '捷克',
	DE: '德国',
	DJ: '吉布提',
	DK: '丹麦',
	DO: '多米尼加共和国',
	DZ: '阿尔及利亚',
	EC: '厄瓜多尔',
	EE: '爱沙尼亚',
	EG: '埃及',
	ES: '西班牙',
	ET: '埃塞俄比亚',
	FI: '芬兰',
	FJ: '斐济',
	FR: '法国',
	GA: '加蓬',
	GB: '英国',
	GD: '格林纳达',
	GE: '格鲁吉亚',
	GF: '法属圭亚那',
	GH: '加纳',
	GI: '直布罗陀',
	GM: '冈比亚',
	GN: '几内亚',
	GR: '希腊',
	GT: '危地马拉',
	GU: '关岛',
	GY: '圭亚那',
	HK: '香港特别行政区',
	HN: '洪都拉斯',
	HT: '海地',
	HU: '匈牙利',
	ID: '印度尼西亚',
	IE: '爱尔兰',
	IL: '以色列',
	IN: '印度',
	IQ: '伊拉克',
	IR: '伊朗',
	IS: '冰岛',
	IT: '意大利',
	JM: '牙买加',
	JO: '约旦',
	JP: '日本',
	KE: '肯尼亚',
	KG: '吉尔吉斯坦',
	KH: '柬埔寨',
	KP: '朝鲜',
	KR: '韩国',
	KT: '科特迪瓦共和国',
	KW: '科威特',
	KZ: '哈萨克斯坦',
	LA: '老挝',
	LB: '黎巴嫩',
	LC: '圣卢西亚',
	LI: '列支敦士登',
	LK: '斯里兰卡',
	LR: '利比里亚',
	LS: '莱索托',
	LT: '立陶宛',
	LU: '卢森堡',
	LV: '拉脱维亚',
	LY: '利比亚',
	MA: '摩洛哥',
	MC: '摩纳哥',
	MD: '摩尔多瓦',
	MG: '马达加斯加',
	ML: '马里',
	MM: '缅甸',
	MN: '蒙古',
	MO: '澳门',
	MS: '蒙特塞拉特岛',
	MT: '马耳他',
	MU: '毛里求斯',
	MV: '马尔代夫',
	MW: '马拉维',
	MX: '墨西哥',
	MY: '马来西亚',
	MZ: '莫桑比克',
	NA: '纳米比亚',
	NE: '尼日尔',
	NG: '尼日利亚',
	NI: '尼加拉瓜',
	NL: '荷兰',
	NO: '挪威',
	NP: '尼泊尔',
	NR: '瑙鲁',
	NZ: '新西兰',
	OM: '阿曼',
	PA: '巴拿马',
	PE: '秘鲁',
	PF: '法属玻利尼西亚',
	PG: '巴布亚新几内亚',
	PH: '菲律宾',
	PK: '巴基斯坦',
	PL: '波兰',
	PR: '波多黎各',
	PT: '葡萄牙',
	PY: '巴拉圭',
	QA: '卡塔尔',
	RO: '罗马尼亚',
	RU: '俄罗斯',
	SA: '沙特阿拉伯',
	SB: '所罗门群岛',
	SC: '塞舌尔',
	SD: '苏丹',
	SE: '瑞典',
	SG: '新加坡',
	SI: '斯洛文尼亚',
	SK: '斯洛伐克',
	SL: '塞拉利昂',
	SM: '圣马力诺',
	SN: '塞内加尔',
	SO: '索马里',
	SR: '苏里南',
	ST: '圣多美和普林西比',
	SV: '萨尔瓦多',
	SY: '叙利亚',
	SZ: '斯威士兰',
	TD: '乍得',
	TG: '多哥',
	TH: '泰国',
	TJ: '塔吉克斯坦',
	TM: '土库曼斯坦',
	TN: '突尼斯',
	TO: '汤加',
	TR: '土耳其',
	TT: '特立尼达和多巴哥',
	TW: '台湾省',
	TZ: '坦桑尼亚',
	UA: '乌克兰',
	UG: '乌干达',
	US: '美国',
	UY: '乌拉圭',
	UZ: '乌兹别克斯坦',
	VC: '圣文森特岛',
	VE: '委内瑞拉',
	VN: '越南',
	YE: '也门',
	YU: '南斯拉夫',
	ZA: '南非',
	ZM: '赞比亚',
	ZR: '扎伊尔',
	ZW: '津巴布韦',
	CN: '中国'
};

// 加载运送地区图片
const DestPath = '/resources/flagicons/flags/';
const DestType = ['1x1/', '4x3/'];
const DestNames = shippingList.map(x => x.toLowerCase() + '.svg');
var DestList = {};
(async () => {
	let DestListDB = 'DestList';
	DestList = (await localforage.getItem(DestListDB)) || {};
	for (let x of shippingList) {
		if (DestList[x]) continue;
		let destUrl = `${DestPath}${DestType[1]}${x.toLowerCase()}.svg`;
		let response = await fetch(destUrl);
		if (!response.ok) return console.log("FailLoad:", [destUrl]);
		DestList[x] = await response.blob();
		localforage.setItem(DestListDB, DestList);
	}
})();

// 显示或隐藏国家选择列表
document.getElementById('selectCY').addEventListener('click', (e) => {
	var countryBtn = document.querySelector('.cypanel');
	if (countryBtn.style.display == 'flex') {
		countryBtn.style.display = 'none';
	} else {
		countryBtn.style.display = 'flex';
	}
});
// 填充运送地区列表
(async () => {
	let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	const shipTable = document.querySelector('.cylist');
	let sortedList = [];
	// 查询运送地区名称表
	shippingList.forEach((country) => {
		sortedList.push([countryListEN[country], country]);
	});
	// 对运送地区按名称升序排序
	sortedList.sort();
	// 设置图标
	let setIcon = async (nodeId) => {
		let imageBlob = DestList[nodeId];
		while (!imageBlob) {
			await sleep(100);
			imageBlob = DestList[nodeId];
		}
		let iconNodes = document.querySelectorAll(`#${nodeId}`);
		while (iconNodes.length == 0) { await sleep(100); }
		iconNodes.forEach((x) => x.insertAdjacentHTML('afterbegin', `<img src="${URL.createObjectURL(imageBlob)}"/>`));
	}
	// 添加运送地区图标
	sortedList.forEach((region) => {
		let regionHtml = `<div id="${region[1]}" class="flag-icon">${region[0]}</div>`;
		shipTable.insertAdjacentHTML('beforeend', regionHtml);
		setIcon(region[1]);
	});
	// 将图标按每行4个进行断行
	for (spaceCountrys = shippingList.length % 4; spaceCountrys > 0 && spaceCountrys < 4; ++spaceCountrys) {
		let spaceItem = document.createElement('div');
		shipTable.appendChild(spaceItem);
		spaceItem.outerHTML = `<div class="flag-icon space"></div>`;
	}
	shipTable.addEventListener('click', async (e) => {
		let selectedCY = e.target;
		if (selectedCY.id == '') return;
		document.getElementById('selectCY').innerHTML = e.target.outerHTML;
		document.querySelector('.cypanel').style.display = 'none';
		await localforage.setItem('ShipTo', selectedCY.id);
	});
	let saveCY = await localforage.getItem('ShipTo');
	if (!saveCY) {
		const ipQuery = await fetch('https://www.cloudflare.com/cdn-cgi/trace').then(response => response.text());
		let ipMatchCY = ipQuery.match(/loc=([A-Z]*)/);
		let ipCY = ipMatchCY ? ipMatchCY[1] : '';
		if (shippingList.includes(ipCY)) await localforage.setItem('ShipTo', ipCY);
	} else {
		document.getElementById('selectCY').innerHTML = document.getElementById(saveCY).outerHTML;
	}
})();
