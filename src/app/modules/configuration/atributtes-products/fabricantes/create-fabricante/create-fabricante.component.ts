import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FabricantesService } from '../service/fabricantes.service';

@Component({
  selector: 'app-create-fabricante',
  templateUrl: './create-fabricante.component.html',
  styleUrls: ['./create-fabricante.component.scss']
})
export class CreateFabricanteComponent {
  @Output() FabricanteC: EventEmitter<any> = new EventEmitter();
  @Input() nombre_externo: any = '';
  PAISES:any[] = [];
  fabricanteForm: FormGroup;
    sweet:any = new SweetalertService
    imagen_previzualizade:any;
    file_name:any;
    loading: boolean = false;
  
    constructor(
      private fb: FormBuilder,
      public modal: NgbActiveModal,
      //llamamos al servicio
      public fabricanteService: FabricantesService
    ) {}
  
    ngOnInit(): void {
      this.loading = true;
      this.fabricanteForm = this.fb.group({
        nombre: [this.nombre_externo, [Validators.required]],
        pais: [null],
        imagen_fabricante_producto: [null]
      });

      this.fabricanteService.obtenerRecursos().subscribe((data: any) => {
        this.PAISES = data.nombres_paises;
        this.loading = false;
      });
    }
  
    onSubmit(): void {
      if (this.fabricanteForm.valid) {

        const formData = new FormData();

        for (const key in this.fabricanteForm.value) {
          if (this.fabricanteForm.value[key]) {
            formData.append(key, this.fabricanteForm.value[key]);
          }
        }

        this.fabricanteService.registerFabricante(formData).subscribe({
          next: (resp: any) => {
            // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
            if (resp.message == 409) {
              this.sweet.confirmar_restauracion('Atencion', resp.message_text);
              this.sweet
                .getRestauracionObservable()
                .subscribe((confirmed: boolean) => {
                  if (confirmed) {
                    this.restaurar(resp.fabricante);
                  }
                });
            } else {
              this.FabricanteC.emit(resp.fabricante);
              this.modal.close();
              this.sweet.success(
                '¡Éxito!',
                'el fabricante se registró correctamente'
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
    this.fabricanteService.restaurarFabricante(prov).subscribe({
      next: (resp: any) => {
        this.FabricanteC.emit(resp.fabricante_restaurado);
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
    this.fabricanteForm.patchValue({
      imagen_fabricante_producto: this.file_name // Esta es la variable interna que contiene el archivo
    });
    
    // Leer y previsualizar la imagen (esto se mantiene igual)
    const reader = new FileReader();
    reader.readAsDataURL(this.file_name);
    reader.onloadend = () => (this.imagen_previzualizade = reader.result);
  }
}
