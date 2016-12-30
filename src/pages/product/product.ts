import { Component  } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { NavController, NavParams } from 'ionic-angular';


/*
  Generated class for the Product page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-product',
  templateUrl: 'product.html'
})
export class ProductPage {
  public currentProduct:any;
	public map:any;
  constructor(
    public _domSanitizer: DomSanitizer,
  	public navCtrl: NavController,  	
    public navParams: NavParams
  ) 
  { 
  	this.currentProduct = this.navParams.data;
    var geoCoords = this.currentProduct.geo.__zone_symbol__value?this.currentProduct.geo.__zone_symbol__value.split('|') : false;

    this.map = geoCoords? this._domSanitizer.bypassSecurityTrustUrl('geo:'+geoCoords[0]+','+geoCoords[1]+'?q='+geoCoords[0]+','+geoCoords[1]) : false
    
   
  }

}
