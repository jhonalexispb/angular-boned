import { CreateCategoriasComponent } from './../../configuration/atributtes-products/categorias/create-categorias/create-categorias.component';
import { CreateFabricanteComponent } from './../../configuration/atributtes-products/fabricantes/create-fabricante/create-fabricante.component';
import { CreateLineasFarmaceuticasComponent } from './../../configuration/atributtes-products/lineas-farmaceuticas/create-lineas-farmaceuticas/create-lineas-farmaceuticas.component';
import { CreatePrincipioActivoComponent } from './../../configuration/atributtes-products/principios-activos/create-principio-activo/create-principio-activo.component';
import { CreateLaboratoriosComponent } from './../../configuration/atributtes-products/laboratorios/create-laboratorios/create-laboratorios.component';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {

  productForm: FormGroup;
  mainImage: string | ArrayBuffer | null = null;
  secondaryImages: string[] = [];

  LABORATORIOS:any[] = [];
  PRINCIPIOS_ACTIVOS:any[] = []
  LINEAS_FARMACEUTICAS:any[] = []
  FABRICANTES:any[] = []
  CATEGORIAS:any[] = []
  CONDICIONES_ALMACENAMIENTO:any[] = []
  UNIDADES:any[] = []

  loading:boolean

  mainImageConfig = {
    url: 'https://httpbin.org/post',
    maxFilesize: 5,
    acceptedFiles: 'image/*',
    maxFiles: 1,
    useDropzoneClass: 'image-input-placeholder',
  };

  secondaryImagesConfig = {
    url: 'https://httpbin.org/post',
    maxFilesize: 5,
    acceptedFiles: 'image/*',
    maxFiles: 5,
  };

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
      productName: [''],
      laboratorio:[null]
    });
  }

  // Evento para manejar éxito de carga de la imagen principal
  onMainImageUploadSuccess(event: any): void {
    const file = event[0].dataURL;  // Obtener la URL de la imagen cargada
    this.mainImage = file;
  }

  // Evento para manejar error de carga de la imagen principal
  onMainImageUploadError(event: any): void {
    console.error('Error al cargar la imagen principal', event);
  }

  // Evento para manejar éxito de carga de imágenes secundarias
  onSecondaryImagesUploadSuccess(event: any): void {
    event.forEach((file: any) => {
      const fileURL = file.dataURL;
      this.secondaryImages.push(fileURL);
    });
  }

  // Evento para manejar error de carga de imágenes secundarias
  onSecondaryImagesUploadError(event: any): void {
    console.error('Error al cargar las imágenes secundarias', event);
  }

  // Enviar el formulario
  onSubmit(): void {
    if (this.productForm.valid) {
      console.log('Formulario enviado', this.productForm.value);
      console.log('Imagen principal', this.mainImage);
      console.log('Imágenes secundarias', this.secondaryImages);
    }
  }


  tab_selected:number = 1
  is_discount:number = 1
  

  selectedDiscount(a:number){
    this.is_discount = a
  }

  selectedTab(a:number){
    this.tab_selected = a
  }


  createLaboratorio(){
    const modalRef = this.modalService.open(CreateLaboratoriosComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.LaboratorioC.subscribe((r: any) => {
      this.LABORATORIOS = [r, ...this.LABORATORIOS];
      this.productForm.patchValue({ laboratorio: r.id });
    });
  }

  createPrincipioActivo(){
    const modalRef = this.modalService.open(CreatePrincipioActivoComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PrincipioActivoC.subscribe((r:any)=>{
      /* this.PRODUCT_LIST.unshift(r);  */
    })
  }

  createLineaFarmaceutica(){
    const modalRef = this.modalService.open(CreateLineasFarmaceuticasComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.LineaFarmaceuticaC.subscribe((r:any)=>{
      /* this.PRODUCT_LIST.unshift(r);  */
    })
  }

  createFabricante(){
    const modalRef = this.modalService.open(CreateFabricanteComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.FabricanteC.subscribe((r:any)=>{
      /* this.PRODUCT_LIST.unshift(r);  */
    })
  }

  createCategoria(){
    const modalRef = this.modalService.open(CreateCategoriasComponent,{centered:true, size: 'xl'})
    modalRef.componentInstance.CategoriaC.subscribe((r:any)=>{
      /* this.PRODUCT_LIST.unshift(r);  */
    })
  }
}
