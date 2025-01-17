import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CreateRucComponent } from '../../ruc/create-ruc/create-ruc.component';
import { EditRucComponent } from '../../ruc/edit-ruc/edit-ruc.component';
import { RucService } from '../../ruc/service/ruc.service';

@Component({
  selector: 'app-list-sucursales',
  templateUrl: './list-sucursales.component.html',
  styleUrls: ['./list-sucursales.component.scss']
})
export class ListSucursalesComponent {
  search:string = '';
  RUC_LIST:any = [];
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;

  constructor(
    public modalService: NgbModal,
    public rucService: RucService,
  ){

  }

  ngOnInit(): void {
    this.listRuc();
  }

  listRuc(page = 1){
    this.rucService.listRuc(page,this.search).subscribe((resp: any) => {
      this.RUC_LIST = resp.clientes;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page: number) {
    this.listRuc(page);
  }

  createRuc(){
    const modalRef = this.modalService.open(CreateRucComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.RucC.subscribe((r:any)=>{
      this.RUC_LIST.unshift(r); //integra el nuevo valor al inicio de la tabla
    })
  }

  editRuc(R:any){
    const modalRef = this.modalService.open(EditRucComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.RUC_SELECTED = R;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.RucE.subscribe((r:any)=>{
      const { ruc, isRestored } = r; 
      if (isRestored) {
        this.RUC_LIST.unshift(ruc);
      } else {
        let INDEX = this.RUC_LIST.findIndex((b:any) => b.id == R.id);
        if(INDEX != -1){
          this.RUC_LIST[INDEX] = ruc
        }
      }
    })
  }

  deleteRuc(RUC:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el cliente: ${RUC.ruc} ${RUC.razonSocial}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.rucService.deleteRuc(RUC.id).subscribe({
          next: (resp: any) => {
            this.RUC_LIST = this.RUC_LIST.filter((sucurs:any) => sucurs.id !== RUC.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'El cliente ha sido eliminado correctamente','/assets/animations/general/borrado_exitoso.json');
          },
        })
      }
    });
  }
}
