import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CondicionAlmacenamientoService } from '../service/condicion-almacenamiento.service';
import { CreateCondicionesAlmacenamientoComponent } from '../create-condiciones-almacenamiento/create-condiciones-almacenamiento.component';
import { EditCondicionesAlmacenamientoComponent } from '../edit-condiciones-almacenamiento/edit-condiciones-almacenamiento.component';

@Component({
  selector: 'app-lis-condiciones-almacenamiento',
  templateUrl: './lis-condiciones-almacenamiento.component.html',
  styleUrls: ['./lis-condiciones-almacenamiento.component.scss']
})
export class LisCondicionesAlmacenamientoComponent {
  search:string = '';
  CONDICIONES:any = [];
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  activeDropdownIndex: number | null = null;

  constructor(
    public modalService: NgbModal,
    public condicionAlmacenamientoService: CondicionAlmacenamientoService,
  ){

  }

  ngOnInit(): void {
    this.listCondiciones();
  }

  listCondiciones(page = 1){
    this.condicionAlmacenamientoService.listCondiciones(page,this.search).subscribe((resp: any) => {
      this.CONDICIONES = resp.condicion_almacenamiento;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page: number) {
    this.listCondiciones(page);
  }

  createCondicion(){
    const modalRef = this.modalService.open(CreateCondicionesAlmacenamientoComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.CondicionC.subscribe((c:any)=>{
      this.CONDICIONES.unshift(c); //integra el nuevo valor al inicio de la tabla
    })
  }

  editCondicion(C:any){
    const modalRef = this.modalService.open(EditCondicionesAlmacenamientoComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.CONDICION_SELECTED = C;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.CondicionE.subscribe((c:any)=>{
      const { condicion, isRestored } = c; 
      if (isRestored) {
        this.CONDICIONES.unshift(condicion);
      } else {
        let INDEX = this.CONDICIONES.findIndex((b:any) => b.id == C.id);
        if(INDEX != -1){
          this.CONDICIONES[INDEX] = condicion
        }
      }
    })
  }

  deleteCondicion(C:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar la condicion de almacenamiento: ${C.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.condicionAlmacenamientoService.deleteCondicion(C.id).subscribe({
          next: (resp: any) => {
            this.CONDICIONES = this.CONDICIONES.filter((sucurs:any) => sucurs.id !== C.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'La condicion de almacenamiento ha sido eliminada correctamente','/assets/animations/general/borrado_exitoso.json');
          }
        })
      }
    });
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }
}
