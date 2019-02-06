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

// Denne funktion køres efter on DeviceReady. Vi skal bruge denne funktion til
// at scanne efter vores beacon. Skal optimeres så den scanner i et interval
function scanCheckInd(){
  document.getElementById("statusMsgDiv").innerHTML = "";
  if (cordova.platformId === 'android') { // Android filtering is broken
    ble.scan([], 5, sendCheckInd, onError);
  }
  else {
  //alert("Disconnected");
  ble.scan([blue.serviceUUID], 5, sendCheckInd, onError);
  }
}

// Denne funktion benytter listen fra refreshDeviceList og giver besked når
// vore beacon er fundet. Skal sætte en timestamp funktion igang.
function sendCheckInd(device){

	if (device.id == 'EF:1E:94:22:B3:E8') {
    var url = "https://api.thingspeak.com/update?api_key=4IH5YM5BNORPHLI9&field1=1";
    var target = '_blank';
    var options = "location = no,hidden = yes"
    var ref = cordova.InAppBrowser.open(url, target, options);
    ref.close();
    document.getElementById("statusMsgDiv").innerHTML = "Check ind sendt";
  }
}

function scanCheckUd(){
      document.getElementById("statusMsgDiv").innerHTML = "";
  if (cordova.platformId === 'android') { // Android filtering is broken
    ble.scan([], 5, sendUdtjek, onError);
  }
  else {
  //alert("Disconnected");
  ble.scan([blue.serviceUUID], 5, sendUdtjek, onError);
  }
}

// Denne funktion benytter listen fra refreshDeviceList og giver besked når
// vore beacon er fundet. Skal sætte en timestamp funktion igang.
function sendUdtjek(device){
	if (device.id == 'EF:1E:94:22:B3:E8') {
    var url = "https://api.thingspeak.com/update?api_key=4IH5YM5BNORPHLI9&field1=0";
    var target = '_blank';
    var options = "location = no,hidden = yes"
    var ref = cordova.InAppBrowser.open(url, target, options);
    ref.close();
    document.getElementById("statusMsgDiv").innerHTML = "Check ud sendt";
	  }
}

// Denne funktion forbinder appen automatisk med vores blufruit, der
// kontrollerer bommen. Undersøg om den kan rykkes op til onLoad funktionen.
function conn(){
  ConnDeviceId = 'DE:4B:7D:E6:AD:65';
  ble.autoConnect(ConnDeviceId, onConnect, onError);
}

function onSend(){
  document.getElementById("statusMsgDiv").innerHTML = "";
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
	ble.writeWithoutResponse(ConnDeviceId, blue.serviceUUID, blue.txCharacteristic, data, onSend, onError);
  document.getElementById("statusMsgDiv").innerHTML = "Bom åbner";
}

// Denne funktion giver fejlbeskeder på skærmen.
function onError(reason)  {
	alert("ERROR: " + reason); // real apps should use notification.alert
}

function oversigt(){
  var url = "https://thingspeak.com/channels/696323/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15";
  var target = '_blank';
  var options = "location = no,hidden = yes"
  var ref = cordova.InAppBrowser.open(url, target, options);
}
