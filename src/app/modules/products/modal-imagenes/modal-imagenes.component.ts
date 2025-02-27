import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  images:any = []
  
  imagenForm: FormGroup;
  sweet:any = new SweetalertService

  imageSrc: string | ArrayBuffer | null = null;
  // Definimos la estructura para las imágenes extra
  imageSrc1: { id: number | null, image: string | ArrayBuffer | null } = { id: null, image: null };
  imageSrc2: { id: number | null, image: string | ArrayBuffer | null } = { id: null, image: null };
  imageSrc3: { id: number | null, image: string | ArrayBuffer | null } = { id: null, image: null };


  extraImageIds:any = []

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    //llamamos al servicio
    public productoService: ProductService
  ) {}

  ngOnInit(): void {
    this.imagenForm = this.fb.group({
      mainImage: [null],
      image1: [null],
      image2: [null],
      image3: [null]
    });

    this.productoService.get_images_extra(this.PRODUCT.id).subscribe({
      next: (resp:any) => {
        this.images = resp.images;
        console.log(this.images)
        this.imageSrc = this.PRODUCT.imagen
        this.imageSrc1 = this.images.length > 0 ? { id: this.images[0].id, image: this.images[0].image } : { id: null, image: null };
        this.imageSrc2 = this.images.length > 1 ? { id: this.images[1].id, image: this.images[1].image } : { id: null, image: null };
        this.imageSrc3 = this.images.length > 2 ? { id: this.images[2].id, image: this.images[2].image } : { id: null, image: null };
      }
    });
  }

  onSubmit(): void {
    if (this.imagenForm.invalid) {
      this.sweet.formulario_invalido(
        'Validacion',
        'Existen errores en tu formulario'
      );
      return;
    }

    if(!this.imageSrc){
      this.sweet.formulario_invalido(
        'Validacion',
        'la imagen principal es obligatoria'
      );
      return;
    }

    const formData = new FormData();

    const mainImage = this.imagenForm.get('mainImage')?.value;
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }

    const extraImages = [
      {
        image: this.imagenForm.get('image1')?.value || this.imageSrc1.image,
        id: this.imageSrc1.id
      },
      {
        image: this.imagenForm.get('image2')?.value || this.imageSrc2.image,
        id: this.imageSrc2.id
      },
      {
        image: this.imagenForm.get('image3')?.value || this.imageSrc3.image,
        id: this.imageSrc3.id
      }
    ];

    extraImages.forEach((image, index) => {
      // Verificar que tanto el id como la imagen no sean null
      if (image.id) {
        formData.append(`imagenes_extra[${index}]`, image.image);
        formData.append(`imagenes_extra_ids[${index}]`, image.id.toString());
      } else if (!image.id && image.image !== null) {
        // Si no tiene un id pero tiene una imagen (nuevo archivo)
        formData.append(`imagenes_extra[${index}]`, image.image);
        formData.append(`imagenes_extra_ids[${index}]`, ''); // Dejar el id vacío para nuevos registros
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
          this.imageSrc1.image = reader.result;
          this.imagenForm.patchValue({
            image1: file
          });
          break
        case 'image2':
          this.imageSrc2.image = reader.result;
          this.imagenForm.patchValue({
            image2: file
          });
          break
        case 'image3':
          this.imageSrc3.image = reader.result;
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
        this.imageSrc = '';
        this.imagenForm.patchValue({
          mainImage: ''
        });
        break
      case 'image1':
        this.imageSrc1.image = '';
        this.imagenForm.patchValue({
          image1: ''
        });
        break
      case 'image2':
        this.imageSrc2.image = '';
        this.imagenForm.patchValue({
          image2: ''
        });
        break
      case 'image3':
        this.imageSrc3.image = '';
        this.imagenForm.patchValue({
          image3: ''
        });
        break
    }
  }
}
