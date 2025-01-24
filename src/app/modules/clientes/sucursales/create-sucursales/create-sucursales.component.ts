import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { SucursalClienteService } from '../service/sucursalCliente.service';
import * as L from 'leaflet';

L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl: 'assets/images/marker-icon-2x.png',
  iconUrl: 'assets/images/marker-icon.png',
  shadowUrl: 'assets/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

@Component({
  selector: 'app-create-sucursales',
  templateUrl: './create-sucursales.component.html',
  styleUrls: ['./create-sucursales.component.scss']
})
export class CreateSucursalesComponent implements OnInit {
  @Output() ClienteSucursalC: EventEmitter<any> = new EventEmitter();
  
    clienteSucursalForm: FormGroup;
    errorUbicacion: string | null = null;
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
    extraerDniRuc:boolean = false
    imagen_previzualizade:any;
    file_name:any
    map: any;
    marker: any;
    vista_mapa: boolean = false
    tomar_foto: boolean = true
    capturar_coordenadas_al_abrir = false
  
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
        this.ESTADOS_DIGEMID = data.estados_digemid;
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
        //Por el momento celular y correo no van a ser obligatorios
        celular: ['', [Validators.minLength(9), Validators.maxLength(9)]],
        correo: ['', [Validators.email]],
        distrito: [null,[Validators.required]],
        categoria_digemid: [ '',[Validators.required]],
        estado_digemid: ['', [Validators.required]],
        nregistro: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
        latitud: [''],
        longitud: [''],
        imagen: [null] 
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

      this.clienteSucursalForm.get('imagen')?.valueChanges.subscribe((newValue) => {
        if (newValue) {
          this.tomar_foto = false;
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

    obtenerUbicacion() {
      if (!navigator.geolocation) {
        this.errorUbicacion = 'La geolocalización no es soportada por tu navegador.';
        return;
      }

      this.vista_mapa = true
  
      this.errorUbicacion = 'Obteniendo ubicación, por favor espera...';
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(6));
          const lng = parseFloat(position.coords.longitude.toFixed(6));
  
          this.clienteSucursalForm.patchValue({
            latitud: lat,
            longitud: lng,
          });

          if (!this.map) {
            // Inicializar el mapa solo si no está creado
            this.map = L.map('map').setView([lat, lng], 13); // Convertir lat, lng a string
            // Cargar capa base de OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
            }).addTo(this.map);
          }
      
          // Agregar marcador inicial al mapa
          if (!this.marker) {
            // Agregar marcador solo si no está creado
            this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
          } else {
            // Si el marcador ya existe, actualizar su posición
            this.marker.setLatLng([lat, lng]);
          }
      
          // Actualizar campos del formulario al mover el marcador
          this.marker.on('dragend', (event: any) => {
            const position = event.target.getLatLng();
            this.clienteSucursalForm.patchValue({
              latitud: position.lat.toFixed(6),
              longitud: position.lng.toFixed(6),
            });
          });

          this.map.setView([lat, lng], 13);
          this.errorUbicacion = null; // Limpiar errores
        },
        (error) => {
          this.errorUbicacion = this.getErrorMessage(error.code);
        }
      );
    }

    borrarUbicacion() {
      if (this.map) {
        // Eliminar el marcador si existe
        if (this.marker) {
          this.map.removeLayer(this.marker);
          this.marker = null;
        }
    
        this.map.remove();
        this.map = null;
      }
    
      this.clienteSucursalForm.patchValue({
        latitud: null,
        longitud: null,
      });
    
      this.vista_mapa = false;
      this.errorUbicacion = null;
    }

    eliminarImagen(): void {
      this.imagen_previzualizade = null;
      this.tomar_foto = true;
      this.clienteSucursalForm.patchValue({
        foto: null
      });
    }

    private getErrorMessage(code: number): string {
      switch (code) {
        case 1:
          return 'Permiso denegado. Por favor, habilita el acceso a la ubicación.';
        case 2:
          return 'Posición no disponible. Intenta nuevamente.';
        case 3:
          return 'Tiempo de espera agotado. Verifica tu conexión a Internet.';
        default:
          return 'Ocurrió un error desconocido al intentar obtener la ubicación.';
      }
    }

    ajustarFormulario(estado: number) {
      // Forzar mostrar las secciones por depuración
      this.seccion_detalles = true;
      this.nregistroDigemid = false;
      this.nombreComercial = false;
      this.seccionDni = false;
      this.categoriaDigemid = false;
      this.correo_obligatorio = false;

      if(this.capturar_coordenadas_al_abrir){
        this.obtenerUbicacion()
        this.capturar_coordenadas_al_abrir = false
      }

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
          this.correo_obligatorio = false;
          this.clienteSucursalForm.get('correo')?.clearValidators();
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
      /* this.clienteSucursalForm.get('correo')?.updateValueAndValidity(); */
      this.clienteSucursalForm.get('nombre_comercial')?.updateValueAndValidity();
      this.clienteSucursalForm.get('dni')?.updateValueAndValidity();
      this.clienteSucursalForm.get('nombre_dni')?.updateValueAndValidity();
      this.clienteSucursalForm.get('categoria_digemid')?.updateValueAndValidity();
    }
    

    onSubmit() {
      if (this.clienteSucursalForm.invalid) {
        return;
      }

      console.log(this.clienteSucursalForm.value)
      
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

    abrirSelectorDeFoto() {
      const fileInput = document.getElementById('customFile') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  
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
          imagen: this.file_name // Aquí guardas el archivo en el formulario
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
}
