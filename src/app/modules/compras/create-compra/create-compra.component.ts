import { Component } from '@angular/core';

@Component({
  selector: 'app-create-compra',
  templateUrl: './create-compra.component.html',
  styleUrls: ['./create-compra.component.scss']
})
export class CreateCompraComponent {
  PRODUCT_LIST:any = [];
  LABORATORIOS_LIST:any = [];
  laboratorio_id:any
  loading:any

  onSearchChange(){

  }
}
