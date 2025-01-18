import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { SucursalClienteService } from '../service/sucursalCliente.service';

@Component({
  selector: 'app-create-sucursales',
  templateUrl: './create-sucursales.component.html',
  styleUrls: ['./create-sucursales.component.scss']
})
export class CreateSucursalesComponent {
  @Output() ClienteSucursalC: EventEmitter<any> = new EventEmitter();
  
    clienteSucursalForm: FormGroup;
    sweet:any = new SweetalertService
    DISTRITOS:any[] = [];
    CATEGORIAS_DIGEMID:any[] = [];
  
    constructor(
      private fb: FormBuilder,
      public modal: NgbActiveModal,
      //llamamos al servicio
      public clienteSucursalService: SucursalClienteService
    ) {}
  
    ngOnInit(): void {
      this.clienteSucursalService.obtenerRecursosParaCrear().subscribe((data: any) => {
        this.DISTRITOS = data.distritos;
        this.CATEGORIAS_DIGEMID = data.categorias_digemid;
      });


      this.clienteSucursalForm = this.fb.group({
        ruc: [
          '',
          [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^\d+$/)]
        ],
        razon_social: ['', [Validators.required]],
        nombre_comercial: ['', [Validators.required]],
        dni: ['', [Validators.required]],
        nombre_dni: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        celular: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        correo: ['', [Validators.required, Validators.email]],
        distrito: [[Validators.required]],
        categoria_digemid: [ [Validators.required]],
        estado_digemid: [ [Validators.required]],
        nregistro: ['', [Validators.required]],
      });

      this.clienteSucursalForm.get('estado_digemid')?.valueChanges.subscribe((estado) => {
        this.applyDynamicConditions(estado);
      });
    }

    applyDynamicConditions(estado: number): void {
      // Resetear los campos en cada cambio
      this.resetFieldVisibilityAndValidators();
  
      switch (estado) {
        case 1: // Estado activo
          this.clienteSucursalForm.get('dni')?.clearValidators();
          this.clienteSucursalForm.get('nombre_dni')?.clearValidators();
          this.clienteSucursalForm.get('dni')?.setValue('');
          this.clienteSucursalForm.get('nombre_dni')?.setValue('');
          break;
        case 2: // Cierre temporal
        case 3: // Cierre definitivo
          this.clienteSucursalForm.get('dni')?.setValidators([Validators.required]);
          this.clienteSucursalForm.get('nombre_dni')?.setValidators([Validators.required]);
          break;
        case 4: // Sin registro Digemid
          this.clienteSucursalForm.get('nregistro')?.clearValidators();
          this.clienteSucursalForm.get('categoria_digemid')?.clearValidators();
          this.clienteSucursalForm.get('nregistro')?.setValue('');
          this.clienteSucursalForm.get('categoria_digemid')?.setValue('');
          break;
        case 5: // Persona natural
          this.clienteSucursalForm.get('nregistro')?.clearValidators();
          this.clienteSucursalForm.get('nombre_comercial')?.clearValidators();
          this.clienteSucursalForm.get('categoria_digemid')?.clearValidators();
          this.clienteSucursalForm.get('correo')?.clearValidators();
          break;
      }
  
      // Aplicar validadores
      this.clienteSucursalForm.get('dni')?.updateValueAndValidity();
      this.clienteSucursalForm.get('nombre_dni')?.updateValueAndValidity();
      this.clienteSucursalForm.get('nregistro')?.updateValueAndValidity();
      this.clienteSucursalForm.get('categoria_digemid')?.updateValueAndValidity();
      this.clienteSucursalForm.get('nombre_comercial')?.updateValueAndValidity();
      this.clienteSucursalForm.get('correo')?.updateValueAndValidity();
    }

    resetFieldVisibilityAndValidators(): void {
      // Eliminar validadores de todos los campos
      this.clienteSucursalForm.get('dni')?.clearValidators();
      this.clienteSucursalForm.get('nombre_dni')?.clearValidators();
      this.clienteSucursalForm.get('nregistro')?.clearValidators();
      this.clienteSucursalForm.get('categoria_digemid')?.clearValidators();
      this.clienteSucursalForm.get('nombre_comercial')?.clearValidators();
      this.clienteSucursalForm.get('correo')?.clearValidators();
      
      // Limpiar los valores
      this.clienteSucursalForm.get('dni')?.setValue('');
      this.clienteSucursalForm.get('nombre_dni')?.setValue('');
      this.clienteSucursalForm.get('nregistro')?.setValue('');
      this.clienteSucursalForm.get('categoria_digemid')?.setValue('');
      this.clienteSucursalForm.get('nombre_comercial')?.setValue('');
      this.clienteSucursalForm.get('correo')?.setValue('');
    }
    

    /* onSubmit() {
      if (this.clienteSucursalForm.invalid) {
        return;
      }
      const formData = this.clienteSucursalForm.value;
      this.clienteSucursalService.submitFormulario(formData).subscribe(
        (response) => {
          this.sweet.success("Formulario enviado exitosamente");
        },
        (error) => {
          this.sweet.error("Hubo un error al enviar el formulario");
        }
      );
    } */

    /* onSubmit(): void {
      if (this.clienteSucursalForm.valid) {
        this.clienteSucursalService.registerSucursalCliente(this.clienteSucursalForm.value).subscribe({
          next: (resp: any) => {
            // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
            if (resp.message == 409) {
              this.sweet.confirmar_restauracion('Atencion', resp.message_text);
              this.sweet
                .getRestauracionObservable()
                .subscribe((confirmed: boolean) => {
                  if (confirmed) {
                    this.restaurar(resp.cliente);
                  }
                });
            } else {
              this.ClienteSucursalC.emit(resp.cliente);
              this.modal.close();
              this.sweet.success(
                '¡Éxito!',
                'el ruc se registró correctamente'
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
    } */
  
    restaurar(prov: any) {
      this.clienteSucursalService.restaurarSucursalCliente(prov).subscribe({
        next: (resp: any) => {
          this.ClienteSucursalC.emit(resp.cliente_restaurado);
          this.modal.close();
          this.sweet.success(
            '¡Restaurado!',
            resp.message_text,
            '/assets/animations/general/restored.json'
          );
        },
      });
    }

    
}
