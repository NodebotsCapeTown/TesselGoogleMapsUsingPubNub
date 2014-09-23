# Using Tessel GPS with PubNub & Google Maps
[](/tessel-gps-maps.jpg)


This guide provides a kickstart to using the [Tessel](http://tessel.io) GPS board to send live co-ordinates via [PubNub](http://www.pubnub.com/) to a web page which in tern maps the location using [Google Maps](https://developers.google.com/maps/documentation/javascript/).



## Requirements
- - -
Below is a list or prerequisites for the project, the only hardware required is the Tessel with a GPS Module.

* A [Tessel](http://tessel.io) with a [GPS Module](http://start.tessel.io/modules/gps)

* [Node JS](http://nodejs.org/download/) installed with the following modules:
    * Wifi Module (tessel/wifi-cc3000)
    * GPS Module (tessel/gps-a2235h)
    * Needle (tomas/needle) - Nimble, streamable HTTP client for Node.js. With proxy, iconv, deflate & multipart support
<br><br>
* A sandbox (Free) [PubNub Account](http://www.pubnub.com/) 
* HTML file with [JQuery via cdn](https://code.jquery.com/) and [Google Maps API V3 via cnd](https://developers.google.com/maps/documentation/javascript/tutorial) for Javascript (of course you can host them if you want.)