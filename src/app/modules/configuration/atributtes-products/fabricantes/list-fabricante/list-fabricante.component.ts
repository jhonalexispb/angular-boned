import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { FabricantesService } from '../service/fabricantes.service';
import { CreateFabricanteComponent } from '../create-fabricante/create-fabricante.component';
import { EditFabricanteComponent } from '../edit-fabricante/edit-fabricante.component';

@Component({
  selector: 'app-list-fabricante',
  templateUrl: './list-fabricante.component.html',
  styleUrls: ['./list-fabricante.component.scss']
})
export class ListFabricanteComponent {
  search:string = '';
  FABRICANTES:any = [];
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  activeDropdownIndex: number | null = null;

  constructor(
    public modalService: NgbModal,
    public fabricantesService: FabricantesService,
  ){

  }

  ngOnInit(): void {
    this.listFabricante();
  }

  listFabricante(page = 1){
    this.fabricantesService.listFabricantes(page,this.search).subscribe((resp: any) => {
      this.FABRICANTES = resp.fabricantes;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page: number) {
    this.listFabricante(page);
  }

  createFabricante(){
    const modalRef = this.modalService.open(CreateFabricanteComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.FabricanteC.subscribe((f:any)=>{
      this.FABRICANTES.unshift(f); //integra el nuevo valor al inicio de la tabla
    })
  }

  editFabricante(F:any){
    const modalRef = this.modalService.open(EditFabricanteComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.FABRICANTE_SELECTED = F;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.FabricanteE.subscribe((f:any)=>{
      const { fabricante, isRestored } = f; 
      if (isRestored) {
        this.FABRICANTES.unshift(fabricante);
      } else {
        let INDEX = this.FABRICANTES.findIndex((b:any) => b.id == F.id);
        if(INDEX != -1){
          this.FABRICANTES[INDEX] = fabricante
        }
      }
    })
  }

  deleteFabricante(F:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el fabricante: ${F.nombre}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.fabricantesService.deleteFabricante(F.id).subscribe({
          next: (resp: any) => {
            this.FABRICANTES = this.FABRICANTES.filter((sucurs:any) => sucurs.id !== F.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'El fabricante ha sido eliminado correctamente','/assets/animations/general/borrado_exitoso.json');
          }
        })
      }
    });
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }
}
