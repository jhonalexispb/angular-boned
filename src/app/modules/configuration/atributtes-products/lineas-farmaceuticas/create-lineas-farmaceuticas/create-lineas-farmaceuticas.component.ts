import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { LineasFarmaceuticasService } from '../service/lineas-farmaceuticas.service';

@Component({
  selector: 'app-create-lineas-farmaceuticas',
  templateUrl: './create-lineas-farmaceuticas.component.html',
  styleUrls: ['./create-lineas-farmaceuticas.component.scss']
})
export class CreateLineasFarmaceuticasComponent {
  @Output() LineaFarmaceuticaC: EventEmitter<any> = new EventEmitter();
  lineaFarmaceuticaForm: FormGroup;
  sweet:any = new SweetalertService
  imagen_previzualizade:any;
  file_name:any;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    //llamamos al servicio
    public lineaFarmaceuticaService: LineasFarmaceuticasService
  ) {}

  ngOnInit(): void {
    this.lineaFarmaceuticaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      imagen_linea_farmaceutica: [null]
    });
  }

  onSubmit(): void {
    if (this.lineaFarmaceuticaForm.valid) {

      const formData = new FormData();

      for (const key in this.lineaFarmaceuticaForm.value) {
        if (this.lineaFarmaceuticaForm.value[key]) {
          formData.append(key, this.lineaFarmaceuticaForm.value[key]);
        }
      }

      this.lineaFarmaceuticaService.registerLineaFarmaceutica(formData).subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
          if (resp.message == 409) {
            this.sweet.confirmar_restauracion('Atencion', resp.message_text);
            this.sweet
              .getRestauracionObservable()
              .subscribe((confirmed: boolean) => {
                if (confirmed) {
                  this.restaurar(resp.linea_farmaceutica);
                }
              });
          } else {
            this.LineaFarmaceuticaC.emit(resp.linea_farmaceutica);
            this.modal.close();
            this.sweet.success(
              '¡Éxito!',
              'la linea farmaceutica se registró correctamente'
            );
          }
        },
      });
    } else {
      this.sweet.formulario_invalido(
        'Validacion',
        'Existen errores en tu formulario'
      );
    }
  }

  restaurar(prov: any) {
    this.lineaFarmaceuticaService.restaurarLineaFarmaceutica(prov).subscribe({
      next: (resp: any) => {
        this.LineaFarmaceuticaC.emit(resp.linea_farmaceutica_restaurada);
        this.modal.close();
        this.sweet.success(
          '¡Restaurado!',
          resp.message_text,
          '/assets/animations/general/restored.json'
        );
      },
    });
  }

  processFile(event: any): void {
    const file = event.target.files[0];
    
    // Verificar si existe un archivo
    if (!file) {
      this.sweet.formulario_invalido("Atención", "No se seleccionó ningún archivo.");
      return;
    }
    
    // Validar que sea una imagen
    if (file.type.indexOf("image") < 0) {
      this.sweet.formulario_invalido("Atención", "El archivo que seleccionaste no es una imagen.");
      return;
    }
    
    // Asignar el archivo seleccionado a una variable interna
    this.file_name = file;
  
    // Aquí, solo estamos almacenando el archivo en una variable del formulario, pero NO lo asignamos directamente al input de tipo file
    this.lineaFarmaceuticaForm.patchValue({
      imagen_linea_farmaceutica: this.file_name // Esta es la variable interna que contiene el archivo
    });
    
    // Leer y previsualizar la imagen (esto se mantiene igual)
    const reader = new FileReader();
    reader.readAsDataURL(this.file_name);
    reader.onloadend = () => (this.imagen_previzualizade = reader.result);
  }
}
