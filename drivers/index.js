(() => {
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	(async () => {
		while (true) {
			if (document.querySelector('.downpanel>input')) break;
			await sleep(1000);
		}

		document.querySelector('.downpanel>input').addEventListener('click', async () => {
			try {
				let verResponse = await fetch('/drivers/app/AppVerList.md');
				let txt = await verResponse.text();
				let versions = txt.split('\n');
				console.log('AppVerList:', versions);
				let lastVer = versions.length > 0 ? versions[0] : '0.0.0.0';
				if (lastVer == '0.0.0.0') {
					console.log('Download Failed!');
					return;
				}

				let appResponse = await fetch(`/drivers/app/app_${lastVer}`, { responseType: 'blob' });
				let blob = await appResponse.blob();
				let reader = new FileReader();
				reader.onload = function () {
					let appBlob = new Blob([this.result], { type: 'application/vnd.microsoft.portable-executable' });
					let link = document.createElement('a');
					link.download = 'AmusingDeviceApplication.exe';
					link.href = window.URL.createObjectURL(appBlob);
					document.body.appendChild(link);
					link.click();
					window.URL.revokeObjectURL(link.href);
					document.body.removeChild(link);
				};
				reader.readAsArrayBuffer(blob);
			} catch (err) {
				console.error(err);
			}
		});
	})();
})();
