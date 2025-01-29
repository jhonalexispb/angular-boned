import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { LineasFarmaceuticasService } from '../service/lineas-farmaceuticas.service';
import { CreateLineasFarmaceuticasComponent } from '../create-lineas-farmaceuticas/create-lineas-farmaceuticas.component';
import { EditLineasFarmaceuticasComponent } from '../edit-lineas-farmaceuticas/edit-lineas-farmaceuticas.component';

@Component({
  selector: 'app-list-lineas-farmaceuticas',
  templateUrl: './list-lineas-farmaceuticas.component.html',
  styleUrls: ['./list-lineas-farmaceuticas.component.scss']
})
export class ListLineasFarmaceuticasComponent {
  search:string = '';
    LINEAS_FARMACEUTICAS:any = [];
    sweet:any = new SweetalertService
  
    totalPages:number = 0; 
    currentPage:number = 1;
    activeDropdownIndex: number | null = null;
  
    constructor(
      public modalService: NgbModal,
      public lineaFarmaceuticaService: LineasFarmaceuticasService,
    ){
  
    }
  
    ngOnInit(): void {
      this.listLineaFarmaceutica();
    }
  
    listLineaFarmaceutica(page = 1){
      this.lineaFarmaceuticaService.listLineasFarmaceuticas(page,this.search).subscribe((resp: any) => {
        this.LINEAS_FARMACEUTICAS = resp.lineas_farmaceuticas;
        this.totalPages = resp.total;
        this.currentPage = page;
      })
    }
  
    loadPage(page: number) {
      this.listLineaFarmaceutica(page);
    }
  
    createLineaFarmaceutica(){
      const modalRef = this.modalService.open(CreateLineasFarmaceuticasComponent,{centered:true, size: 'md'})
      modalRef.componentInstance.LineaFarmaceuticaC.subscribe((f:any)=>{
        this.LINEAS_FARMACEUTICAS.unshift(f); //integra el nuevo valor al inicio de la tabla
      })
    }
  
    editLineaFarmaceutica(L:any){
      const modalRef = this.modalService.open(EditLineasFarmaceuticasComponent,{centered:true, size: 'md'})
  
      modalRef.componentInstance.LINEA_FARMACEUTICA_SELECTED = L;
  
      //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
      modalRef.componentInstance.LineaFarmaceuticaE.subscribe((f:any)=>{
        const { linea_farmaceutica, isRestored } = f; 
        if (isRestored) {
          this.LINEAS_FARMACEUTICAS.unshift(linea_farmaceutica);
        } else {
          let INDEX = this.LINEAS_FARMACEUTICAS.findIndex((b:any) => b.id == L.id);
          if(INDEX != -1){
            this.LINEAS_FARMACEUTICAS[INDEX] = linea_farmaceutica
          }
        }
      })
    }
  
    deleteLineaFarmaceutica(L:any){
      this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar la linea farmaceutica: ${L.nombre}?`).then((result:any) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
          this.lineaFarmaceuticaService.deleteLineaFarmaceutica(L.id).subscribe({
            next: (resp: any) => {
              this.LINEAS_FARMACEUTICAS = this.LINEAS_FARMACEUTICAS.filter((sucurs:any) => sucurs.id !== L.id); // Eliminamos el rol de la lista
              this.sweet.success('Eliminado', 'La linea farmaceutica ha sido eliminada correctamente','/assets/animations/general/borrado_exitoso.json');
            }
          })
        }
      });
    }
  
    handleDropdownToggle(index: number) {
      this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
    }
}
