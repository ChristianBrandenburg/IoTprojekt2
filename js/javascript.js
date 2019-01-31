function conn() {
var ConnDeviceId = "DE:4B:7D:E6:AD:65";
ble.connect(ConnDeviceId, connectCallback, disconnectCallback);
}

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

//succes
function onConnect(){
 document.getElementById("statusDiv").innerHTML = " Status: Connected";
 document.getElementById("bleId").innerHTML = ConnDeviceId;
 ble.startNotification(ConnDeviceId, blue.serviceUUID, blue.rxCharacteristic, onData, onError);
}

//failure
function onConnError(){
 alert("Problem connecting");
 document.getElementById("statusDiv").innerHTML = " Status: Disonnected";
}

function onDisconnect(){
	document.getElementById("statusDiv").innerHTML = "Status: Disconnected";
}

/* ÆNDRINGER!! -->

		var listItem = document.createElement('li'),
		html = device.name+ "," + device.id;
		if (device.name === 'KasperNis') {
			listItem.innerHTML = html;
			document.getElementById("bleDeviceList").appendChild(listItem);)
*/
