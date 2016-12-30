import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2/index';
import { FIREBASECONF } from './../conf/firebase';
import { MyApp } from './app.component';
import { ProductInView } from './../pipes/productInView';
import { Market } from '../pages/market/market';
import { NewProductPage } from '../pages/new-product/new-product';
import { ProductPage } from '../pages/product/product';
import { PopoverPage } from '../pages/popover/popover'; 
 
 
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'd08bbdae'
  },
  'push': {
    'sender_id': '625588180480',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};


@NgModule({
  declarations: [
    MyApp,
    Market,
    ProductInView,
    NewProductPage,
    ProductPage,
    PopoverPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      mode:"ios"
    }),
    CloudModule.forRoot(cloudSettings),
    AngularFireModule.initializeApp(FIREBASECONF),
    BrowserModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Market,
    NewProductPage,
    ProductPage,
    PopoverPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})

export class AppModule {}
