import { CreateCategoriasComponent } from './../../configuration/atributtes-products/categorias/create-categorias/create-categorias.component';
import { CreateFabricanteComponent } from './../../configuration/atributtes-products/fabricantes/create-fabricante/create-fabricante.component';
import { CreateLineasFarmaceuticasComponent } from './../../configuration/atributtes-products/lineas-farmaceuticas/create-lineas-farmaceuticas/create-lineas-farmaceuticas.component';
import { CreatePrincipioActivoComponent } from './../../configuration/atributtes-products/principios-activos/create-principio-activo/create-principio-activo.component';
import { CreateLaboratoriosComponent } from './../../configuration/atributtes-products/laboratorios/create-laboratorios/create-laboratorios.component';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../service/product.service';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {
  @Output() ProductoC:EventEmitter<any> = new EventEmitter();
  productForm: FormGroup;

  LABORATORIOS:any[] = [];
  PRINCIPIOS_ACTIVOS:any[] = []
  LINEAS_FARMACEUTICAS:any[] = []
  FABRICANTES:any[] = []
  CATEGORIAS:any[] = []
  CONDICIONES_ALMACENAMIENTO:any[] = []
  UNIDADES:any[] = []

  loading:boolean
  loading_sku:boolean

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
      sku_manual: ['',[Validators.minLength(8), Validators.maxLength(8)]],
      tproducto:['1',[Validators.required]],
      codigobarra:[''],
      nombre: ['',[Validators.required]],
      caracteristicas:[''],
      descripcion:[''],
      registro_sanitario:[''],
      codigo_digemid:[''],
      stock_seguridad:['10',[Validators.required]],
      sale_boleta:[0,[Validators.required]],
      maneja_lotes:[1,[Validators.required]],
      maneja_escalas:[0,[Validators.required]],
      promocionable:[0,[Validators.required]],

      laboratorio_id:[null,[Validators.required]],
      principio_activo_id:[null],
      linea_farmaceutica_id:[null,[Validators.required]],
      fabricante_id:[null,[Validators.required]],
      condiciones_almacenamiento_id:[null],
      unidad_id:[1]
    });
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

      const formData = new FormData();

      for (const key in this.productForm.value) {
        if (this.productForm.value[key]) {
          formData.append(key, this.productForm.value[key]);
        }
      }
      
      this.productService.registerProducto(formData).subscribe({
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
    this.productService.obtenerRecursosParaCrear(ID_LAB).subscribe((resp: any) => {
      this.loading_sku = false
      this.productForm.patchValue({
        sku_manual: resp.codigo
      });
      this.isSkuManual = false; 
      this.loading = false
      console.log(this.isSkuManual)
    })
  }

  onSkuChange() {
    // Si el usuario cambia el SKU manualmente, marcamos como manual
    this.isSkuManual = true;
    console.log(this.isSkuManual)
  }

  onLaboratorioChange() {
    this.productForm.patchValue({
      sku_manual: ''  // Limpiamos el valor de sku_manual
    });
    this.isSkuManual = true;  // Marcamos que el SKU es manual porque el usuario cambiará el laboratorio
    console.log(this.isSkuManual)
  }
  
  createLaboratorio(){
    const modalRef = this.modalService.open(CreateLaboratoriosComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.LaboratorioC.subscribe((r: any) => {
      this.LABORATORIOS = [r, ...this.LABORATORIOS];
      this.productForm.patchValue({ laboratorio_id: r.id });
    });
  }

  createPrincipioActivo(){
    const modalRef = this.modalService.open(CreatePrincipioActivoComponent,{centered:true, size: 'md'})
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
    modalRef.componentInstance.LineaFarmaceuticaC.subscribe((r:any)=>{
      this.LINEAS_FARMACEUTICAS = [r, ...this.LINEAS_FARMACEUTICAS];
      this.productForm.patchValue({ linea_farmaceutica_id: r.id });
    })
  }

  createFabricante(){
    const modalRef = this.modalService.open(CreateFabricanteComponent,{centered:true, size: 'md'})
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
