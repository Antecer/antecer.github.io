let usb = (function () {
	enum CommandCodeEnum {
		GetCID = 0x1D,
		GetUID,
		GetDeviceType = 0x20,
		SetDeviceType,
		GetCfgAll = 0x80,
		GetKeyMatrix,
		GetKeyLayer,
		GetKeyLayerAll,
		GetKeyScript,
		GetLedMatrix,
		GetLedScript,
		GetCfgSYS,
		SetCfgAll = 0x90,
		SetKeyMatrix,
		SetKeyLayer,
		SetKeyLayerAll,
		SetKeyScript,
		SetLedMatrix,
		SetLedScript,
		SetCfgSYS,
		GoToBoot = 0xB1,
		GoToUser,
		CodeBoot,
		CodeUser,
		DebugGetPressedKeys = 0xD0,
		DebugGetPressedKey,
		SetDebug = 0xDB
	}
	let Sleep = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));
	let U16ArrToString = (arr: Uint16Array) => String.fromCharCode.apply(null, Array.from(arr.filter(x => x !== 0)));
	let StringToU16Arr = (str: String) => Uint16Array.from(str, s => s.charCodeAt(0));
	let BufferToHexStr = (buf: ArrayBuffer) => Array.prototype.map.call(new Uint8Array(buf), (x) => ('00' + x.toString(16)).slice(-2));
	let getDeviceList = async () => { deviceList = await navigator.usb.getDevices(); console.log(`已配对的设备:`, deviceList); };

	let serialNumber = 'AntDeviceWithWebUSB';
	let deviceList: USBDevice[] = [];
	interface UsbDevice {
		device: USBDevice;
		isBoot: boolean;
		endpointIn: USBEndpoint;
		endpointOut: USBEndpoint;
		cid: string;
		uid: string;
	}
	let selectedDevice: UsbDevice | undefined;

	let Send = async (u8Array: Uint8Array) => {
		if (!selectedDevice?.device.opened) {
			console.log(`No device connected!`);
			return false;
		}
		let epNumber = selectedDevice.endpointOut.endpointNumber;
		let result = await selectedDevice.device.transferOut(epNumber, u8Array);
		switch (result.status) {
			case 'ok':
				break;
			case 'stall':
				console.warn(`Stall: WebUSB Ep${epNumber} transferOut stall!`, u8Array);
				selectedDevice.device.clearHalt(selectedDevice.endpointOut.direction, epNumber);
				return false;
			default:
				console.error(`Error: WebUSB Ep${epNumber} transferOut error!`, u8Array);
				return false;
		}
		return true;
	}
	let Read = async (byteCount?: number) => {
		if (!selectedDevice?.device.opened) {
			console.log(`No device connected!`);
			return (new Uint8Array(0));
		}
		let epNumber = selectedDevice.endpointIn.endpointNumber;
		let result = await selectedDevice.device.transferIn(epNumber, byteCount || 1024);
		switch (result.status) {
			case 'ok':
				return (new Uint8Array(result.data!.buffer));
			case 'stall':
				console.log(`Stall: WebUSB Ep${epNumber} transferIn stall!`);
				selectedDevice.device.clearHalt(selectedDevice.endpointIn.direction, epNumber)
				break;
			case 'babble':
				console.log(`Babble: WebUSB Ep${epNumber} transferIn with more data than was expected.`);
				break;
			default:
				console.log(`Error: WebUSB Ep${epNumber} transferIn error!`);
				break;
		}
		return (new Uint8Array(0));
	}


	class AntDevice {
		public constructor() {
			(async () => {
				await getDeviceList();
				this.Connect();
			})();
			navigator.usb.onconnect = (event) => {
				if ((!selectedDevice) && (event.device.serialNumber == serialNumber)) {
					console.log('Device Onconnect:', event.device);
					this.Connect(event.device);
					getDeviceList();
				}
			};
			navigator.usb.ondisconnect = (event) => {
				if (selectedDevice?.device.opened === false) {
					console.log('Device Disconnect:', event.device);
					selectedDevice = undefined;
					getDeviceList();
				}
			};
		}
		async Connect(dev?: USBDevice) {
			if (deviceList.length) { dev ||= deviceList[0]; }
			if (!dev) { return console.log(`No device connected!`); }
			console.log(`已连接的设备:`, dev);
			// 连接设备
			await dev.open();
			// 选择配置
			let configuration = dev.configurations[0];
			await dev.selectConfiguration(configuration.configurationValue);
			// 打开端点(WinUSB端点)
			let selectedIfn = configuration.interfaces.find(ifn => ifn.alternate.interfaceProtocol == 255);
			if (!selectedIfn) { return console.log(`Target interface not found!`); }
			await dev.claimInterface(selectedIfn.interfaceNumber);
			// 读取设备属性
			selectedDevice = {
				device: dev,
				isBoot: configuration.interfaces.length < 3,
				endpointIn: selectedIfn.alternate.endpoints.find(ep => ep.direction == 'in')!,
				endpointOut: selectedIfn.alternate.endpoints.find(ep => ep.direction == 'out')!,
				uid: '',
				cid: '',
			}
			selectedDevice.cid = BufferToHexStr((await this.Get(CommandCodeEnum.GetCID)).buffer).reverse().join('').toUpperCase();
			selectedDevice.uid = BufferToHexStr((await this.Get(CommandCodeEnum.GetUID)).buffer).reverse().join('').toUpperCase();
			console.log(`DeviceMode:`, selectedDevice.isBoot ? 'BootLoader' : 'Application');
		}
		async Request(filterList?: USBDeviceFilter[]) {
			filterList ||= [{ serialNumber: serialNumber }];
			let dev = await navigator.usb.requestDevice({ filters: filterList });
			this.Connect(dev);
		}
		get devices() { return deviceList; }
		get device() { return selectedDevice?.device; }
		get isBoot() { return selectedDevice?.isBoot; }
		get cid() { return selectedDevice?.cid; }
		get uid() { return selectedDevice?.uid; }
		get opened() { return selectedDevice?.device.opened; }
		get productId() { return selectedDevice && ('0x' + ('0000' + selectedDevice.device.productId.toString(16).toUpperCase()).slice(-4)); }
		get vendorId() { return selectedDevice && ('0x' + ('0000' + selectedDevice.device.vendorId.toString(16).toUpperCase()).slice(-4)); }
		get productName() { return selectedDevice?.device.productName; }
		get vendorName() { return selectedDevice?.device.manufacturerName; }
		async Set(code: number, page?: number, size?: number, buffer?: ArrayBuffer) {
			if (!(code in CommandCodeEnum)) {
				console.log(`Command code is undefind!`);
				return false;
			}
			buffer ||= new ArrayBuffer(0);
			page ||= (buffer.byteLength / 0x10000);
			size ||= buffer.byteLength;
			let u8Array = new Uint8Array(4 + size);
			u8Array[0] = code;
			u8Array[1] = page;
			u8Array[2] = size & 0xFF;
			u8Array[3] = size >> 8;
			u8Array.set(new Uint8Array(buffer), 4);
			return await Send(u8Array);
		}
		async Get(code: number, page?: number, size?: number) {
			if (!(code in CommandCodeEnum)) {
				console.log(`Command code is undefind!`);
				return new Uint8Array(0);
			}
			page ||= 0x00;
			size ||= 0x0000;
			if (!(await Send(new Uint8Array([code, page, size & 0xFF, size >> 8])))) return (new Uint8Array(0));
			let result = await Read((page * 65536) + size);
			return result;
		}
		async setProductType(str: String) {
			let strbuf = StringToU16Arr(str).slice(0, 128);
			return await this.Set(CommandCodeEnum.SetDeviceType, 0, 256, strbuf.buffer);
		}
		async getProductType() {
			let result = await this.Get(CommandCodeEnum.GetDeviceType, 0, 256);
			return U16ArrToString(new Uint16Array(result.buffer));
		}
		async getCfgAll() {
			let result = await this.Get(CommandCodeEnum.GetCfgAll, 3, 0);
			return result;
		}
		async setCfgAll() {
			var testU32Array = new Uint32Array(192 * 256);
			for (let i = 0; i < testU32Array.length; ++i) {
				testU32Array[i] = (i * 65536) + i;
			}
			let result = await this.Set(CommandCodeEnum.SetCfgAll, undefined, undefined, testU32Array.buffer);
			return result;
		}

		async setKeyMatrix(u16Arry: Uint16Array) {
			return await this.Set(CommandCodeEnum.SetKeyMatrix, undefined, undefined, u16Arry.buffer);
		}
		async getKeyMatrix() {
			let result = await this.Get(CommandCodeEnum.GetKeyMatrix, 0, 256);
			let keyMatrix: number[][] = [];
			(new Uint16Array(result.buffer)).forEach(m => {
				keyMatrix.push([m & 0xFF, m >> 8]);
			});
			return keyMatrix;
		}

		async debugGetPressedKeys(timeout: number) {
			if (!(await this.Set(CommandCodeEnum.DebugGetPressedKeys))) return;
			for (timeout || 50; timeout--; await Sleep(100)) {
				let result = await Read();
				if (result.length == 0) continue;
				return Array.from(new Uint16Array(result.buffer));
			}
			console.log(`No Keys Pressed in 5s!`);
		}
		async debugGetPressedKey(timeout: number) {
			if (!(await this.Set(CommandCodeEnum.DebugGetPressedKey))) return;
			for (timeout || 50; timeout--; await Sleep(100)) {
				let result = await Read();
				if (result.length == 0) continue;
				return result[0];
			}
			console.log(`No Key Pressed in 5s!`);
		}

		async setKeyLayer(fnLayer: number, u16Array?: Uint16Array) {
			fnLayer &= 0xF;
			u16Array ||= new Uint16Array(128);
			// u16Array[7] ||= 0x4007; // 测试值ESC按钮
			let result = await this.Set(CommandCodeEnum.SetKeyLayer, fnLayer, 256, u16Array.buffer);
			return result;
		}

		async setCodeOfUser() {
			let fileHandle;
			[fileHandle] = await window.showOpenFilePicker({
				types: [{ description: "Firmware", accept: { "firmware/*": [".bin", ".hex"] } }],
				excludeAcceptAllOption: true,
				multiple: false,
			});
			if (!fileHandle) return; // 用户取消了文件选择
			console.log(`Selected File:`, fileHandle.name);
			let file = await fileHandle.getFile();
			if (file.name.toLowerCase().endsWith('.bin')) {
				let fileContent = await file.arrayBuffer();
				if (fileContent.byteLength > 1024 * 32) { return console.log(`Firmware is too large!`); }
				await this.Set(CommandCodeEnum.CodeUser, undefined, undefined, fileContent);
			} else {
				console.log('hex文件支持暂未做');
			}
		}
		async jumpToBoot() {
			this.Set(CommandCodeEnum.GoToBoot);
		}
		async jumpToUser() {
			this.Set(CommandCodeEnum.GoToUser);
		}
	}

	return new AntDevice();
})();