/**
 Copyright (c) 2009, FINN.no
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
 * Neither the name of the FINN.no nor the names of its contributors may be
   used to endorse or promote products derived from this software without
   specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

 */

/*

 === TomTom ===
 http://www.tomtom.com/lib/doc/TomTomTips/index.html?publishing_geo_references.htm

 === Garmin ===
 http://developer.garmin.com/web-device/garmin-communicator-plugin/get-your-site-key/

 */

(function() {

    if (typeof Send2Gps != "undefined") return;
    window.Send2Gps = function(options) {
        if ( !(this instanceof Send2Gps) ) {
            throw new Error("Wrong usage of Send2Gps' prototype. Use the 'new' operator to create a new instance of Send2Gps.");
        }
        if (!options) options = {};

        if (options.keys) {
            for (var brand in options.keys) {
                if (this.brands[brand])
                    this.brands[brand].key = options.keys[brand];
            }
        }

        this.lang = options.lang || 'en';
    };

    Send2Gps.prototype.setParams = function(url, params) {
        for (var key in params) {(function() {
            url = url.replace("{" + key + "}", params[key]);
        })();}
        return url;
    },

    Send2Gps.prototype.formatUrl = function(url) {
        return encodeURI(url.replace(/\{[\w\d-]+\}/g, ""));
    };

    Send2Gps.prototype.poi = function(brand, point) {
        if (!this.brands[brand] || !this.brands[brand].poi) {
            throw new Error("The brand '"+brand+"' does not exist");
        };
        if(!point || !point.lon || !point.lat) {
            throw new Error("point requires lon and lat properties");
        }

        var url = this.brands[brand].poi;
        if(this.brands[brand].key) {
            url = url.replace("{key}", this.brands[brand].key);
        }
        url = url.replace("{lang}", this.lang);
        
        url = this.setParams(url, point);

        return this.formatUrl(url);
    };

    Send2Gps.prototype.getPoiSpec = function(brand) {
        return this.brands[brand].poi.match(/{[\w\d]+}/g).join(", ").replace(/[{}]/g, "");
    };


    Send2Gps.prototype.brands = {
        tomtom: {
            key: null,
            poi: "http://addto.tomtom.com/api/home/v2/georeference?action=add&apikey={key}&name={name}&latitude={lat}&longitude={lon}&source={source}"
        },
        garmin: {
            key: null,
            poi: "http://my.garmin.com/locate/savePOI.htm?action=redirect&a_key={key}&name={name}&hl={lang}&lat={lat}&long={lon}&attribution={attribution}&province={province}&country={countryCode2}&city={city}&street={street}&streetnum={streetnum}&postcode={postcode}&phone={phone}&source={source}"
        },
        mio_navman: {
            key: null,
            poi: "http://sendto.mio.com/stdr/?action=redirect&a_key={key}&name={name}&hl={lang}&lat={lat}&long={lon}&attribution={attribution}&province={province}&country={countryCode2}&city={city}&street={street}&streetnum={streetnum}&postalcode={postcode}&phone={phone}&source_url={source}&notes={notes}"
        },
        navigon: {
            // source without http://
            // country USA
            key: null, // Company name
            poi: "http://www.navigon.com/site/us/en/maps_services/web2pnd/transfer?cmd=favorite&street={street}&zipcode={postcode}&streetnumber={streetnum}&url={source}&poiname={name}&city={city}&country={countryCode3}&geocoordinates={lon};{lat}&company={key}",
            filter: function(params) {
                if(!params) return;
                if(typeof params.source == "string") params.source.replace("http://", "");
            }
        }
    };

})();