import { Injectable } from '@angular/core';

import { AngularFire } from 'angularfire2';
/*
  Generated class for the Product provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductService {
	public firebase:any;
  	constructor( 
  		private af:AngularFire,
  	)
  	{
  		this.firebase = firebase;
	}
	getDatabase(database){
		return this.af.database.list(database)
	}
	addItem(object, database){
		var dataRef = this.getDatabase(database);
		dataRef.push(object);		
	}
	uploadFile(file){
	    var storageRef = firebase.storage().ref('muebles/'+file.name);
	    var task = storageRef.put(file);
	    return task;
	}
	removeItem(key){
		var dataRef = this.getDatabase('productos');
		dataRef.remove(key);
	}
	updateItem(key, data){
		var dataRef = this.getDatabase('productos');
		dataRef.update(key, data);		
	}
	toogleFav(key, fav){
		var dataRef = this.getDatabase('productos');
		dataRef.update(key, { favourite: !fav });
	}
	orderBy(array, param){
		function compare(a,b) {
			if (Number(a[param]) < Number(b[param]))
				return -1;
			if (Number(a[param]) > Number(b[param]))
				return 1;
			return 0;
			}

		return array.sort(compare);
	}
	groupBy( array , f ){
		var groups = {};
		array.forEach( function( o ){
		  var group = JSON.stringify( f(o) );
		  groups[group] = groups[group] || [];
		  groups[group].push( o );  
		});
		return Object.keys(groups).map( function( group )
		{
		  return groups[group]; 
		})
	}
	getListByAttr(database, categoryParam){
		var agroup = this.groupBy(database, function(item){
	      return [item[categoryParam]];
	    });
	    var result = [];
	    for(let i = 0; i<agroup.length;i++){
	    	result.push(agroup[i][0][categoryParam])
	    }
	    return result;

	}
	filterHtmlBy(selectedBranch, className, htmlList){
	  	let items = htmlList.getElementsByClassName('item');
	  	for(let i = 0; i< items.length; i++){
	  		items[i].className = items[i].className.replace('hide','')
	  		var classNameList = items[i].getElementsByClassName(className);

	  		if(selectedBranch != 'all'){	  			
		  		if( classNameList[0].innerHTML != selectedBranch){
		  			items[i].className += ' hide';
		  		}
		  	}else{
		  		if( className == 'fav' ){
		  			if(!/fav/.test(items[i].className)){
		  				items[i].className += ' hide';
		  			}
		  		}
		  	}
	  	}
	}
}
