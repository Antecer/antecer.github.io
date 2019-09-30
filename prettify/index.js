document.querySelector('select[name="cutOptions"]').addEventListener('change', e => {
	let cutSelected = document.querySelector('select[name="cutOptions"]').value;
	document.querySelectorAll('.cutImg').forEach(cuter => {
		if (cuter.id == cutSelected) {
			cuter.classList.remove('hide');
		} else {
			cuter.classList.add('hide');
		}
	});
});