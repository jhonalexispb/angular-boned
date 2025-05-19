import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewImageComponent } from 'src/app/components/view-image/view-image.component';

@Component({
  selector: 'app-mercaderia-orden-venta',
  templateUrl: './mercaderia-orden-venta.component.html',
  styleUrls: ['./mercaderia-orden-venta.component.scss']
})
export class MercaderiaOrdenVentaComponent {
  @Input() ORDEN_VENTA:any
  PRODUCTS:any
  total:any

  constructor(
    public modal: NgbActiveModal,
    public modalService: NgbModal,
  ){}

  ngOnInit(){
    console.log(this.ORDEN_VENTA)
    this.PRODUCTS = this.ORDEN_VENTA.mercaderia
    this.total = this.ORDEN_VENTA.total
  }

  viewImagen(image:string){
    const modalRef = this.modalService.open(ViewImageComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.IMAGE_SELECTED = image
  }
}
