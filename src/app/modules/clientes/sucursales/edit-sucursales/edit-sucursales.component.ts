import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { SucursalClienteService } from '../service/sucursalCliente.service';

@Component({
  selector: 'app-edit-sucursales',
  templateUrl: './edit-sucursales.component.html',
  styleUrls: ['./edit-sucursales.component.scss']
})
export class EditSucursalesComponent {
  @Output() ClienteSucursalE: EventEmitter<any> = new EventEmitter();
  @Input() CLIENTE_SUCURSAL_SELECTED: any = [];
  clienteSucursalForm: FormGroup;
  sweet:any = new SweetalertService
  DISTRITOS:any[] = [];
  CATEGORIAS_DIGEMID:any[] = [];
  ESTADOS_DIGEMID:any[] = [];

  nregistroDigemid:boolean = false
  nombreComercial:boolean = false
  seccionDni:boolean = false
  categoriaDigemid:boolean = false
  seccion_detalles:boolean = false

  estado_digemid:number
  correo_obligatorio:boolean = false
  actaDeInspeccion:boolean = false
  extraerDniRuc:boolean = false

  imagen_previzualizade:any;
  imagen_previzualizade_inspeccion:any;
  file_name:any
  tomar_foto: boolean = true
  tomar_foto_inspeccion: boolean = true

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    //llamamos al servicio
    public clienteSucursalService: SucursalClienteService
  ) {}

  ngOnInit(): void {
    this.ajustarFormularioInicio(this.CLIENTE_SUCURSAL_SELECTED.estado_digemid);
    this.clienteSucursalService.obtenerRecursosParaEditar(this.CLIENTE_SUCURSAL_SELECTED.id).subscribe((data: any) => {
      this.DISTRITOS = data.distritos;
      this.CATEGORIAS_DIGEMID = data.categorias_digemid;
      this.ESTADOS_DIGEMID = data.estados_digemid;
    });

    this.clienteSucursalForm = this.fb.group({
      ruc: [this.CLIENTE_SUCURSAL_SELECTED.ruc,
        [Validators.required, Validators.minLength(11), Validators.maxLength(11)]
      ],
      ruc_id: [this.CLIENTE_SUCURSAL_SELECTED.ruc_id],
      razon_social: [this.CLIENTE_SUCURSAL_SELECTED.razon_social, [Validators.required]],
      nombre_comercial: [this.CLIENTE_SUCURSAL_SELECTED.nombre_comercial, [Validators.required]],
      dni: [this.CLIENTE_SUCURSAL_SELECTED.dni ? this.CLIENTE_SUCURSAL_SELECTED.dni.numero : null],
      nombre_dni: [this.CLIENTE_SUCURSAL_SELECTED.dni ? this.CLIENTE_SUCURSAL_SELECTED.dni.nombre_dni : null],
      dni_id: [this.CLIENTE_SUCURSAL_SELECTED.dni ? this.CLIENTE_SUCURSAL_SELECTED.dni.dni_id : null],
      direccion: [this.CLIENTE_SUCURSAL_SELECTED.direccion, [Validators.required]],
      distrito: [this.CLIENTE_SUCURSAL_SELECTED.distrito_id,[Validators.required]],
      categoria_digemid: [ this.CLIENTE_SUCURSAL_SELECTED.categoria_digemid_id],
      estado_digemid: [this.CLIENTE_SUCURSAL_SELECTED.estado_digemid, [Validators.required]],
      nregistro: [this.CLIENTE_SUCURSAL_SELECTED.nregistro],
      nregistro_id: [this.CLIENTE_SUCURSAL_SELECTED.nregistro_id],
      image: [null],
      documento_en_proceso: [null],
    });
    
    if(this.CLIENTE_SUCURSAL_SELECTED.image ){
      this.imagen_previzualizade = this.CLIENTE_SUCURSAL_SELECTED.image
      this.tomar_foto = false
    }

    if(this.CLIENTE_SUCURSAL_SELECTED.documento_en_proceso ){
      this.imagen_previzualizade_inspeccion = this.CLIENTE_SUCURSAL_SELECTED.documento_en_proceso
      this.tomar_foto_inspeccion = false
    }

    this.imagen_previzualizade_inspeccion = this.CLIENTE_SUCURSAL_SELECTED.documento_en_proceso

    this.clienteSucursalForm.get('estado_digemid')?.valueChanges.subscribe((estado: number) => {
      this.ajustarFormulario(estado);
    });

    this.clienteSucursalForm.get('ruc')?.valueChanges.subscribe((newValue) => {
      this.clienteSucursalForm.get('razon_social')?.setValue('');
    });

    this.clienteSucursalForm.get('dni')?.valueChanges.subscribe((newValue) => {
      this.clienteSucursalForm.get('nombre_dni')?.setValue('');
    });

    this.clienteSucursalForm.get('image')?.valueChanges.subscribe((newValue) => {
      if (newValue) {
        this.tomar_foto = false;
      } 
    });

    this.clienteSucursalForm.get('documento_en_proceso')?.valueChanges.subscribe((newValue) => {
      if (newValue) {
        this.tomar_foto_inspeccion = false;
      } 
    });

    this.clienteSucursalForm.get('ruc')?.valueChanges.subscribe((newValue) => {
      if (newValue && newValue.length === 11 && newValue.startsWith('10')) {
        this.extraerDniRuc = true;
      } else {
        this.extraerDniRuc = false;
      }
    });
  }

  eliminarImagen(): void {
    this.imagen_previzualizade = null;
    this.tomar_foto = true;
    this.clienteSucursalForm.patchValue({
      image: null
    });
  }

  eliminarImagenActa(): void {
    this.imagen_previzualizade_inspeccion = null;
    this.tomar_foto_inspeccion = true;
    this.clienteSucursalForm.patchValue({
      documento_en_proceso: null
    });
  }

  ajustarFormularioInicio(estado: number){
    estado = Number(estado);
    this.seccion_detalles = true;

    switch (estado) {
      case 1: // Estado Activo
        this.nregistroDigemid = true;
        this.nombreComercial = true;
        this.categoriaDigemid = true;
        break;
      case 2: // Cierre temporal
        this.nregistroDigemid = true;
        this.nombreComercial = true;
        this.seccionDni = true;
        this.categoriaDigemid = true;
        break;

      case 3: // Cierre definitivo
        this.nregistroDigemid = true;
        this.nombreComercial = true;
        this.seccionDni = true;
        this.categoriaDigemid = true;
        break;
      case 4: // Sin registro Digemid
        this.nombreComercial = true;
        this.seccionDni = true;
        this.categoriaDigemid = true;
        break;
      case 5: // Persona Natural
        this.seccionDni = true;
        break;

      case 6: // En proceso
        this.nombreComercial = true;
        this.categoriaDigemid = true;
        this.actaDeInspeccion = true;
        break;
    }
  }

  ajustarFormulario(estado: number) {
    // Forzar mostrar las secciones por depuración
    this.seccion_detalles = true;
    this.nregistroDigemid = false;
    this.nombreComercial = false;
    this.seccionDni = false;
    this.categoriaDigemid = false;
    this.actaDeInspeccion = false;

    this.clienteSucursalForm.get('dni')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
    this.clienteSucursalForm.get('nombre_dni')?.setValidators([Validators.required]);
    this.clienteSucursalForm.get('nombre_comercial')?.setValidators([Validators.required]);
    this.clienteSucursalForm.get('nregistro')?.setValidators([Validators.required, Validators.minLength(7), Validators.maxLength(7)]);
    
    estado = Number(estado);

    switch (estado) {
      case 1: // Estado Activo
        this.nregistroDigemid = true;
        this.nombreComercial = true;
        this.categoriaDigemid = true;
        this.clienteSucursalForm.get('dni')?.clearValidators();
        this.clienteSucursalForm.get('nombre_dni')?.clearValidators();

        this.clienteSucursalForm.get('dni')?.reset();
        this.clienteSucursalForm.get('nombre_dni')?.reset();
        this.clienteSucursalForm.get('documento_en_proceso')?.reset();
        this.imagen_previzualizade_inspeccion = null;

        this.resetearValoresFormulario();
        break;
      case 2: // Cierre temporal
        this.nregistroDigemid = true;
        this.nombreComercial = true;
        this.seccionDni = true;
        this.categoriaDigemid = true;
        this.extraerDniRuc = true;

        this.clienteSucursalForm.get('dni')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
        this.clienteSucursalForm.get('nombre_dni')?.setValidators([Validators.required]);
        this.clienteSucursalForm.get('documento_en_proceso')?.reset();
        this.imagen_previzualizade_inspeccion = null;

        this.resetearValoresFormulario();
        this.ajustarBotonExtraerDni();
        break;

      case 3: // Cierre definitivo
        this.nregistroDigemid = true;
        this.nombreComercial = true;
        this.seccionDni = true;
        this.categoriaDigemid = true;
        this.extraerDniRuc = true;

        this.clienteSucursalForm.get('dni')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
        this.clienteSucursalForm.get('nombre_dni')?.setValidators([Validators.required]);
        this.clienteSucursalForm.get('documento_en_proceso')?.reset();
        this.imagen_previzualizade_inspeccion = null;

        this.resetearValoresFormulario();
        this.ajustarBotonExtraerDni();
        break;
      case 4: // Sin registro Digemid
        this.nombreComercial = true;
        this.seccionDni = true;
        this.categoriaDigemid = true;

        this.clienteSucursalForm.get('nregistro')?.clearValidators();
        this.clienteSucursalForm.get('dni')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
        this.clienteSucursalForm.get('nombre_dni')?.setValidators([Validators.required]);

        this.clienteSucursalForm.get('nregistro')?.reset();
        this.clienteSucursalForm.get('documento_en_proceso')?.reset();
        this.imagen_previzualizade_inspeccion = null;
    
        this.resetearValoresFormulario();
        this.ajustarBotonExtraerDni();
        break;
      case 5: // Persona Natural
        this.seccionDni = true;
        this.clienteSucursalForm.get('nregistro')?.clearValidators();
        this.clienteSucursalForm.get('nombre_comercial')?.clearValidators();
        this.clienteSucursalForm.get('dni')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
        this.clienteSucursalForm.get('nombre_dni')?.setValidators([Validators.required]);
        this.clienteSucursalForm.get('categoria_digemid')?.clearValidators();

        this.clienteSucursalForm.get('nombre_comercial')?.reset();
        this.clienteSucursalForm.get('nregistro')?.reset();
        this.clienteSucursalForm.get('categoria_digemid')?.reset('');
        this.clienteSucursalForm.get('documento_en_proceso')?.reset();
        this.imagen_previzualizade_inspeccion = null;

        this.resetearValoresFormulario();
        this.ajustarBotonExtraerDni();
        break;

      case 6: // En proceso
        this.nombreComercial = true;
        this.categoriaDigemid = true;
        this.actaDeInspeccion = true;
        this.clienteSucursalForm.get('nregistro')?.clearValidators();
        this.clienteSucursalForm.get('dni')?.clearValidators();
        this.clienteSucursalForm.get('nombre_dni')?.clearValidators();
        this.clienteSucursalForm.get('documento_en_proceso')?.setValidators([Validators.required]);

        this.clienteSucursalForm.get('dni')?.reset();
        this.clienteSucursalForm.get('nombre_dni')?.reset();
        this.clienteSucursalForm.get('nregistro')?.reset();
        this.imagen_previzualizade_inspeccion = this.CLIENTE_SUCURSAL_SELECTED.documento_en_proceso;
        this.clienteSucursalForm.get('documento_en_proceso')?.reset(this.CLIENTE_SUCURSAL_SELECTED.documento_en_proceso);

        this.resetearValoresFormulario();
        break;
    }
  }

  ajustarBotonExtraerDni() {
    let ruc_evaluado: string = this.clienteSucursalForm.get('ruc')?.value;
    if (ruc_evaluado && ruc_evaluado.length === 11 && ruc_evaluado.startsWith('10')) {
      this.extraerDniRuc = true;
    } else {
      this.extraerDniRuc = false;
    }
  }

  resetearValoresFormulario(){
    this.clienteSucursalForm.get('nregistro')?.updateValueAndValidity();
    this.clienteSucursalForm.get('nombre_comercial')?.updateValueAndValidity();
    this.clienteSucursalForm.get('dni')?.updateValueAndValidity();
    this.clienteSucursalForm.get('nombre_dni')?.updateValueAndValidity();
    this.clienteSucursalForm.get('categoria_digemid')?.updateValueAndValidity();
    this.clienteSucursalForm.get('documento_en_proceso')?.updateValueAndValidity();
  }
  

  onSubmit() {
    if (this.clienteSucursalForm.invalid) {
    
      // Iterar sobre los controles del formulario
      for (const controlName in this.clienteSucursalForm.controls) {
        if (this.clienteSucursalForm.controls.hasOwnProperty(controlName)) {
          const control = this.clienteSucursalForm.controls[controlName];
    
          // Verificar si el control tiene errores
          if (control.errors) {
            console.log(`Errores en el campo "${controlName}":`, control.errors);
          }
        }
      }
    
      return;
    }

    const formData = new(FormData);
    for (const key in this.clienteSucursalForm.value) {
      if (this.clienteSucursalForm.value[key]) {
        formData.append(key, this.clienteSucursalForm.value[key]);
      }
    }
    
    this.clienteSucursalService.updateSucursalCliente(this.CLIENTE_SUCURSAL_SELECTED.id,formData).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if (resp.message == 409) {
          this.sweet.alert('Atencion', resp.message_text);
        } else {
          this.ClienteSucursalE.emit(resp.cliente_sucursal);
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

  extraerDni(){
    const ruc = this.clienteSucursalForm.get('ruc')?.value; // Obtener el valor del campo RUC
    const dni = ruc.substring(2, 10); // Extraer desde el tercer carácter (índice 2) hasta el décimo (índice 10)
    this.clienteSucursalForm.get('dni')?.setValue(dni);
    this.buscarNombreDni()
  }

  abrirEnlace() {
    const ruc = this.clienteSucursalForm.get('ruc')?.value;
    navigator.clipboard.writeText(ruc).then(() => {
      window.open('https://serviciosweb-digemid.minsa.gob.pe/Consultas/Establecimientos', '_blank');
    })
  }

  abrirSelectorDeFoto(id:string) {
    const fileInput = document.getElementById(id) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
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
  
    // Asignar el archivo seleccionado
    this.file_name = file;

    if (file) {
      this.clienteSucursalForm.patchValue({
        image: this.file_name // Aquí guardas el archivo en el formulario
      });
    }
  
    // Leer y previsualizar la imagen
    const reader = new FileReader();
    reader.onload = () => {
      this.imagen_previzualizade = reader.result; // Asignar la imagen previsualizada
    };
    reader.onerror = () => {
      this.sweet.formulario_invalido("Error", "No se pudo leer el archivo. Por favor, inténtalo de nuevo.");
    };
    reader.readAsDataURL(file);
  }

  processFileActa(event: any): void {
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
  
    // Asignar el archivo seleccionado
    this.file_name = file;

    if (file) {
      this.clienteSucursalForm.patchValue({
        documento_en_proceso: this.file_name // Aquí guardas el archivo en el formulario
      });
    }
  
    // Leer y previsualizar la imagen
    const reader = new FileReader();
    reader.onload = () => {
      this.imagen_previzualizade_inspeccion = reader.result; // Asignar la imagen previsualizada
    };
    reader.onerror = () => {
      this.sweet.formulario_invalido("Error", "No se pudo leer el archivo. Por favor, inténtalo de nuevo.");
    };
    reader.readAsDataURL(file);
  }
}
