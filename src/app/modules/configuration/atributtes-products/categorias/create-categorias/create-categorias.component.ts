import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CategoriasServiceService } from '../service/categorias-service.service';

@Component({
  selector: 'app-create-categorias',
  templateUrl: './create-categorias.component.html',
  styleUrls: ['./create-categorias.component.scss'],
})
export class CreateCategoriasComponent {
  @Output() CategoriaC: EventEmitter<any> = new EventEmitter();
  name: string = '';
  file_name: any;
  imagen_previzualizade: any;

  sweet: any = new SweetalertService();

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public categoriaService: CategoriasServiceService
  ) {}

  ngOnInit(): void {}

  store() {
    if (!this.name) {
      this.sweet.formulario_invalido(
        'Validacion',
        'el nombre de la categoria es requerida'
      );
      return false;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('image_categoria', this.file_name);

    this.categoriaService.registerCategoria(formData).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if (resp.message == 409) {
          this.sweet.confirmar_restauracion('Atencion', resp.message_text);
          this.sweet
            .getRestauracionObservable()
            .subscribe((confirmed: boolean) => {
              if (confirmed) {
                this.restaurar(resp.categoria);
              }
            });
        } else {
          this.CategoriaC.emit(resp.categoria);
          this.modal.close();
          this.sweet.success(
            '¡Éxito!',
            'la categoria se registró correctamente'
          );
        }
      },
    });
  }

  restaurar(prov: any) {
    this.categoriaService.restaurarCategoria(prov).subscribe({
      next: (resp: any) => {
        this.CategoriaC.emit(resp.categoria_restaurada);
        this.modal.close();
        this.sweet.success(
          '¡Restaurado!',
          resp.message_text,
          '/assets/animations/general/restored.json'
        );
      },
    });
  }

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.sweet.formulario_invalido(
        'Atención',
        'El archivo que seleccionaste no es una imagen'
      );
      return;
    }

    this.file_name = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_name);
    reader.onloadend = () => (this.imagen_previzualizade = reader.result);
  }
}
