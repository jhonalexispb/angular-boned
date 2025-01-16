import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CategoriasServiceService } from '../service/categorias-service.service';

@Component({
  selector: 'app-edit-categorias',
  templateUrl: './edit-categorias.component.html',
  styleUrls: ['./edit-categorias.component.scss'],
})
export class EditCategoriasComponent {
  @Output() CategoriaE: EventEmitter<any> = new EventEmitter();
  @Input() CATEGORIA_SELECTED: any = [];
  name: string = '';
  file_name: any;
  imagen_previzualizade: any;
  state: string;

  sweet: any = new SweetalertService();

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public categoriaService: CategoriasServiceService
  ) {}

  ngOnInit(): void {
    (this.name = this.CATEGORIA_SELECTED.name),
      (this.file_name = this.CATEGORIA_SELECTED.image),
      (this.state = this.CATEGORIA_SELECTED.state),
      (this.imagen_previzualizade = this.CATEGORIA_SELECTED.image);
  }

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
    formData.append('state', this.state.toString());

    this.categoriaService
      .updateCategoria(this.CATEGORIA_SELECTED.id, formData)
      .subscribe({
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
            this.CategoriaE.emit({
              categoria: resp.categoria,
              isRestored: false,
            });
            this.modal.close();
            this.sweet.success(
              '¡Éxito!',
              'la categoria se actualizo correctamente'
            );
          }
        },
      });
  }

  restaurar(cat: any) {
    this.categoriaService.restaurarCategoria(cat).subscribe({
      next: (resp: any) => {
        this.CategoriaE.emit({
          categoria: resp.categoria_restaurada,
          isRestored: true,
        });
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
