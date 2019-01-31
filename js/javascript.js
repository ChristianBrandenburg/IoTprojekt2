function conn() {
    var device_name = "RH";
    ble.connect(device_name, connectCallback, disconnectCallback);
}

function checkInd() {
  messageInput.value = "Mød ind";
}

function checkUd() {
  messageInput.value = "Mød ud";
}

function sendData() { // send data to Arduino
	var data = stringToBytes(messageInput.value);
	ble.writeWithoutResponse(ConnDeviceId, blue.serviceUUID, blue.txCharacteristic, data, onSend, onError);
}

/* ÆNDRINGER!! -->

		var listItem = document.createElement('li'),
		html = device.name+ "," + device.id;
		if (device.name === 'KasperNis') {
			listItem.innerHTML = html;
			document.getElementById("bleDeviceList").appendChild(listItem);)
*/
