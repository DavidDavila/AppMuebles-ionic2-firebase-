import { Pipe, PipeTransform } from '@angular/core';
import { Injectable } from '@angular/core';

@Pipe({
    name: 'productInView'
})

@Injectable()
export class ProductInView implements PipeTransform {
    transform(items: any, args: any): any {
        // filter items array, items which match and return true will be kept, false will be filtered out
     	if(args == 'all'){
     		return items
     	}else{
     		return items.filter(item => item.category == args);
     	}
    }
}