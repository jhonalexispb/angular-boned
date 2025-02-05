import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditSucursalesComponent } from '../../clientes/sucursales/edit-sucursales/edit-sucursales.component';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { CreateProductComponent } from '../create-product/create-product.component';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent {
  search:any;
    PRODUCT_LIST:any = [];
    sweet:any = new SweetalertService
  
    totalPages:number = 0; 
    currentPage:number = 1;
    activeDropdownIndex: number | null = null;
  
    constructor(
      public modalService: NgbModal,
      public productService: ProductService,
    ){
  
    }
  
    ngOnInit(): void {
      this.listProductos();
    }
  
    onSearchChange() {
      if (this.search === null) {
        this.search = ''; // Convertir null a cadena vacía
      }
      this.listProductos(); // Llamar a tu función para actualizar la lista
      if(this.search === ''){
        this.search = null
      }
    }
  
    listProductos(page = 1){
      this.productService.listProductos(page,this.search).subscribe((resp: any) => {
        this.PRODUCT_LIST = resp.products;
        this.totalPages = resp.total;
        this.currentPage = page;
      })
    }
  
    loadPage(page: number) {
      this.listProductos(page);
    }
  
    createProducto(){
      const modalRef = this.modalService.open(CreateProductComponent,{centered:true, size: 'xl'})
      modalRef.componentInstance.ClienteSucursalC.subscribe((r:any)=>{
        this.PRODUCT_LIST.unshift(r); //integra el nuevo valor al inicio de la tabla
      })
    }
  
    editProducto(R:any){
      const modalRef = this.modalService.open(EditSucursalesComponent,{centered:true, size: 'md'})
  
      modalRef.componentInstance.CLIENTE_SUCURSAL_SELECTED = R;
  
      //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
      modalRef.componentInstance.ClienteSucursalE.subscribe((r:any)=>{
          let INDEX = this.PRODUCT_LIST.findIndex((b:any) => b.id == R.id);
          if(INDEX != -1){
            this.PRODUCT_LIST[INDEX] = r
          }
      })
    }
  
    deleteProducto(SUC_CL:any){
      this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar la sucursal: ${SUC_CL.nombre_comercial} de ${SUC_CL.ruc} ${SUC_CL.razon_social}?`).then((result:any) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
          this.productService.deleteProducto(SUC_CL.id).subscribe({
            next: (resp: any) => {
              this.PRODUCT_LIST = this.PRODUCT_LIST.filter((sucurs:any) => sucurs.id !== SUC_CL.id); // Eliminamos el rol de la lista
              this.sweet.success('Eliminado', 'La sucursal ha sido eliminado correctamente','/assets/animations/general/borrado_exitoso.json');
            },
          })
        }
      });
    }
  
    // Método que se ejecuta cuando un dropdown es activado o desactivado
    handleDropdownToggle(index: number) {
      this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
    }
}
