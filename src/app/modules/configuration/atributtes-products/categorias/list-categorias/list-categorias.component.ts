import { CategoriasServiceService } from '../service/categorias-service.service';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CreateCategoriasComponent } from '../create-categorias/create-categorias.component';
import { EditCategoriasComponent } from '../edit-categorias/edit-categorias.component';

@Component({
  selector: 'app-list-categorias',
  templateUrl: './list-categorias.component.html',
  styleUrls: ['./list-categorias.component.scss']
})
export class ListCategoriasComponent {
  search:string = '';
  CATEGORIAS:any = [];
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;

  constructor(
    public modalService: NgbModal,
    public categoriasService: CategoriasServiceService,
  ){

  }

  ngOnInit(): void {
    this.listCategoria();
  }

  listCategoria(page = 1){
    this.categoriasService.listCategorias(page,this.search).subscribe((resp: any) => {
      this.CATEGORIAS = resp.categoria;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page: number) {
    this.listCategoria(page);
  }

  createCategoria(){
    const modalRef = this.modalService.open(CreateCategoriasComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.CategoriaC.subscribe((cat:any)=>{
      this.CATEGORIAS.unshift(cat); //integra el nuevo valor al inicio de la tabla
    })
  }

  editCategoria(CAT:any){
    const modalRef = this.modalService.open(EditCategoriasComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.CATEGORIA_SELECTED = CAT;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.CategoriaE.subscribe((cat:any)=>{
      const { categoria, isRestored } = cat; 
      if (isRestored) {
        this.CATEGORIAS.unshift(categoria);
      } else {
        let INDEX = this.CATEGORIAS.findIndex((b:any) => b.id == CAT.id);
        if(INDEX != -1){
          this.CATEGORIAS[INDEX] = categoria
        }
      }
    })
  }

  deleteCategoria(CAT:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar la categoria: ${CAT.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.categoriasService.deleteCategoria(CAT.id).subscribe({
          next: (resp: any) => {
            this.CATEGORIAS = this.CATEGORIAS.filter((sucurs:any) => sucurs.id !== CAT.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'La categoria ha sido eliminada correctamente','/assets/animations/general/borrado_exitoso.json');
          }
        })
      }
    });
  }
}
