function downloadApp() {
	fetch('/drivers/app/AppVerList.txt')
		.then(res => res.text())
		.then(txt => {
			let versions = txt.split('\n');
			let lastVer = versions.length > 0 ? versions[0] : '0.0.0.0';
			console.log('LastAppVer:', lastVer)

			let downnode = document.createElement("a");
			downnode.download = 'AmusingDeviceApplication.exe';
			downnode.href = `/drivers/app/app_${lastVer}.exe`;
			downnode.click();
		})
}