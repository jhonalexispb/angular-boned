import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateLaboratoriosComponent } from '../../configuration/atributtes-products/laboratorios/create-laboratorios/create-laboratorios.component';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { CreateProveedorComponent } from '../../configuration/proveedor/create-proveedor/create-proveedor.component';
import { CompraService } from '../service/compra.service';
import { GestionarLaboratorioComponent } from '../../configuration/proveedor/gestionar-laboratorio/gestionar-laboratorio.component';
import { ViewImageComponent } from 'src/app/components/view-image/view-image.component';
import { CreateProductComponent } from '../../products/create-product/create-product.component';

@Component({
  selector: 'app-create-compra',
  templateUrl: './create-compra.component.html',
  styleUrls: ['./create-compra.component.scss']
})
export class CreateCompraComponent {
  @Output() OrdenCompraC:EventEmitter<any> = new EventEmitter();
  productForm: FormGroup;

  LABORATORIOS_LIST:any[] = [];
  PROVEEDORES_LIST:any[] = [];
  PRODUCT_LIST:any[] = [];
  codigo:string = "Calculando codigo..."
  FORMA_PAGO_LIST:any[] = [];
  TIPO_COMPROBANTE_LIST:any[] = [];
  product_id:any = null

  loading:boolean = true
  loadingProducts:boolean = true

  searchTermLaboratorio: string = '';
  searchTermProveedores: string = '';

  imageCache: Map<string, string> = new Map();

