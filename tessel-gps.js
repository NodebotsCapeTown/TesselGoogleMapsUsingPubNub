

// SETUP REQUIRED MODULES
var tessel = require('tessel');
var wifi = require('wifi-cc3000');
var gpsLib = require('gps-a2235h');
var needle = require('needle');
gpsLib.debug = 0; // Switch this to 1 for debug logs, 2 for printing out raw nmea messages


// SETUP WIFI
// (N.B.) Command line setups will only persist till the Tessel is rebooted.
// This is only for testing within wifi range
var network = 'NETWORK_SSID'; 
var pass = 'NETWORK_PASSWORD'; 
var security = 'wpa2'; // Options are 'wep', 'wpa', or 'unsecured'


// SETUP GPRS
// Next on the list for some real world wandering.
// TBC


// SETUP GPS
// GPS uses software UART, which is only available on Port C.
// We use Port C because it is port most isolated from RF noise.
var gps = gpsLib.use(tessel.port['C']); 

// Attempts to connect Tessel to the wifi network
// Check if the wifi chip is busy (currently trying to connect), if not, try to connect
function tryConnect(){
  if (!wifi.isBusy()) 
  {
    if (!wifi.isConnected())
    {
      console.log("Attempting to connect to wifi ...");
      connect();
    } 
  } 
  else 
  {
    console.log("Wifi is busy ... sleeping & retrying in 5 seconds.");
    setTimeout(function(){
      if (! (wifi.isConnected() || wifi.isBusy()) )
      {
        "Attempting Wifi connect ..."
        tryConnect();
      }  
    }, 5000);
  } 
}

// Create the actual wifi connection.
function connect(){
  
  if ( ! ( wifi.isBusy() || wifi.isConnected() ) ) 
  {
    console.log('Connecting to Wifi ...');
    wifi.connect({
      security: security
      , ssid: network
      , password: pass
      , timeout: 30 // in seconds
    });
  }
  else
  {
    if ( wifi.isBusy() ){
      console.log("Wifi is busy, trying reconnect ...");
      tryConnect();
    }
    if ( wifi.isConnected() ){
      console.log("Wifi is already connected.");
    }
  }

}

// WIFI Connect listener.
wifi.on('connect', function(err, data){
  console.log("Wifi connect fired :", err, data);

});

// WIFI Disconnect listener.
wifi.on('disconnect', function(err, data){
  console.log("Wifi disconnect fired : ", err, data);
  tryConnect(); 
})

wifi.on('timeout', function(err){
  // tried to connect but couldn't, retry
  console.log("timeout emitted"); 
  tryConnect();
});

// WIFI timeout listener.
wifi.on('error', function(err){
  // one of the following happened
  // 1. tried to disconnect while not connected
  // 2. tried to disconnect while in the middle of trying to connect
  // 3. tried to initialize a connection without first waiting for a timeout or a disconnect
  console.log("Wifi error fired : ", err);
  console.log('Resetting Wifi.');

  // Attempt reset, backoff and then reconnect after 10s. 
  wifi.reset();    
  setTimeout(function(){
    if (! (wifi.isConnected() || wifi.isBusy()) )
    {
      tryConnect();
    }  
  }, 10000);

});

// Trigger the initla Wifi connection attempt.
connect();

// Wait until the module is connected
gps.on('ready', function () {
  console.log('GPS module powered and ready. Waiting for satellites...');

  // Emit coordinates when we get a coordinate fix
  gps.on('coordinates', function (coords) {
    console.log('Lat:', coords.lat, '\tLon:', coords.lon, '\tTimestamp:', coords.timestamp);
    var data = coords.lat+','+coords.lon;
    if (wifi.isConnected()){
        console.log('Connected to net sending data:' + data);
        needle.request(
          'post', 
          'http://pubsub.pubnub.com/publish/[PUB KEY]/[SUB KEY]/signature/my_channel/0/', // see: http://www.pubnub.com/http-rest-push-api/
          {text:data},
          {json:true}, 
          function(err, resp) {
              if (!err){
                console.log('Pubnub response: ' + resp.body)
              }else{
                  console.log('Pubnub error: ' + err)
                };
            }
        );
    }      

  });


  // Emitted when we have information about a fix on satellites
  gps.on('fix', function (data) {
    console.log(data.numSat, 'fixed.');
  });

  gps.on('dropped', function(){
    // we dropped the gps signal
    console.log("gps signal dropped");
  });
});

gps.on('error', function(err){
  console.log("got this error", err);
});
