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
var inRange = 0;


// Funktion som kører så snart index.html er indlæst. addEventListener sætter
// næste funktion igang så snart der klikkes.
// se https://www.w3schools.com/jsref/met_document_addeventlistener.asp
function onLoad(){
	document.addEventListener('deviceready', onDeviceReady, false);
}

// Denne funktion køres efter onLoad funktionen.
function onDeviceReady(){
	refreshDeviceList();
}

// Denne funktion køres efter on DeviceReady. Vi skal bruge denne funktion til
// at scanne efter vores beacon. Skal optimeres så den scanner i et interval
function refreshDeviceList(){
		ble.scan([], 10, onDiscoverDevice, onError);
}

// Denne funktion benytter listen fra refreshDeviceList og giver besked når
// vore beacon er fundet. Skal sætte en timestamp funktion igang.
function onDiscoverDevice(device){
	if (device.name == 'BEACON1') {
    inRange = 1;
	  document.getElementById("BEACON").innerHTML = "Beacon er her!!! <br> BEACON1 <br>";
	  }
  else {
    refreshDeviceList();
    document.getElementById("BEACON").innerHTML = "Beacon er ikke her!!! <br> BEACON1 <br>";
  }
}

// Denne funktion forbinder appen automatisk med vores blufruit, der
// kontrollerer bommen. Undersøg om den kan rykkes op til onLoad funktionen.
function connect(){
  ConnDeviceId = 'DE:4B:7D:E6:AD:65';
  ble.autoConnect(ConnDeviceId, onConnect, onError);
  sendData();
}

 // Denne funktion giver besked hvis der er forbundet til bommen.
function onConnect(){
	document.getElementById("statusDiv").innerHTML = " Status: Connected";
// https://github.com/don/cordova-plugin-ble-central#startnotification
	ble.startNotification(ConnDeviceId, blue.serviceUUID, blue.rxCharacteristic, onData, onError);
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
}

// Denne funktion giver fejlbeskeder på skærmen.
function onError(reason)  {
	alert("ERROR: " + reason); // real apps should use notification.alert
}

function indTjek() {
  if (inRange == 1) {
    var url = "http://api.thingspeak.com/update?api_key=QS1B4C4WUR75QAWZ&field1=50";
    var target = '_blank';
    var options = "location = no,hidden = yes"
    var ref = cordova.InAppBrowser.open(url, target, options);
    ref.close();
  }
  else {
    document.getElementById("BEACON").innerHTML = "Uden for rækkevidde <br> BEACON1 <br>";
  }
}
