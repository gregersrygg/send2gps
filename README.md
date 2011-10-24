A short example on how to use send2gps
----------------------------------------------

First you need to create a new instance of Send2Gps with your API-keys:
    var send2gps = new Send2Gps({
        source: "http://yoursite.com",
        lang: "en",
        keys: {
            tomtom:'yourtomtomapikey',
            garmin: 'yourgarminkey'
        }
    });

Then you can use the send2gps instance to get the url needed for a GPS-brand. Valid brands are only "tomtom" and "garmin" for now:
    var point = {
        name: "FINN.no",
        lon: 10.74386,
        lat: 59.91375
    };

    var tomtomUrl = send2gps.poi("tomtom", point);

    // now you can use the url to redirect or popup or whatever...
    window.open(tomtomUrl);


API-Keys
--------
TomTom: http://www.tomtom.com/lib/doc/TomTomTips/index.html?publishing_geo_references.htm
Garmin: http://developer.garmin.com/web-device/garmin-communicator-plugin/get-your-site-key/
