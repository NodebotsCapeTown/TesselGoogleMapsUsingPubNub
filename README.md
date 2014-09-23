# Using Tessel GPS with PubNub & Google Maps
<center>![](/tessel-gps-maps.jpg)</center>


This guide provides a kickstart to using the [Tessel](http://tessel.io) board with GPS module to send live co-ordinates via [PubNub](http://www.pubnub.com/) to a web page which in-tern maps the location using [Google Maps](https://developers.google.com/maps/documentation/javascript/). I.E. buld your own telematics device.

>***N.B.*** We have kept this as simple as possible and used [PubNub](http://www.pubnub.com/) to provide Tessel -> Browser sync and a simple HTML file with JQuery for a UI. This is to keep the requirements for the tinkerer down and get you up and running quickly.  You can of course write your own NodeJS sync server (just be careful as Tessel currently has issues with sockets, rather use HTTP get/post via [Needle](https://github.com/tomas/needle) for the Tessel and sockets to the browser for push notification) that also delivers the UI for access from anywhere via desktop & mobile. We will eventually use [Iconicframework](http://ionicframework.com/) with [AngularJS](https://angularjs.org/) for native apps examples and probably [Bootstrap](http://getbootstrap.com/)/HTML for a responsive web based the UI.



## Requirements
Below is a list or prerequisites for the project, the only hardware required is the Tessel with a GPS Module.

* A [Tessel](http://tessel.io) with a [GPS Module](http://start.tessel.io/modules/gps)

* [Node JS](http://nodejs.org/download/) installed with the following modules:
    * Wifi Module (tessel/wifi-cc3000)
    * GPS Module (tessel/gps-a2235h)
    * Needle (tomas/needle) - Nimble, streamable HTTP client for Node.js. With proxy, iconv, deflate & multipart support
<br><br>
* A sandbox (Free) [PubNub Account](http://www.pubnub.com/) 
* HTML file with [JQuery via cdn](https://code.jquery.com/) and [Google Maps API V3 via cnd](https://developers.google.com/maps/documentation/javascript/tutorial) for Javascript (of course you can host them if you want.)