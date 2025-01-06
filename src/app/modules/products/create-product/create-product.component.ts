import { Component } from '@angular/core';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {
  tab_selected:number = 1
  is_discount:number = 1
  

  selectedDiscount(a:number){
    this.is_discount = a
  }

  selectedTab(a:number){
    this.tab_selected = a
  }
}
