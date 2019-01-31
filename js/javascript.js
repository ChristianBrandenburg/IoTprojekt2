var device_id = "DE:4B:7D:E6:AD:65";
ble.autoConnect(device_id, connectCallback, disconnectCallback);

function checkInd() {
  messageInput.value = "Tjek ind";
}

function checkUd() {
  messageInput.value = "Tjek ud";
}

function sendData() { // send data to Arduino
	var data = stringToBytes(messageInput.value);
	ble.writeWithoutResponse(ConnDeviceId, blue.serviceUUID, blue.txCharacteristic, data, onSend, onError);
}
