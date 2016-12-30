import { Component } from '@angular/core';
import { NavParams, ViewController  } from 'ionic-angular';
import { ProductService } from './../../providers/product';

/*
  Generated class for the Popover page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@Component({
  templateUrl: 'popover.html',
  providers:[ProductService]
})

export class PopoverPage {
	public branchList:Array<string>;
	public htmlList:any;
  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private _productService:ProductService,

  )
  {
    if (this.navParams.data) {
    	this.branchList = this.navParams.data;;
    	this.htmlList = this.navParams.data.opts;
    }
    	
  }
  itemSelected(selectedBranch){
    if(selectedBranch != 'fav'){
      this._productService.filterHtmlBy(selectedBranch, 'branch', this.htmlList)
    }else{
      this._productService.filterHtmlBy('all', 'fav', this.htmlList)
    }
  	this.viewCtrl.dismiss();
  }
}