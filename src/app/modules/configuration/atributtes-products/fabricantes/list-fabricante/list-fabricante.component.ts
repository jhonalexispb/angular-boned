import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CreateCategoriasComponent } from '../../categorias/create-categorias/create-categorias.component';
import { EditCategoriasComponent } from '../../categorias/edit-categorias/edit-categorias.component';
import { FabricantesService } from '../service/fabricantes.service';
import { CreateFabricanteComponent } from '../create-fabricante/create-fabricante.component';

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
    modalRef.componentInstance.CategoriaC.subscribe((cat:any)=>{
      this.FABRICANTES.unshift(cat); //integra el nuevo valor al inicio de la tabla
    })
  }

  editCategoria(CAT:any){
    const modalRef = this.modalService.open(EditCategoriasComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.CATEGORIA_SELECTED = CAT;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.CategoriaE.subscribe((cat:any)=>{
      const { categoria, isRestored } = cat; 
      if (isRestored) {
        this.FABRICANTES.unshift(categoria);
      } else {
        let INDEX = this.FABRICANTES.findIndex((b:any) => b.id == CAT.id);
        if(INDEX != -1){
          this.FABRICANTES[INDEX] = categoria
        }
      }
    })
  }

  deleteCategoria(CAT:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar la categoria: ${CAT.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.fabricantesService.deleteCategoria(CAT.id).subscribe({
          next: (resp: any) => {
            this.FABRICANTES = this.FABRICANTES.filter((sucurs:any) => sucurs.id !== CAT.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'La categoria ha sido eliminada correctamente','/assets/animations/general/borrado_exitoso.json');
          }
        })
      }
    });
  }
}
