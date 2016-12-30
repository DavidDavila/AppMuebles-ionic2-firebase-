import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Http} from '@angular/http';
import {  Push,  PushToken } from '@ionic/cloud-angular';
declare var cordova:any;
/*
  Generated class for the Product provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/ 
@Injectable()
export class PushService { 
	public token:any;
	constructor( public push: Push, public http: Http){

	}
	init(){  
		this.push.register().then((t: PushToken) => {			
	        return this.push.saveToken(t);
	      }).then(((t: PushToken) => {
	    
	      }).bind(this));
	    this.push.rx.notification()
	    .subscribe(((msg) => {
	    	//onRecieve PushNotification
	    }).bind(this));
	}
	pushData(product){ 
		var link = 'https://api.ionic.io/push/notifications/';
        var data = {
		  'token': 'f4IH-SFWypQ:APA91bFpdSWU9Q2aD4j4pWWqUwY-6NVuGiIX_rj9KBLqSE0zJ-haz9sNC1c-5f3nJ_4FLrBfxL2XsTY0TsVAzr2i8rh0byVHu2_dsI23MZsUnKk0dXwajJOCzlDeoV0P86pyRj7sLysp',
		  'profile': 'david',
		  'emails': 'daviddavilapino@gmail.com',
		  'send_to_all': true,
		  'notification': {
		  	'android':{
		  		'icon':product.photo
		  	},
		  	'title': 'Tenemos mueble nuevo en la lista!',
		    'message': 'El mueble '+product.nombre+' se ha añadido en la categoría '+product.category+' y en la tienda '+product.branch
		  }
		};
		let headers = new Headers({ 'Content-Type': 'application/json',
		'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZmEwMjY3MS05NmZmLTRjNDItOGZiZC05YWM3OWZhNTEyMWYifQ.Jyx2usIEuJHck2wVDCCoLe9fW-kw02h6Psdzzj-kRQo' });
		let options = new RequestOptions({ headers: headers });
        this.http.post(link, data, options)
        .subscribe(data => {
         	
        }, error => {
        	
        });
	}
	
	

}