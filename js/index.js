// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}
var blue ={
	serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
}

var ConnDeviceId;
var deviceList =[];

function onLoad(){
  ble.scan([], 5, conn, onError);
}

function conn(){
	document.getElementById("debugDiv").innerHTML =""; // empty debugDiv
	ConnDeviceId = 'DE:4B:7D:E6:AD:65';
	document.getElementById("debugDiv").innerHTML += "<br>"+ConnDeviceId+"<br>"; //for debug:
	ble.connect(ConnDeviceId, onConnect, onConnError);
}

function connTest(){
  ble.scan([], 5, conn, onError);
  if (device.name == 'BEACON1' {
	  document.getElementById("newContent").innerHTML = "Beacon er her!!! <br> BEACON1 <br>";
  }
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

 function onData(data){ // data received from Arduino
	document.getElementById("receiveDiv").innerHTML =  "Received: " + bytesToString(data) + "<br/>";
}

function data(txt){
	messageInput.value = txt;
}

function sendData() { // send data to Arduino
	var data = stringToBytes('1');
	ble.writeWithoutResponse(ConnDeviceId, blue.serviceUUID, blue.txCharacteristic, data, onSend, onError);
}

function onSend(){
	document.getElementById("sendDiv").innerHTML = "Registreret: " + "<br/>";
}

function disconnect() {
	ble.disconnect(deviceId, onDisconnect, onError);
}

function onDisconnect(){
	document.getElementById("statusDiv").innerHTML = "Status: Disconnected";
}
function onError(reason)  {
	alert("ERROR: " + reason); // real apps should use notification.alert
}
