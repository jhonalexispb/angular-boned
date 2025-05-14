import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewImageComponent } from 'src/app/components/view-image/view-image.component';

@Component({
  selector: 'app-mercaderia-guia-prestamo',
  templateUrl: './mercaderia-guia-prestamo.component.html',
  styleUrls: ['./mercaderia-guia-prestamo.component.scss']
})
export class MercaderiaGuiaPrestamoComponent {
  @Input() GUIA_PRESTAMO:any
  PRODUCTS:any
  total:any

  constructor(
    public modal: NgbActiveModal,
    public modalService: NgbModal,
  ){}

  ngOnInit(){
    console.log(this.GUIA_PRESTAMO)
    this.PRODUCTS = this.GUIA_PRESTAMO.mercaderia
    this.total = this.GUIA_PRESTAMO.monto_total
  }

  viewImagen(image:string){
      const modalRef = this.modalService.open(ViewImageComponent,{centered:true, size: 'md'})
      modalRef.componentInstance.IMAGE_SELECTED = image
    }
}
