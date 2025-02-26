import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { CreateProductComponent } from '../create-product/create-product.component';
import { ProductService } from '../service/product.service';
import { ViewImageComponent } from 'src/app/components/view-image/view-image.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { URL_SERVICIO } from 'src/app/config/config';
import { ImportExcelComponent } from 'src/app/components/import-excel/import-excel.component';
import { ModalGestionarComponent } from '../modal-gestionar/modal-gestionar.component';
import { ModalEscalasComponent } from '../modal-escalas/modal-escalas.component';
import { ModalLotesComponent } from '../modal-lotes/modal-lotes.component';
import { ModalImagenesComponent } from '../modal-imagenes/modal-imagenes.component';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent {
  producto_id:any;
  laboratorio_id:any
  PRODUCT_LIST:any = [];
  LABORATORIOS_LIST:any = [];
  state_stock:string
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  activeDropdownIndex: number | null = null;
  loading:boolean = false;
  num_products_disponible:number = 0
  num_products_por_agotar:number = 0
  num_products_agotado:number = 0
  warehouse_id:any;

  constructor(
    public modalService: NgbModal,
    public productService: ProductService,
  ){

  }

  ngOnInit(): void {
    this.listProductos();
  }

  onSearchChange() {
    if (this.producto_id === null) {
      this.producto_id = ''; // Convertir null a cadena vacía
    }
    this.listProductos(); // Llamar a tu función para actualizar la lista
    if(this.producto_id === ''){
      this.producto_id = null
    }
  }

  listProductos(page = 1){
    let data = {
      producto_id: this.producto_id,
      laboratorio_id: this.laboratorio_id,
      state_stock: this.state_stock,
      warehouse_id: this.warehouse_id
    }
    this.loading = true
    this.productService.listProductos(page,data).subscribe((resp: any) => {
      this.PRODUCT_LIST = resp.products.data;
      this.LABORATORIOS_LIST = resp.laboratorios;
      this.num_products_disponible = resp.num_products_disponible
      this.num_products_por_agotar = resp.num_products_por_agotar
      this.num_products_agotado = resp.num_products_agotado
      this.totalPages = resp.total;
      this.currentPage = page;
      this.loading = false
    })
  }

  selectDisponible(){
    this.state_stock = '1'
    this.listProductos()
  }
  selectPorAgotar(){
    this.state_stock = '2'
    this.listProductos()
  }
  selectAgotado(){
    this.state_stock = '3'
    this.listProductos()
  }

  loadPage(page: number) {
    this.listProductos(page);
  }

  resetFiltro(){
    this.producto_id = null
    this.laboratorio_id = null
    this.warehouse_id = null
    this.state_stock = ''
    this.listProductos()
  }

  importProduct(){
    const modalRef = this.modalService.open(ImportExcelComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nameModule = "productos"
    modalRef.componentInstance.route = "/productos/import"
    modalRef.componentInstance.ImportExcelC.subscribe((r:any)=>{
      
    })
  }

  createProducto(){
    const modalRef = this.modalService.open(CreateProductComponent,{centered:true, size: 'xl'})
    modalRef.componentInstance.ProductoC.subscribe((r:any)=>{
      this.PRODUCT_LIST.unshift(r.data); //integra el nuevo valor al inicio de la tabla
    })
  }

  editProducto(R:any){
    const modalRef = this.modalService.open(EditProductComponent,{centered:true, size: 'xl'})
    modalRef.componentInstance.PRODUCT_SELECTED = R;
    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.ProductoE.subscribe((r:any)=>{
      const { producto, isRestored } = r; 
      if (isRestored) {
        this.PRODUCT_LIST.unshift(producto.data);
      } else {
        let INDEX = this.PRODUCT_LIST.findIndex((b:any) => b.id == R.id);
        if(INDEX != -1){
          this.PRODUCT_LIST[INDEX] = producto.data
        }
      }
    })
  }

  deleteProducto(PROD:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el producto: ${PROD.laboratorio} ${PROD.nombre_completo}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.productService.deleteProducto(PROD.id).subscribe({
          next: (resp: any) => {
            this.PRODUCT_LIST = this.PRODUCT_LIST.filter((sucurs:any) => sucurs.id !== PROD.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'El producto ha sido eliminado correctamente','/assets/animations/general/borrado_exitoso.json');
          },
        })
      }
    });
  }

  gestionarProdcuto(PROD:any){
    const modalRef = this.modalService.open(ModalGestionarComponent,{centered:true, size: 'lg'})
    modalRef.componentInstance.PRODUCT_OPTION = PROD;
    modalRef.componentInstance.productGestionS.subscribe((r:any)=>{
      let INDEX = this.PRODUCT_LIST.findIndex((b:any) => b.id == PROD.id);
      if(INDEX != -1){
        this.PRODUCT_LIST[INDEX] = r.data
      }
    })
  }

  // Método que se ejecuta cuando un dropdown es activado o desactivado
  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  viewImagen(image:string){
    const modalRef = this.modalService.open(ViewImageComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.IMAGE_SELECTED = image
  }

  downloadProducts(){
    let link = ""
    if(this.producto_id){
      link += "&producto_id="+this.producto_id
    }

    if(this.laboratorio_id){
      link += "&laboratorio_id="+this.laboratorio_id
    }

    if(this.state_stock){
      link += "&state_stock="+this.state_stock
    }

    if(this.warehouse_id){
      link += "&warehouse_id="+this.warehouse_id
    }
    
    window.open(URL_SERVICIO+"/excel/export-products?k=1"+link,"_blank")
  }

  configurarEscalas(PROD:any){
    const modalRef = this.modalService.open(ModalEscalasComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PRODUCT_ID = PROD
  }

  configurarLotes(PROD:any){
    const modalRef = this.modalService.open(ModalLotesComponent,{centered:true, size: 'xl'})
    modalRef.componentInstance.PRODUCT_ID = PROD
  }

  configurarImagenes(P:any){
    const modalRef = this.modalService.open(ModalImagenesComponent,{centered:true, size: 'lg'})
    modalRef.componentInstance.PRODUCT = P
    modalRef.componentInstance.imagesU.subscribe((r:any)=>{
      console.log(r)
      const producto_Seleccioando = this.PRODUCT_LIST.find((producto: any) => producto.id === P.id)
      if(producto_Seleccioando){
        producto_Seleccioando.imagen = r
      }
    })
  }
}
