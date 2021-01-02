(() => {
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	(async () => {
		while (true) {
			if (document.querySelector('.downpanel>input')) break;
			await sleep(1000);
		}

		document.querySelector('.downpanel>input').addEventListener('click', async () => {
			let lastVer = await fetch('/drivers/app/AppVerList.md')
				.then(res => res.text())
				.then(txt => {
					let versions = txt.split('\n');
					console.log('AppVerList:', versions);
					return versions.length > 0 ? versions[0] : '0.0.0.0';
				});
			if (lastVer != '0.0.0.0') {
				fetch(`/drivers/app/app_${lastVer}`, { responseType: 'blob' })
					.then((res) => res.blob())
					.then((blob) => {
						let link = document.createElement("a");
						link.download = 'AmusingDeviceApplication.exe';
						link.href = window.URL.createObjectURL(blob);
						document.body.appendChild(link); // Fix for firefox, the anchor has to be appended to the DOM.
						link.click();
						window.URL.revokeObjectURL(link.href);
						document.body.removeChild(link);
					});
			}
			else console.log('Download Failed!');
		});
	})();
})();