import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { FirebaseListObservable } from 'angularfire2';
import { ProductService } from './../providers/product';
import { PushService } from './../providers/push';
import { Market } from '../pages/market/market';

@Component({
  templateUrl: 'app.html',
  providers: [ProductService, PushService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Market;

  pages: Array<any>;

  constructor(
    public platform: Platform,   
    public _pushService: PushService,   
    private _productService:ProductService ) 
  {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.setMarketObservable(_productService);
   

  }
  setMarketObservable(_productService){
    const categories$:FirebaseListObservable<any> = _productService.getDatabase('productos');
    categories$.subscribe( (val => { 
      var categoryList = this._productService.getListByAttr(val, 'category')          
      this.setPagesMenu(categoryList)
    }).bind(this))

  }
  setPagesMenu(categoryList){
    this.pages = [ 
      { title: 'Todos los productos', component: Market },
    ];
    for(let i = 0; i<categoryList.length; i++ ){
      this.pages.push({ "title": categoryList[i] , market:categoryList[i], "component": Market })
    }   
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      this._pushService.init(); 
    });
  } 

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component,{section: page});
  }
}
