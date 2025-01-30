import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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

  CATEGORIAS:[]
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
    //llamamos al servicio
    public clienteSucursalService: ProductService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: [''],
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
}
