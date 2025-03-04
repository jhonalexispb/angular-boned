import { Component } from '@angular/core';
import { GestionarZonaVentaComponent } from '../gestionar-zona-venta/gestionar-zona-venta.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-zona-venta',
  templateUrl: './list-zona-venta.component.html',
  styleUrls: ['./list-zona-venta.component.scss']
})
export class ListZonaVentaComponent {
  constructor(
    public modalService: NgbModal
  ){
  }
  abrirMapa(){
    const modalRef = this.modalService.open(GestionarZonaVentaComponent,{centered:true, size: 'xl'})
  }
}
