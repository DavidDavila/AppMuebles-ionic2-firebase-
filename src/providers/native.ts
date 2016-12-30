import { Injectable } from '@angular/core';
import { LocationAccuracy , Geolocation, Camera  } from 'ionic-native'; 
declare var cordova:any;
/*
  Generated class for the Product provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/ 
@Injectable()
export class NativeService {

	  doPhoto(){
	    
		return Camera.getPicture().then((imageData) => {
		 // imageData is either a base64 encoded string or a file URI
		 // If it's base64:
		 return imageData;
		}, (err) => {
		 // Handle error
		});
	  }
	getPersmisionToGeolocate(){
		var coordsF = LocationAccuracy.canRequest().then((canRequest: boolean) => {		
		    var coordsResquest =  LocationAccuracy.request(LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
		      () => {
		     
	      		var data = this.geolocation();
	      		return data.then(function(coords){	             		
	      			return coords;
	      		})
		      },
		      (error) =>{	
		      	return '';      	
		      }
		    );
		    return coordsResquest.then(function(coords){	
      			return coords;
      		})
		  
		});
		return coordsF.then(function(coords){
			return coords;
		})
	}
	geolocation(){
		var geo = Geolocation.getCurrentPosition().then((resp) => {
		 	return resp.coords.latitude+'|'+resp.coords.longitude;				
		}).catch((error) => {
		  console.log('Error getting location', error);
		});	
		return geo.then(function(coords){
			return coords
		})	
	}

}