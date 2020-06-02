function downloadApp() {
	fetch('/drivers/app/AppVerList.md')
		.then(res => res.text())
		.then(txt => {
			let versions = txt.split('\n');
			console.log('AppVerList:', versions);
			let lastVer = versions.length > 0 ? versions[0] : '0.0.0.0';

			let downnode = document.createElement("a");
			downnode.download = 'AmusingDeviceApplication.exe';
			downnode.href = `/drivers/app/app_${lastVer}`;
			document.body.appendChild(downnode); // Fix for firefox, the anchor has to be appended to the DOM.
			downnode.click();
			document.body.removeChild(downnode);
		})
}