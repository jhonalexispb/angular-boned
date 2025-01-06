import { CategoriasServiceService } from '../service/categorias-service.service';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CreateCategoriasComponent } from '../create-categorias/create-categorias.component';
import { EditCategoriasComponent } from '../edit-categorias/edit-categorias.component';


const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-list-categorias',
  templateUrl: './list-categorias.component.html',
  styleUrls: ['./list-categorias.component.scss']
})
export class ListCategoriasComponent {
  search:string = '';
  CATEGORIAS:any = [];
  isLoading$:any;
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  
  page = 1;
  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;

    this.currentPage = this.page;
    this.loadPage(this.page);
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  constructor(
    public modalService: NgbModal,
    public sucursalService: CategoriasServiceService,
  ){

  }

  ngOnInit(): void {
    this.isLoading$ = this.sucursalService.isLoading$;
    this.listCategoria();
  }

  listCategoria(page = 1){
    this.sucursalService.listCategorias(page,this.search).subscribe((resp: any) => {
      this.CATEGORIAS = resp.categoria;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listCategoria($event);
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
        this.sucursalService.deleteCategoria(CAT.id).subscribe({
          next: (resp: any) => {
            if (resp.message === 403) {
              this.sweet.error('Error', resp.message_text);
            } else {
              this.CATEGORIAS = this.CATEGORIAS.filter((sucurs:any) => sucurs.id !== CAT.id); // Eliminamos el rol de la lista
              this.sweet.success('Eliminado', 'La categoria ha sido eliminada correctamente','/assets/animations/general/borrado_exitoso.json');
            }
          },
          error: (error) => {
            this.sweet.error(error.status);
          }
        })
      }
    });
  }
}
