import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ActionSheetController, PopoverController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2';
import { ProductService } from './../../providers/product';
import { NewProductPage } from './../new-product/new-product';
import { PopoverPage } from './../popover/popover';
import { ProductPage } from './../product/product';


@Component({
  selector: 'page-market',
  templateUrl: 'market.html',
  providers:[ProductService]
})
export class Market {
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;

  public selectedMarket: any;
  public productList:any;
  public currentPage:any;
  public titlePage:string;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _productService:ProductService,
    private popoverCtrl: PopoverController)  
  {
    // If we navigated to this page, we will have an item available as a nav param    
    this.currentPage =  navParams.get('section')
    this.selectedMarket =  this.currentPage ?  this.currentPage['market'] ?  this.currentPage.market : 'all' : 'all';
    this.titlePage = this.currentPage ?  this.currentPage['title'] : 'Nuestros Muebles' ;
    this.productList=[];
    // seteamos el observable
    const products$:FirebaseListObservable<any> = _productService.getDatabase('productos');
    products$.subscribe( (val => {
      if(!this.navParams.data['section'] && (this.productList.length > 0 && this.productList.length<val.length)){
        var modified = val[val.length-1];
        modified.new=true
        val.pop();
      }
      this.productList = _productService.orderBy(val, 'price');
      if(modified){
        this.productList.unshift(modified)
      }


    }).bind(this))
  }
  onInit(){   
    this._productService.filterHtmlBy('all', 'branch', this.content.nativeElement);      
  }
  presentPopover(ev) {

    let popover = this.popoverCtrl.create(
      PopoverPage, 
      this._productService.getListByAttr(this.productList, 'branch'), 
      this.content.nativeElement
     );

    popover.present({
      ev: ev
    });
  }
  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(Market, {
      item: item
    });
  }
  newProduct() {
    this.navCtrl.push(NewProductPage);   
  }
  pressEvent(e, item) {
    this.presentActionSheet(item);
  }
  presentActionSheet(item) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '¿Qué hacemos con '+item.nombre+'?',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: (() => {
            this._productService.removeItem(item.$key);
          }).bind(this)
        },{
          text: 'Modificar',
          handler: (() => {
             this.navCtrl.push(NewProductPage, item);
          }).bind(this)          
        },
        {
          text: 'Favorito',
          handler: (() => {
            this._productService.toogleFav(item.$key, item.favourite);
          }).bind(this)          
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  goTo(product){
    this.navCtrl.push(ProductPage, product)

  }
}
