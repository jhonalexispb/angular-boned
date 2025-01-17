import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SweetalertService } from '../../../../sweetAlert/sweetAlert.service';
import { MethodService } from '../service/method.service';
import { EditMethodComponent } from '../edit-method/edit-method.component';

@Component({
  selector: 'app-list-method',
  templateUrl: './list-method.component.html',
  styleUrls: ['./list-method.component.scss']
})
export class ListMethodComponent {
  search:string = '';
  METODOS:any = [];
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  
  constructor(
    public modalService: NgbModal,
    public metodoService: MethodService,
  ){

  }

  ngOnInit(): void {
    this.listMetodos();
  }

  listMetodos(page = 1){
    this.metodoService.listMetodos(page,this.search).subscribe((resp: any) => {
      this.METODOS = resp.methodPayment;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page:number){
    this.listMetodos(page);
  }

  editMetodo(METODO:any){
    const modalRef = this.modalService.open(EditMethodComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.METHOD_SELECTED = METODO;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.MethodE.subscribe((metodo:any)=>{
      let INDEX = this.METODOS.findIndex((met:any) => met.id == METODO.id);
      if(INDEX != -1){
        this.METODOS[INDEX] = metodo
      }
    })
  }
}