  sweet:any = new SweetalertService

  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    //llamamos al servicio
    public compraService: CompraService
  ) {}

  ngOnInit(): void {
    this.compraService.obtenerRecursosParaCrear().subscribe((resp: any) => {
        this.PROVEEDORES_LIST = resp.proveedores;
        this.FORMA_PAGO_LIST = resp.forma_pago;
        this.TIPO_COMPROBANTE_LIST = resp.tipo_comprobante;
        this.codigo = resp.codigo
        this.loading = false
        this.loadingProducts = false
    })

    this.productForm = this.fb.group({
      laboratorio_id:[null,[Validators.required]],
      proveedor_id:[null,[Validators.required]],
      product_id:[null,[Validators.required]],
      forma_pago_id:["",[Validators.required]],
      type_comprobante_compra_id:["",[Validators.required]],
      igv:[1],
    });
  }

  onSearchLaboratorio(event: any) {
    this.searchTermLaboratorio = event.term;  // Acceder al término de búsqueda desde el evento
  }

  onSearchProveedor(event: any) {
    this.searchTermProveedores = event.term;  // Acceder al término de búsqueda desde el evento
  }

  // Enviar el formulario
  onSubmit() {
    if (this.productForm.valid) {
      /* this.compraService.registerProducto(this.productForm.value).subscribe({
        next: (resp: any) => {
          this.OrdenCompraC.emit(resp);
          this.sweet.success(
            '¡Éxito!',
            'el producto se registró correctamente'
          );
        },
      }) */
    }

  }

  onProveedorSeleccionado(proveedorId: number) {
    this.LABORATORIOS_LIST = [];
    // Buscar el proveedor seleccionado en la lista de proveedores
    const proveedorSeleccionado = this.PROVEEDORES_LIST.find(p => p.id === proveedorId);

    // Si encuentra el proveedor, extrae sus laboratorios
    if (proveedorSeleccionado) {
        this.LABORATORIOS_LIST = proveedorSeleccionado.laboratorios;
        this.productForm.patchValue({
          laboratorio_id: []
        });
        this.callProductos()
    }
  }

  callProductos(){
    this.loadingProducts = true;
    this.PRODUCT_LIST = [];

    // Obtener los laboratorios seleccionados
    const laboratorioSeleccionado = this.productForm.value.laboratorio_id; 

    if (!laboratorioSeleccionado || laboratorioSeleccionado.length === 0) {
      this.loadingProducts = false;
      return;
    }

    const laboratorioIds = laboratorioSeleccionado
    .map((id:any) => this.LABORATORIOS_LIST.find(lab => lab.id === id)?.laboratorio_id)
    .filter((labId:any) => labId !== undefined); // Filtrar valores `undefined` por seguridad

    if (laboratorioIds.length === 0) {
      this.loadingProducts = false;
      return;
    }

    this.compraService.callProductsByLaboratorio(laboratorioIds).subscribe((resp: any) => {
      this.PRODUCT_LIST = resp.productos;
      this.loadingProducts = false;
      this.cacheImages()
    });
  }
  
  createLaboratorio(){
    const modalRef = this.modalService.open(CreateLaboratoriosComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermLaboratorio;
    modalRef.componentInstance.LaboratorioC.subscribe((r: any) => {
      this.LABORATORIOS_LIST = [r, ...this.LABORATORIOS_LIST];
      const laboratorio_id = this.productForm.get('laboratorio_id')?.value || [];
      this.productForm.patchValue({
        laboratorio_id: [r.id, ...laboratorio_id]
      });
      this.onProveedorSeleccionado(r.id)
    });
  }

  createProveedor(){
    const modalRef = this.modalService.open(CreateProveedorComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermProveedores;
    modalRef.componentInstance.ProveedorC.subscribe((r: any) => {
      this.PROVEEDORES_LIST = [r, ...this.PROVEEDORES_LIST];
      this.productForm.patchValue({ proveedor_id: r.id });
      this.productForm.patchValue({
        laboratorio_id: []
      });
    });
  }

  gestionarLaboratoriosProveedor(idProveedor:any){
    const modalRef = this.modalService.open(GestionarLaboratorioComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PROVEEDOR_ID = idProveedor
    modalRef.componentInstance.LIST_LABORATORIOS_ACTUALIZADO.subscribe((nuevaLista: any[]) => {
      if (Array.isArray(nuevaLista)) {
        const selectedIds: number[] = this.productForm.get('laboratorio_id')?.value || [];
  
        const mapActual = new Map(this.LABORATORIOS_LIST.map(lab => [lab.id, lab]));
        const mapNuevo = new Map(nuevaLista.map(lab => [lab.id, lab]));
  
        this.LABORATORIOS_LIST = this.LABORATORIOS_LIST.filter(lab => mapNuevo.has(lab.id));
  
        nuevaLista.forEach(lab => {
          if (!mapActual.has(lab.id)) {
            this.LABORATORIOS_LIST.push(lab);
          }
        });
  
        this.LABORATORIOS_LIST = this.LABORATORIOS_LIST.map(lab => 
          mapNuevo.has(lab.id) ? { ...mapNuevo.get(lab.id) } : lab
        );

        let updatedSelectedIds = selectedIds.filter(id => mapNuevo.has(id));

        nuevaLista.forEach(lab => {
          if (!selectedIds.includes(lab.id)) {
            updatedSelectedIds.push(lab.id);
          }
        });

        this.productForm.patchValue({ laboratorio_id: updatedSelectedIds });
      }
    });
  }

  createProducto(){
    const modalRef = this.modalService.open(CreateProductComponent,{centered:true, size: 'xl'})
    modalRef.componentInstance.ProductoC.subscribe((r:any)=>{
      this.PRODUCT_LIST = [r.data, ...this.PRODUCT_LIST];
      this.productForm.patchValue({ product_id: r.data.id })
    })
  }

  cacheImages() {
    this.PRODUCT_LIST.forEach(product => {
      if (!this.imageCache.has(product.id)) { // Solo cachear si no existe
        fetch(product.imagen)
          .then(response => response.blob())
          .then(blob => {
            // Liberar memoria de la imagen anterior si ya estaba cacheada
            if (this.imageCache.has(product.id)) {
              URL.revokeObjectURL(this.imageCache.get(product.id)!);
            }
  
            const objectURL = URL.createObjectURL(blob);
            this.imageCache.set(product.id, objectURL);
            product.cachedImage = objectURL;
          });
      } else {
        product.cachedImage = this.imageCache.get(product.id)!; // Usar imagen cacheada
      }
    });
  }
}
