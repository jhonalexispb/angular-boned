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
    nregistroDigemid:boolean = false
    nombreComercial:boolean = false
    seccionDni:boolean = false
    categoriaDigemid:boolean = false
    seccion_detalles:boolean = false
    estado_digemid:number
    correo_obligatorio:boolean = false
  
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
          [Validators.required, Validators.minLength(11), Validators.maxLength(11)]
        ],
        razon_social: ['', [Validators.required]],
        nombre_comercial: ['', [Validators.required]],
        dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        nombre_dni: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        celular: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        correo: ['', [Validators.required, Validators.email]],
        distrito: [null,[Validators.required]],
        categoria_digemid: [ '',[Validators.required]],
        estado_digemid: ['', [Validators.required]],
        nregistro: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
      });

      this.clienteSucursalForm.get('estado_digemid')?.valueChanges.subscribe((estado: number) => {
        this.ajustarFormulario(estado);
      });

      this.clienteSucursalForm.get('ruc')?.valueChanges.subscribe((newValue) => {
        this.clienteSucursalForm.get('razon_social')?.setValue('');
      });

      this.clienteSucursalForm.get('dni')?.valueChanges.subscribe((newValue) => {
        this.clienteSucursalForm.get('nombre_dni')?.setValue('');
      });
    }

    ajustarFormulario(estado: number) {
    
      // Forzar mostrar las secciones por depuración
      this.seccion_detalles = true;
      this.nregistroDigemid = false;
      this.nombreComercial = false;
      this.seccionDni = false;
      this.categoriaDigemid = false;
      this.correo_obligatorio = false;

      this.clienteSucursalForm.get('dni')?.reset();
      this.clienteSucursalForm.get('nombre_dni')?.reset();
      this.clienteSucursalForm.get('nombre_comercial')?.reset();
      this.clienteSucursalForm.get('nregistro')?.reset();
      this.clienteSucursalForm.get('categoria_digemid')?.reset('');

      this.clienteSucursalForm.get('dni')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
      this.clienteSucursalForm.get('nombre_dni')?.setValidators([Validators.required]);
      this.clienteSucursalForm.get('nombre_comercial')?.setValidators([Validators.required]);
      this.clienteSucursalForm.get('nregistro')?.setValidators([Validators.required, Validators.minLength(7), Validators.maxLength(7)]);
      this.clienteSucursalForm.get('correo')?.setValidators([Validators.required , Validators.email]);
      
      estado = Number(estado);

      switch (estado) {
        case 1: // Estado Activo
          this.nregistroDigemid = true;
          this.nombreComercial = true;
          this.categoriaDigemid = true;
          this.correo_obligatorio = true;

          this.clienteSucursalForm.get('dni')?.clearValidators();
          this.clienteSucursalForm.get('nombre_dni')?.clearValidators();

          this.resetearValoresFormulario();
          break;
        case 2: // Cierre temporal
          this.nregistroDigemid = true;
          this.nombreComercial = true;
          this.seccionDni = true;
          this.categoriaDigemid = true;

          this.clienteSucursalForm.get('correo')?.clearValidators();
          this.clienteSucursalForm.get('dni')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
          this.clienteSucursalForm.get('nombre_dni')?.setValidators([Validators.required]);

          this.resetearValoresFormulario();
          break;

        case 3: // Cierre definitivo
          this.nregistroDigemid = true;
          this.nombreComercial = true;
          this.seccionDni = true;
          this.categoriaDigemid = true;

          this.clienteSucursalForm.get('correo')?.clearValidators();
          this.clienteSucursalForm.get('dni')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
          this.clienteSucursalForm.get('nombre_dni')?.setValidators([Validators.required]);

          this.resetearValoresFormulario();
          break;
        case 4: // Sin registro Digemid
          this.nombreComercial = true;
          this.seccionDni = true;
          this.categoriaDigemid = true;

          this.clienteSucursalForm.get('nregistro')?.clearValidators();
          this.clienteSucursalForm.get('correo')?.clearValidators();
          this.clienteSucursalForm.get('dni')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
          this.clienteSucursalForm.get('nombre_dni')?.setValidators([Validators.required]);

          this.resetearValoresFormulario();
          break;
        case 5: // Persona Natural
          this.seccionDni = true;
          this.clienteSucursalForm.get('correo')?.reset();
          this.clienteSucursalForm.get('nregistro')?.clearValidators();
          this.clienteSucursalForm.get('correo')?.clearValidators();
          this.clienteSucursalForm.get('nombre_comercial')?.clearValidators();
          this.clienteSucursalForm.get('dni')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
          this.clienteSucursalForm.get('nombre_dni')?.setValidators([Validators.required]);
          this.clienteSucursalForm.get('categoria_digemid')?.clearValidators();

          this.resetearValoresFormulario();
          break;
      }
    }

    resetearValoresFormulario(){
      this.clienteSucursalForm.get('nregistro')?.updateValueAndValidity();
      this.clienteSucursalForm.get('correo')?.updateValueAndValidity();
      this.clienteSucursalForm.get('nombre_comercial')?.updateValueAndValidity();
      this.clienteSucursalForm.get('dni')?.updateValueAndValidity();
      this.clienteSucursalForm.get('nombre_dni')?.updateValueAndValidity();
      this.clienteSucursalForm.get('categoria_digemid')?.updateValueAndValidity();
    }
    

    onSubmit() {
      if (this.clienteSucursalForm.invalid) {
        return;
      }
      
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
            this.ClienteSucursalC.emit(resp.cliente_sucursal);
            this.modal.close();
            this.sweet.success(
              '¡Éxito!',
              'la sucursal se registró correctamente'
            );
          }
        },
      })
    }

    buscarRazonSocial() {
      this.clienteSucursalForm.get('razon_social')?.reset();
      this.clienteSucursalService.obtenerRazonSocial(this.clienteSucursalForm.get('ruc')?.value).subscribe({
        next: (resp: any) => {
          if(resp.message){
            this.sweet.success('¡Bien!',resp.message_text);
          } else{
            this.sweet.success('¡En efecto!',resp.message_text,'/assets/animations/general/ojitos.json');
          }
          this.clienteSucursalForm.get('razon_social')?.reset(resp.razonSocial);
        },
      })
    }

    buscarNombreDni(){
      this.clienteSucursalForm.get('nombre_dni')?.reset();
      this.clienteSucursalService.obtenerNombrePorDni(this.clienteSucursalForm.get('dni')?.value).subscribe({
        next: (resp: any) => {
          this.sweet.success('¡Bien!',resp.message_text);
          this.clienteSucursalForm.get('nombre_dni')?.reset(resp.nombre_dni);
        },
      })
    }

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
