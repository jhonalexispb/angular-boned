import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCategoriasComponent } from '../../configuration/atributtes-products/categorias/create-categorias/create-categorias.component';
import { CreateFabricanteComponent } from '../../configuration/atributtes-products/fabricantes/create-fabricante/create-fabricante.component';
import { CreateLaboratoriosComponent } from '../../configuration/atributtes-products/laboratorios/create-laboratorios/create-laboratorios.component';
import { CreateLineasFarmaceuticasComponent } from '../../configuration/atributtes-products/lineas-farmaceuticas/create-lineas-farmaceuticas/create-lineas-farmaceuticas.component';
import { CreatePrincipioActivoComponent } from '../../configuration/atributtes-products/principios-activos/create-principio-activo/create-principio-activo.component';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {
  @Output() ProductoE:EventEmitter<any> = new EventEmitter();
  @Input() PRODUCT_SELECTED:any
  productForm: FormGroup;

  LABORATORIOS:any[] = [];
  PRINCIPIOS_ACTIVOS:any[] = []
  LINEAS_FARMACEUTICAS:any[] = []
  FABRICANTES:any[] = []
  CATEGORIAS:any[] = []
  CONDICIONES_ALMACENAMIENTO:any[] = []
  UNIDADES:any[] = []

  loading:boolean

  searchTermLaboratorio: string = '';
  searchTermPrincipioActivo: string = '';
  searchTermLineaFarmaceutica: string = '';
  searchTermFabricante: string = '';

  sweet:any = new SweetalertService

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    //llamamos al servicio
    public productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loading = true
    this.productService.obtenerRecursos().subscribe((resp: any) => {
        this.LABORATORIOS = resp.laboratorios;
        this.PRINCIPIOS_ACTIVOS = resp.principios_activos;
        this.LINEAS_FARMACEUTICAS = resp.lineas_farmaceuticas;
        this.FABRICANTES = resp.fabricantes;
        this.CATEGORIAS = resp.categorias;
        this.CONDICIONES_ALMACENAMIENTO = resp.condiciones_almacenamiento;
        this.UNIDADES = resp.unidades;
        this.loading = false
    })

    this.productForm = this.fb.group({
      sku_manual: [this.PRODUCT_SELECTED.sku,[Validators.minLength(8), Validators.maxLength(8), Validators.required]],
      tproducto:[this.PRODUCT_SELECTED.tproducto,[Validators.required]],
      codigobarra:[this.PRODUCT_SELECTED.codigobarra],
      nombre: [this.PRODUCT_SELECTED.nombre,[Validators.required]],
      caracteristicas:[this.PRODUCT_SELECTED.caracteristicas],
      descripcion:[this.PRODUCT_SELECTED.descripcion],
      registro_sanitario:[this.PRODUCT_SELECTED.registro_sanitario],
      codigo_digemid:[this.PRODUCT_SELECTED.codigo_digemid],
      stock_seguridad:[this.PRODUCT_SELECTED.stock_seguridad,[Validators.required]],
      sale_boleta:[this.PRODUCT_SELECTED.sale_boleta,[Validators.required]],
      maneja_lotes:[this.PRODUCT_SELECTED.maneja_lotes,[Validators.required]],
      maneja_escalas:[this.PRODUCT_SELECTED.maneja_escalas,[Validators.required]],
      promocionable:[this.PRODUCT_SELECTED.promocionable,[Validators.required]],

      laboratorio_id:[this.PRODUCT_SELECTED.laboratorio_id,[Validators.required]],
      principio_activo_id:[this.PRODUCT_SELECTED.principios_activos],
      linea_farmaceutica_id:[this.PRODUCT_SELECTED.linea_farmaceutica_id,[Validators.required]],
      fabricante_id:[this.PRODUCT_SELECTED.fabricante_id,[Validators.required]],
      condiciones_almacenamiento_id:[this.PRODUCT_SELECTED.condicion_almacenamiento],
      unidad_id:[this.PRODUCT_SELECTED.unidad_id]
    });
  }

  onSearchLineaFarmaceutica(event: any) {
    this.searchTermLineaFarmaceutica = event.term;  // Acceder al término de búsqueda desde el evento
  }

  onSearchLaboratorio(event: any) {
    this.searchTermLaboratorio = event.term;  // Acceder al término de búsqueda desde el evento
  }

  onSearchPrincipioActivo(event: any) {
    this.searchTermPrincipioActivo = event.term;  // Acceder al término de búsqueda desde el evento
  }

  onSearchFabricante(event: any) {
    this.searchTermFabricante = event.term;  // Acceder al término de búsqueda desde el evento
  }

  // Enviar el formulario
  onSubmit() {
    if (this.productForm.valid) {
      this.productService.updateProducto(this.PRODUCT_SELECTED.id,this.productForm.value).subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
          if (resp.message == 409) {
            this.sweet.confirmar_restauracion('Atencion', resp.message_text);
            this.sweet
              .getRestauracionObservable()
              .subscribe((confirmed: boolean) => {
                if (confirmed) {
                  this.restaurar(resp.producto);
                }
              });
          } else {
            console.log(resp)
            this.ProductoE.emit({producto:resp.producto, isRestored: false});
            this.modal.close();
            this.sweet.success(
              '¡Éxito!',
              'el producto se actualizo correctamente'
            );
          }
        },
      })
    }
  }
  
  createLaboratorio(){
    const modalRef = this.modalService.open(CreateLaboratoriosComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermLaboratorio;
    modalRef.componentInstance.LaboratorioC.subscribe((r: any) => {
      this.LABORATORIOS = [r, ...this.LABORATORIOS];
      this.productForm.patchValue({ laboratorio_id: r.id });
    });
  }

  onLaboratorioChange() {
    this.productForm.patchValue({
      sku_manual: ''  // Limpiamos el valor de sku_manual
    });
  }

  createPrincipioActivo(){
    const modalRef = this.modalService.open(CreatePrincipioActivoComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermPrincipioActivo;
    modalRef.componentInstance.PrincipioActivoC.subscribe((r:any)=>{
      this.PRINCIPIOS_ACTIVOS = [r, ...this.PRINCIPIOS_ACTIVOS];
      const principio_activo_id = this.productForm.get('principio_activo_id')?.value || [];
      this.productForm.patchValue({
        principio_activo_id: [r.id, ...principio_activo_id]
      });
    })
  }

  createLineaFarmaceutica(){
    const modalRef = this.modalService.open(CreateLineasFarmaceuticasComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermLineaFarmaceutica;
    modalRef.componentInstance.LineaFarmaceuticaC.subscribe((r:any)=>{
      this.LINEAS_FARMACEUTICAS = [r, ...this.LINEAS_FARMACEUTICAS];
      this.productForm.patchValue({ linea_farmaceutica_id: r.id });
    })
  }

  createFabricante(){
    const modalRef = this.modalService.open(CreateFabricanteComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermFabricante;
    modalRef.componentInstance.FabricanteC.subscribe((r:any)=>{
      this.FABRICANTES = [r, ...this.FABRICANTES];
      this.productForm.patchValue({ fabricante_id: r.id });
    })
  }

  createCategoria(){
    const modalRef = this.modalService.open(CreateCategoriasComponent,{centered:true, size: 'xl'})
    modalRef.componentInstance.CategoriaC.subscribe((r:any)=>{
      this.CATEGORIAS = [r, ...this.CATEGORIAS];
      this.productForm.patchValue({ categoria_id: r.id });
    })
  }

  restaurar(cat:any){
    /* this.ProveedorService.restaurarProveedor(cat).subscribe({
      next: (resp: any) => {
        this.ProveedorC.emit(resp.proveedor_restaurado);
        this.modal.close();
        this.sweet.success('¡Restaurado!', resp.message_text, '/assets/animations/general/restored.json');
      }
    }) */
  }
}
