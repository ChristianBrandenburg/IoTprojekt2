// ASCII only. Denne funktion bruger i kommunikation med bommen. Ændrer vores
// "1" til bytes, så beskeden kan transmitteres.
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

// Variabler som bluetooth bruger til identificere kommunikation.
var blue ={
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
}

// Variabler der bruges til at identificere basestationen og lave en liste
// over resultatet af en scanning
var ConnDeviceId;
var deviceList =[];
var inRange;

// Denne funktion køres efter on DeviceReady. Vi skal bruge denne funktion til
// at scanne efter vores beacon. Skal optimeres så den scanner i et interval
function refreshDeviceList(){
  inRange = 0;
  document.getElementById("BEACON").innerHTML = "Scan";
  document.getElementById("bleDeviceList").innerHTML = ''; // empties the list
  if (cordova.platformId === 'android') { // Android filtering is broken
    ble.scan([], 5, onDiscoverDevice, onError);
  }
  else {
  //alert("Disconnected");
  ble.scan([blue.serviceUUID], 5, onDiscoverDevice, onError);
}
}

// Denne funktion benytter listen fra refreshDeviceList og giver besked når
// vore beacon er fundet. Skal sætte en timestamp funktion igang.
function onDiscoverDevice(device){

  var listItem = document.createElement('li'),
  html = device.name + "," + device.id;
  listItem.innerHTML = html;
  document.getElementById("bleDeviceList").appendChild(listItem);
	if (device.name == 'BEACON1') {
    inRange = 1;
	  document.getElementById("BEACON").innerHTML = "Beacon er her!!! <br> BEACON1 <br>";
	  }
  indTjek();
}

// Denne funktion forbinder appen automatisk med vores blufruit, der
// kontrollerer bommen. Undersøg om den kan rykkes op til onLoad funktionen.
function forbind(){
  ConnDeviceId = 'DE:4B:7D:E6:AD:65';
  ble.autoConnect(ConnDeviceId, onConnect, onError);
  document.getElementById("bleId").innerHTML = ConnDeviceId;
}

function onSend(){
	document.getElementById("debugDiv").innerHTML = "Sent: " + messageInput.value + "<br/>";
}

 // Denne funktion giver besked hvis der er forbundet til bommen.
function onConnect(){
	document.getElementById("statusDiv").innerHTML = " Status: Connected";
  sendData();
}

// Denne funktion giver besked hvis der ikke er forbundet til bommen.
function onConnError(){
	alert("Problem connecting");
	document.getElementById("statusDiv").innerHTML = " Status: Disonnected";
}

// Denne funktion giver bommen besked om at den skal åbne
function sendData() { // send data to Arduino
	var data = stringToBytes('1');
// https://github.com/don/cordova-plugin-ble-central#writewithoutresponse
	ble.writeWithoutResponse(ConnDeviceId, blue.serviceUUID, blue.txCharacteristic, data, onSend, onError);
  	document.getElementById("statusDiv").innerHTML = "Sender";
}

// Denne funktion giver fejlbeskeder på skærmen.
function onError(reason)  {
	alert("ERROR: " + reason); // real apps should use notification.alert
}

function indTjek() {
  if (inRange = 1) {
    var url = "http://api.thingspeak.com/update?api_key=QS1B4C4WUR75QAWZ&field1=50";
    var target = '_blank';
    var options = "location = no,hidden = yes"
    var ref = cordova.InAppBrowser.open(url, target, options);
    ref.close();
    document.getElementById("BEACON").innerHTML = "Afsendt";
  }
  else {
    document.getElementById("BEACON").innerHTML = "Beacon er uden for rækkevidde";
  }
}
