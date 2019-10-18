import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { v4 } from 'uuid';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geofence } from '@ionic-native/geofence/ngx';
import * as leaflet from "leaflet";

declare var AdvancedGeolocation: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('map', {static: true}) mapElement: ElementRef;
  map: any;
  currentLat: any;
  currentLng: any;

    // C.C. Hayuelos Lat: 4.663760 Long: -74.130421
    center = {
        lat: 4.663760,
        lng: -74.130421,
    };

  constructor(public navCtrl: NavController,
              public platform: Platform,
              private geolocation: Geolocation,
              private geofence: Geofence) {

    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    /*this.geolocation.getCurrentPosition(options).then((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });*/

  }

  ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.loadMap();
        this.createGeofence();
        let options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        const watch = this.geolocation.watchPosition(options
        );
        watch.subscribe((position) => {
          const positionEmpty = Object.keys(position).length < 1;
          if (!positionEmpty) {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
          }
        });
      } else { // Solo para pruebas en el navegador
        this.loadMap();
        this.createGeofence();
      }
    });

  }

  loadMap() {
    this.map = leaflet.map("map").fitWorld();
    setTimeout(() => {
      this.map.invalidateSize();
    }, 400);
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'www.tphangout.com',
        maxZoom: 18
    }).addTo(this.map);
    this.platform.ready().then(() => {
        if (this.platform.is('android') && !this.platform.is('mobileweb')) {
            AdvancedGeolocation.start((position) => {
              try {
                var jsonObject = JSON.parse(position);
                switch (jsonObject.provider) {
                  case "gps":
                    this.currentLat = jsonObject.latitude;
                    this.currentLng = jsonObject.longitude;
                    break;

                  case "network":
                    this.currentLat = jsonObject.latitude;
                    this.currentLng = jsonObject.longitude;
                    break;

                  case "satellite":
                    //TODO
                    break;

                  case "cell_info":
                    //TODO
                    break;

                  case "cell_location":
                    //TODO
                    break;

                  case "signal_strength":
                    //TODO
                    break;
                }
                this.map.setView([this.currentLat, this.currentLng], 16);
		    	let markerGroup = leaflet.featureGroup();
		    	let marker: any = leaflet.marker([this.currentLat, this.currentLng]);
		    	marker.bindPopup("<b>I'm here!</b><br>").openPopup();
		    	markerGroup.addLayer(marker);
		    	this.map.addLayer(markerGroup);
		    	var circle = leaflet.circle([this.currentLat, this.currentLng], {
		    	    color: 'Green',
				    fillColor: '#81C784',
				    fillOpacity: 0.5,
				    radius: 200
		    	}).addTo(this.map);
		    	circle.bindPopup("My area.");

              } catch (exc) {
                console.log("Error: " + exc);
                alert('Sorry looks like there is an error and cannot detect your current location on your Android device!');
              }
            },
            function (error) {
                console.log("ERROR! " + JSON.stringify(error));
            },
            {
                "minTime": 500,         // Min time interval between updates (ms)
                "minDistance": 100,     // Min distance between updates (meters)
                "noWarn": true,         // Native location provider warnings
                "providers": "all",     // Return GPS, NETWORK and CELL locations
                "useCache": true,       // Return GPS and NETWORK cached locations
                "satelliteData": false, // Return of GPS satellite info
                "buffer": false,        // Buffer location data
                "bufferSize": 0,        // Max elements in buffer
                "signalStrength": false // Return cell signal strength data
            });
    	} else {
			 this.map.locate({
			   setView: true,
			   maxZoom: 18
			 }).on('locationfound', (e) => {
			   this.map.setView([e.latitude, e.longitude], 16);
			   let markerGroup = leaflet.featureGroup();
			   let marker: any = leaflet.marker([e.latitude, e.longitude]);
			   marker.bindPopup("<b>I'm here!</b><br>").openPopup();
			   markerGroup.addLayer(marker);
			   this.map.addLayer(markerGroup);
			   var circle = leaflet.circle([e.latitude, e.longitude], {
			     color: 'Green',
	             fillColor: '#81C784',
		         fillOpacity: 0.5,
		         radius: 200
			    }).addTo(this.map);
			    circle.bindPopup("My area.");
			  }).on('locationerror', (err) => {
			    alert(err.message);
			  });
    	}
    });
  }

  private createGeofence() {
    let fence = {
      id: v4(), //any unique ID
      latitude: this.center.lat, //center of geofence radius
      longitude: this.center.lng,
      radius: 1000, //radius to edge of geofence in meters
      transitionType: 2,
      notification: {
        id: 1,
        title: 'You crossed a sight',
        text: 'You just arrived',
        vibrate: [2000],
        openAppOnClick: true
      }
    };
    this.geofence
      .addOrUpdate(fence)
      .then(
        () => console.log('Geofence added'),
        (err) => console.log('Geofence failed to add', err)
      );
    this.geofence
      .onTransitionReceived()
      .subscribe(resp => {
        resp.forEach(function (geo) {
          console.log("Geofence transition detected", geo);
        });
        console.log("geofence on transition recieved", resp);
        alert(JSON.stringify(resp));
      });
  }

}
