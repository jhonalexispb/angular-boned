import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateLotesComponent } from 'src/app/modules/products/create-lotes/create-lotes.component';

@Component({
  selector: 'app-gestionar-mercaderia-compra',
  templateUrl: './gestionar-mercaderia-compra.component.html',
  styleUrls: ['./gestionar-mercaderia-compra.component.scss']
})
export class GestionarMercaderiaCompraComponent {
  @Input() PRODUCTO:any = []
  LOTES_LIST:any = []

  constructor(
    public modalService: NgbModal,
  ){
  }
  
  ngOnInit(){
    console.log(this.PRODUCTO)
  }

  createLote(PROD:any){
    const modalRef = this.modalService.open(CreateLotesComponent,{centered:true, size: 'md'})
    const productoConNombreCompleto = {
        ...PROD,
        nombre_completo: `${PROD.nombre} ${PROD.caracteristicas}`
    };
    modalRef.componentInstance.PRODUCT_ID = productoConNombreCompleto
    modalRef.componentInstance.LoteC.subscribe((r:any)=>{
      console.log(r.lotes)
      this.LOTES_LIST.unshift(r.lotes);
    })
  }
}

