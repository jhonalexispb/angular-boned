import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-modal-imagenes',
  templateUrl: './modal-imagenes.component.html',
  styleUrls: ['./modal-imagenes.component.scss']
})
export class ModalImagenesComponent {
  @Output() imagesU: EventEmitter<any> = new EventEmitter();
  @Input() PRODUCT:any;
  
  imagenForm: FormGroup;
  sweet:any = new SweetalertService

  imageSrc: string | ArrayBuffer | null = null;
  imageSrc1: string | ArrayBuffer | null = null;
  imageSrc2: string | ArrayBuffer | null = null;
  imageSrc3: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    //llamamos al servicio
    public productoService: ProductService
  ) {}

  ngOnInit(): void {
    console.log(this.PRODUCT)
    this.imagenForm = this.fb.group({
      mainImage: [null],
      image1: [null],
      image2: [null],
      image3: [null]
    });
    this.imageSrc = this.PRODUCT.imagen
  }

  onSubmit(): void {
    if (this.imagenForm.invalid) {
      this.sweet.formulario_invalido(
        'Validacion',
        'Existen errores en tu formulario'
      );
      return;
    }

    const formData = new FormData();

    const mainImage = this.imagenForm.get('mainImage')?.value;
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }

    const extraImages = [
      this.imagenForm.get('image1')?.value,
      this.imagenForm.get('image2')?.value,
      this.imagenForm.get('image3')?.value
    ]

    extraImages.forEach((image, index) => {
      if (image) {
        formData.append(`imagenes_extra[${index}]`, image);
      }
    });

    let isFormDataEmpty = true;

    formData.forEach((value, key) => {
      if (value) {
        isFormDataEmpty = false;
      }
    });

    if (isFormDataEmpty) {
      this.sweet.alerta(
        'Eyy!',
        'no has cargado ninguna imagen'
      );
      return;
    }

    this.productoService.updateImages(this.PRODUCT.id, formData).subscribe({
        next: (resp:any) => {
          this.imagesU.emit(resp.mainImage);
          this.modal.close();
          this.sweet.success(
            '¡Éxito!',
            'Las imagenes se subieron correctamente'
          );
        }
    });
    console.log('Contenido de FormData:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

  }

  onImageSelected(file: File,input:any): void {
    const reader = new FileReader();
    reader.onload = () => {
      switch(input){
        case 'main':
          this.imageSrc = reader.result;
          this.imagenForm.patchValue({
            mainImage: file
          });
          break
        case 'image1':
          this.imageSrc1 = reader.result;
          this.imagenForm.patchValue({
            image1: file
          });
          break
        case 'image2':
          this.imageSrc2 = reader.result;
          this.imagenForm.patchValue({
            image2: file
          });
          break
        case 'image3':
          this.imageSrc3 = reader.result;
          this.imagenForm.patchValue({
            image3: file
          });
          break
      }
    };
    reader.readAsDataURL(file);
  }

  onImageDeleted(input:any): void {
    switch(input){
      case 'main':
        this.imageSrc = null;
        this.imagenForm.patchValue({
          mainImage: null
        });
        break
      case 'image1':
        this.imageSrc1 = null;
        this.imagenForm.patchValue({
          image1: null
        });
        break
      case 'image2':
        this.imageSrc2 = null;
        this.imagenForm.patchValue({
          image2: null
        });
        break
      case 'image3':
        this.imageSrc3 = null;
        this.imagenForm.patchValue({
          image3: null
        });
        break
    }
  }
}
