//  Kun ASCII. Denne funktion bruger i kommunikation med bommen. Ændrer vores
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

// Denne funktion køres når man trykker på "Check Ind". Scanner efter enheder
function scanCheckInd(){
  document.getElementById("statusMsgDiv").innerHTML = "";
  if (cordova.platformId === 'android') { // Android filtering is broken
    ble.scan([], 5, sendCheckInd, onError);
  }
  else {
  ble.scan([blue.serviceUUID], 5, sendCheckInd, onError);
  }
}

var inAppBrowserRef;

// Denne funktion køres efter scanCheckInd. Laver et reqest, hvis det korrekte
// device id er fundet
function sendCheckInd(device){

	if (device.id == 'EF:1E:94:22:B3:E8') {
    var url = "https://api.thingspeak.com/update?api_key=4IH5YM5BNORPHLI9&field1=1";
    var target = '_blank';
    var options = "location = no,hidden = yes"
    inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);
    inAppBrowserRef.addEventListener('loadstop', close);
  }
}

// Denne funktion køres når man trykker på "Check Ind". Scanner efter enheder
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

// Denne funktion køres efter scanCheckUd. Laver et reqest, hvis det korrekte
// device id er fundet
function sendUdtjek(device){
	if (device.id == 'EF:1E:94:22:B3:E8') {
    var url = "https://api.thingspeak.com/update?api_key=4IH5YM5BNORPHLI9&field1=0";
    var target = '_blank';
    var options = 'hidden = yes'
    inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);
    inAppBrowserRef.addEventListener('loadstop', close);
	  }
}

function close(){
  document.getElementById("statusMsgDiv").innerHTML = "Check ind/ud sendt";
  inAppBrowserRef.close();
}

// Denne funktion køres når man trykker på "Åben bom". Forbinder til bommens
// bluetooth. Autoconnect er ikke nødvendigt, men vi har det for en sikkerheds
// skyld. Kalder enten onConnect hvis der er forbindelse eller onConnError
// hvis der ikke er
function conn(){
  var ConnDeviceId = 'DE:4B:7D:E6:AD:65';
  ble.autoConnect(ConnDeviceId, onConnect, onError);
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

// Denne funktion giver bommen besked om at den skal åbne. Sender "1" til
// til bommen. Når beskeden er sendt kalder den onSend, hvis fejl onError.
function sendData() {
	var data = stringToBytes('1');
	ble.writeWithoutResponse(ConnDeviceId, blue.serviceUUID, blue.txCharacteristic, data, onSend, onError);
  document.getElementById("statusMsgDiv").innerHTML = "Bom åbner";
}

// Hvis beskeden til bommen er sendt korrekt. Bliver status fjernet.
function onSend(){
  document.getElementById("statusMsgDiv").innerHTML = "";
}

// Denne funktion giver fejlbeskeder på skærmen.
function onError(reason)  {
	alert("ERROR: " + reason); // real apps should use notification.alert
}

// Denne funktion blliver kaldt når oversigts knappen trykkes.
// Linker til Thingspeak kanalen, som registerer arbejdstid.
function oversigt(){
  var url = "https://thingspeak.com/channels/696323/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15";
  var target = '_blank';
  var options = "location = no,hidden = yes"
  var ref = cordova.InAppBrowser.open(url, target, options);
}
