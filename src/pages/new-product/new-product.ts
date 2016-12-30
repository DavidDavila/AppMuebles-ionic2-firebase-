import { Component } from '@angular/core';
import { ProductService } from './../../providers/product';
import { NativeService } from './../../providers/native';
import { PushService } from './../../providers/push';
import { ViewController, Platform, NavParams, ToastController, AlertController } from 'ionic-angular';
@Component({
  selector: 'page-new-product',
  templateUrl: 'new-product.html',
  providers: [ProductService, NativeService, PushService ]
})
export class NewProductPage {

	public market: any;
	public product: any;
  public categoryList: any;
	public branchList: any;
  public loading: number;
  public update: boolean;
  public inShop: boolean;
  public src: any;
   public debug_size_before: string[] = [];
  public debug_size_after: string[] = [];

  constructor(public toastCtrl: ToastController,
    private _productService:ProductService,
    private _nativeService:NativeService,
    public viewCtrl: ViewController,
    public params: NavParams,
    public platform: Platform,
    private _pushService:PushService,
    public alertCtrl: AlertController,
    )
  {
    this.src = '';
    if( this.params.data ){
      this.product = this.params.data;
      if(this.params.data.nombre){
         this.update = true
       }else{
         this.product = {
           nombre:'',
           branch:'',
           category:'',
           favourite:'',
           observaciones:'',
           photo:'',
           price:'',
           geo:'',
           date:Date.now(),
         }
         this.showConfirm()
       }
    }
    this.loading = 0;
    this.inShop = false;
  	
  	const categoryList$ = this._productService.getDatabase('productos')
    categoryList$.subscribe( val => {
      this.categoryList = this._productService.getListByAttr(val, 'category');
      this.branchList =  this._productService.getListByAttr(val, 'branch');
    });

  }
  doPhoto(){
    this.src = '';
    var photo = this._nativeService.doPhoto();
    photo.then((result)=>{
       this.loading = 1;
      this.generateImg( result ,56 ,56,'thumb' );
      this.generateImg( result ,600 ,600, 'photo' );
     
    })
  }
  generateImg(blob, w, h, param){ 
    var image = new Image(); 
    image.src = blob;
    image.onload = (function(this, e) { 
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      canvas.width = w; // target width
      canvas.height = h; // target height
      ctx.drawImage(image, 
          0, 0, image.width, image.height, 
          0, 0, canvas.width, canvas.height
      );
      // create a new base64 encoding
      var thumb64 = canvas.toDataURL(); 
      var blob = this.base64toJpg(thumb64);
      var file = new File([blob],  Date.now().toString(), {type: 'image/png', lastModified: Date.now()});
      var upload = this._productService.uploadFile(file);
      upload.then((function(data){
        this.product[param] = data['a'].downloadURLs[0];  
        if(param == 'photo'){
          this.src= this.product[param];  
          
        }   
      }).bind(this))      
    }).bind(this)
   

  }
  base64toJpg(b64Data){
    var contentType = 'image/png';
    var sliceSize = 10;
    b64Data = b64Data.replace('data:image/jpeg;base64,','').replace('data:image/png;base64,','').replace('data:image/jpg;base64,','')
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
      
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: '¿Estás en la tienda que vende este producto?',
      message: 'La aplicación va a proceder a buscarte mediante GPS para guardar tu posición actual-',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Si',
          handler: (() => {
            this.product.geo = this.activateGps().then(function(coords){
              if(!coords){
                delete this.product.geo
              }else{
                return coords;                
              }
            })
            this.inShop = true;
                      
            
          }).bind(this)
        }
      ]
    });
    confirm.present();
  }
  change(input){ 
    this.loading = 1;
    var b64 = this.getBase64(input.files[0])
  }
  getBase64(file) {
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = (function (fileLoadedEvent) {
      this.generateImg( reader.result ,64 ,32,'thumb' );
      this.generateImg( reader.result ,640 ,320, 'photo' );
   }).bind(this);
  }

  upload(file){
    var upload = this._productService.uploadFile(file);
    upload.then((function(data){
      this.product.photo = data['a'].downloadURLs[0]
    }).bind(this))

    
   
  }
  showToast(category) {
    let toast = this.toastCtrl.create({
      message: category+' creada correctamente',
      duration: 2000,
      position: 'bottom'
    });

    toast.present(toast);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  updateProduct(){  
    var object = Object.assign({},this.product) 
    var category = this.product.newCategory? this.product.newCategory : this.product.category;
    var branch = this.product.newBranch? this.product.newBranch : this.product.branch;
    object.category = category;
    object.branch = branch;  

    delete object.newCategory;
    delete object.newBranch;
    delete object.$key;
    delete object.$exists;
    
    this._productService.updateItem(this.product.$key, object);
    this.dismiss();  
  } 
  addProduct(){  	
    var category = this.product.newCategory? this.product.newCategory : this.product.category;
  	var branch = this.product.newBranch? this.product.newBranch : this.product.branch;
    this.product.category = category;
		this.product.branch = branch;  

    delete this.product.newCategory;
  	delete this.product.newBranch;
		this._productService.addItem(this.product, 'productos');  
    this._pushService.pushData(this.product);
    this.dismiss();	
    this.showToast(category);
  }
  activateGps(){
    return this._nativeService.getPersmisionToGeolocate().then(function(coords){      
      return coords
    }) ;
  }
}
