import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateLaboratoriosComponent } from '../../configuration/atributtes-products/laboratorios/create-laboratorios/create-laboratorios.component';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { CreateProveedorComponent } from '../../configuration/proveedor/create-proveedor/create-proveedor.component';
import { CompraService } from '../service/compra.service';
import { EditProveedorComponent } from '../../configuration/proveedor/edit-proveedor/edit-proveedor.component';

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

  loading:boolean = true
  loadingProducts:boolean = true

  searchTermLaboratorio: string = '';
  searchTermProveedores: string = '';

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
      proveedor_id:[null,[Validators.required]],
      laboratorio_id:[null,[Validators.required]],
      producto_id:[null,[Validators.required]],
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

    this.compraService.callProductsByLaboratorio(laboratorioSeleccionado).subscribe((resp: any) => {
      this.PRODUCT_LIST = resp.productos;
      this.loadingProducts = false;
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
    });
  }

  createProveedor(){
    const modalRef = this.modalService.open(CreateProveedorComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermProveedores;
    modalRef.componentInstance.ProveedorC.subscribe((r: any) => {
      this.PROVEEDORES_LIST = [r, ...this.PROVEEDORES_LIST];
      this.productForm.patchValue({ proveedor_id: r.id });
    });
  }

  editProveedor(idProveedor:any){
    const modalRef = this.modalService.open(EditProveedorComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PROVEEDOR_SELECTED = idProveedor;
    modalRef.componentInstance.ProveedorE.subscribe((r: any) => {
      this.PROVEEDORES_LIST = [r, ...this.PROVEEDORES_LIST];
      this.productForm.patchValue({ proveedor_id: r.id });
    });
  }
}
