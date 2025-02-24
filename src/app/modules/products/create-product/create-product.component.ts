import { CreatePresentacionesComponent } from './../../configuration/atributtes-products/presentaciones/create-presentaciones/create-presentaciones.component';
import { CreateCategoriasComponent } from './../../configuration/atributtes-products/categorias/create-categorias/create-categorias.component';
import { CreateFabricanteComponent } from './../../configuration/atributtes-products/fabricantes/create-fabricante/create-fabricante.component';
import { CreateLineasFarmaceuticasComponent } from './../../configuration/atributtes-products/lineas-farmaceuticas/create-lineas-farmaceuticas/create-lineas-farmaceuticas.component';
import { CreatePrincipioActivoComponent } from './../../configuration/atributtes-products/principios-activos/create-principio-activo/create-principio-activo.component';
import { CreateLaboratoriosComponent } from './../../configuration/atributtes-products/laboratorios/create-laboratorios/create-laboratorios.component';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../service/product.service';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { ImportExcelComponent } from 'src/app/components/import-excel/import-excel.component';
import { ModalCodigosDigemidComponent } from '../modal-codigos-digemid/modal-codigos-digemid.component';
import { CreateCondicionesAlmacenamientoComponent } from '../../configuration/atributtes-products/condiciones-almacenamiento/create-condiciones-almacenamiento/create-condiciones-almacenamiento.component';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {
  @Output() ProductoC:EventEmitter<any> = new EventEmitter();
  @Input() LABORATORIOS_SELECCIONADOS_POR_COMPRA:any = []
  @Input() isButtonVisible: boolean = true;
  productForm: FormGroup;

  LABORATORIOS:any[] = [];
  PRINCIPIOS_ACTIVOS:any[] = []
  LINEAS_FARMACEUTICAS:any[] = []
  FABRICANTES:any[] = []
  CATEGORIAS:any[] = []
  CONDICIONES_ALMACENAMIENTO:any[] = []
  UNIDADES:any[] = []
  PRESENTACIONES:any[] = []

  loading:boolean
  loading_sku:boolean

  searchTermLaboratorio: string = '';
  searchTermPrincipioActivo: string = '';
  searchTermLineaFarmaceutica: string = '';
  searchTermFabricante: string = '';
  searchTermPresentacion: string = '';
  searchTermCondicionAlmacenamiento: string = '';

  isSkuManual: boolean = false;
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
        if(this.LABORATORIOS_SELECCIONADOS_POR_COMPRA.length > 0){
          this.LABORATORIOS = this.LABORATORIOS_SELECCIONADOS_POR_COMPRA
        }else{
          this.LABORATORIOS = resp.laboratorios;
        }
        this.PRINCIPIOS_ACTIVOS = resp.principios_activos;
        this.LINEAS_FARMACEUTICAS = resp.lineas_farmaceuticas;
        this.FABRICANTES = resp.fabricantes;
        this.CATEGORIAS = resp.categorias;
        this.CONDICIONES_ALMACENAMIENTO = resp.condiciones_almacenamiento;
        this.UNIDADES = resp.unidades;
        this.PRESENTACIONES = resp.presentaciones;
        this.loading = false
    })

    this.productForm = this.fb.group({
      sku_manual: ['',[Validators.minLength(8), Validators.maxLength(8)]],
      tproducto:['1',[Validators.required]],
      codigobarra:[''],
      nombre: ['',[Validators.required]],
      caracteristicas:[''],
      descripcion:[''],
      registro_sanitario:[''],
      codigo_digemid:[{ value: '', disabled: true }],
      stock_seguridad:['10',[Validators.required]],
      sale_boleta:[0,[Validators.required]],
      maneja_escalas:[0,[Validators.required]],
      promocionable:[0,[Validators.required]],

      laboratorio_id:[null,[Validators.required]],
      principio_activo_id:[null],
      presentacion_id:[null],
      linea_farmaceutica_id:[null,[Validators.required]],
      fabricante_id:[null,[Validators.required]],
      cond_almac_id:[null],
      unidad_id:[1]
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

  onSearchPresentacion(event: any) {
    this.searchTermPresentacion = event.term;  // Acceder al término de búsqueda desde el evento
  }

  onSearchCondicionAlmacenamiento(event: any) {
    this.searchTermCondicionAlmacenamiento = event.term;  // Acceder al término de búsqueda desde el evento
  }

  importListadoDigemid(){
    const modalRef = this.modalService.open(ImportExcelComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nameModule = "listado digemid"
    modalRef.componentInstance.route = "/productos/import/externos/catalogo_digemid"
    modalRef.componentInstance.ImportExcelC.subscribe((r:any)=>{
      
    })
  }

  buscarCodigoDigemid(){
    const registroSanitario = this.productForm.get('registro_sanitario')?.value;

    const codigoLimpio = registroSanitario.replace(/[^a-zA-Z0-9]/g, '');

    this.productForm.patchValue({
      'codigo_digemid': ''
    })
    this.productService.obtenerCodigoDigemid(codigoLimpio).subscribe({
      next: (resp: any) => {
        if(resp.codigos.length > 0){
          const modalRef = this.modalService.open(ModalCodigosDigemidComponent,{centered:true, size: 'xl'})
          modalRef.componentInstance.CODIGOS_LIST = resp.codigos
          modalRef.componentInstance.CodigoS.subscribe((r:any)=>{
            this.productForm.patchValue({
              'codigo_digemid': r
            })
          })
        }else{
          this.sweet.success('Ups','Nose encontraron coincidencias en el catálogo digemid','/assets/animations/general/ojitos.json')
        }
      },
    })
  }

  resetCodigoDigemid(){
    this.productForm.patchValue({
      'codigo_digemid': ''
    })
  }

  // Enviar el formulario
  onSubmit() {
    if(this.isSkuManual && !this.productForm.get('sku_manual')?.value){
      this.sweet.formulario_invalido("Validacion","el sku es requerido");
      return false;
    }

    if (this.productForm.valid) {
      if(!this.isSkuManual){
        this.productForm.patchValue({
          sku_manual: null
        });
      }
      
      this.productService.registerProducto(this.productForm.value).subscribe({
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
            this.ProductoC.emit(resp);
            this.modal.close();
            this.sweet.success(
              '¡Éxito!',
              'el producto se registró correctamente'
            );
          }
        },
      })
    }

  }

  callCodigoProducto(ID_LAB:any){
    this.loading_sku = true
    this.productForm.get('sku_manual')?.disable();
    this.productService.obtenerRecursosParaCrear(ID_LAB).subscribe((resp: any) => {
      this.loading_sku = false
      this.productForm.get('sku_manual')?.enable();
      this.productForm.patchValue({
        sku_manual: resp.codigo
      });
      this.isSkuManual = false; 
      this.loading = false
    })
  }

  onSkuChange() {
    // Si el usuario cambia el SKU manualmente, marcamos como manual
    this.isSkuManual = true;
  }

  onLaboratorioChange() {
    this.productForm.patchValue({
      sku_manual: ''  // Limpiamos el valor de sku_manual
    });
    this.isSkuManual = true;  // Marcamos que el SKU es manual porque el usuario cambiará el laboratorio
  }
  
  createLaboratorio(){
    const modalRef = this.modalService.open(CreateLaboratoriosComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermLaboratorio;
    modalRef.componentInstance.LaboratorioC.subscribe((r: any) => {
      this.LABORATORIOS = [r, ...this.LABORATORIOS];
      this.productForm.patchValue({ laboratorio_id: r.id });
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

  createPresentacion(){
    const modalRef = this.modalService.open(CreatePresentacionesComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermPresentacion;
    modalRef.componentInstance.PresentacionC.subscribe((r:any)=>{
      this.PRESENTACIONES = [r, ...this.PRESENTACIONES];
      this.productForm.patchValue({ presentacion_id: r.id });
    })
  }

  createCondicionAlmacenamiento(){
    const modalRef = this.modalService.open(CreateCondicionesAlmacenamientoComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermCondicionAlmacenamiento;
    modalRef.componentInstance.CondicionC.subscribe((r:any)=>{
      this.CONDICIONES_ALMACENAMIENTO = [r, ...this.CONDICIONES_ALMACENAMIENTO];
      const condicion_id = this.productForm.get('cond_almac_id')?.value || [];
      this.productForm.patchValue({
        cond_almac_id: [r.id, ...condicion_id]
      });
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
