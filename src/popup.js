/* global qrcode */

document.addEventListener(`DOMContentLoaded`, function () {
	var qr_cellsize = 8;
	var qr_margin = 2 * qr_cellsize;
	var qr_levels = [`M`, `L`];

	var createImage = function(payload) {
		for (var levelIndex in qr_levels) {
			for (var typeNum = 1; typeNum <= 10; typeNum++) {
				try {
					var qr = qrcode(typeNum, qr_levels[levelIndex]);
					qr.addData(payload);
					qr.make();
					return qr.createImgTag(qr_cellsize, qr_margin);
				} catch(e) {
					if (strStartsWith(e.message, `code length overflow`)) {
						// ignore
					} else {
						throw e;
					}
				}
			}
		}
	};

	var displayImage = function() {
		var payload = document.getElementById(`textbox`).value;
		document.getElementById(`insert-qrcode-here`).innerHTML =
		createImage(payload) || `Error. Text too long?`;
	};

	var strStartsWith = function(string, prefix) {
		return !string.indexOf(prefix);
	};

	var textbox = document.getElementById(`textbox`);

	textbox.onchange = displayImage;
	textbox.onkeyup = displayImage;

	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		textbox.value = tabs[0].url;
		displayImage();
	});
});
