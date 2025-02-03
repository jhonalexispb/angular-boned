import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { SucursalClienteService } from '../service/sucursalCliente.service';
import { ConfigDelayFormulario } from 'src/app/config/config';

@Component({
  selector: 'app-gestionar-sucursales',
  templateUrl: './gestionar-sucursales.component.html',
  styleUrls: ['./gestionar-sucursales.component.scss']
})
export class GestionarSucursalesComponent {
  @Output() ClienteGestionE: EventEmitter<any> = new EventEmitter();
  @Input() CLIENTE_SUCURSAL_TO_SELECTED: any = [];
  clienteGestionarSucursalForm: FormGroup;
  sweet:any = new SweetalertService
  T_FACTURACION:any[] = [];
  diasIniciales: number | null = null; 
  seccionCredito:boolean

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    //llamamos al servicio
    public clienteSucursalService: SucursalClienteService
  ) {}

  ngOnInit(): void {
    this.clienteGestionarSucursalForm = this.fb.group({
      formaPago: [null, [Validators.required]],
      dias: [null, [Validators.required]],
      modo_facturacion_id: [null, [Validators.required]],
      linea_credito: [this.CLIENTE_SUCURSAL_TO_SELECTED.linea_credito, [Validators.required, Validators.min(0)]],
    });

    setTimeout(() => {
      this.clienteSucursalService.obtenerRecursosParaGestionar(this.CLIENTE_SUCURSAL_TO_SELECTED.id).subscribe((data: any) => {
        this.T_FACTURACION = data.modos_facturacion;

        if(data.datos_sucursal.forma_pago == 2){
          this.seccionCredito = false;
        } else {
          this.seccionCredito = true;
        }

        this.actualizarModoFacturacionConDias(data.datos_sucursal.modo_facturacion, data.datos_sucursal.dias);

        this.diasIniciales = data.datos_sucursal.dias;

        this.clienteGestionarSucursalForm.get('formaPago')?.reset(data.datos_sucursal.forma_pago);
        this.clienteGestionarSucursalForm.get('dias')?.reset(data.datos_sucursal.dias);
        this.clienteGestionarSucursalForm.get('modo_facturacion_id')?.reset(data.datos_sucursal.modo_facturacion);

        this.clienteGestionarSucursalForm.get('modo_facturacion_id')?.valueChanges.subscribe((estado: number) => {
          this.actualizarDiasPorModoFacturacion(estado);
        });

        this.clienteGestionarSucursalForm.get('formaPago')?.valueChanges.subscribe((estado: number) => {
          if (estado == 2) {
            this.seccionCredito = false;
          } else {
            this.seccionCredito = true;
          }
        });
      });
    }, ConfigDelayFormulario.LOADING_DELAY);
  }

  actualizarModoFacturacionConDias(modoFacturacionId: number, dias: number): void {
    const modoFacturacion = this.T_FACTURACION.find(modo => modo.id == modoFacturacionId);
    if (modoFacturacion) {
      modoFacturacion.dias = dias;  // Actualizamos la propiedad 'dias' del modo de facturación encontrado
    }
  }

  actualizarDiasPorModoFacturacion(estado: number): void {
    // Buscar el modo de facturación seleccionado en la lista T_FACTURACION
    let modoSeleccionado = this.T_FACTURACION.find(modo => modo.id == estado);
    // Si encontramos el modo, asignamos el valor de días, si no, restauramos el valor inicial
    this.clienteGestionarSucursalForm.get('dias')?.setValue(modoSeleccionado.dias);
  
    this.clienteGestionarSucursalForm.get('dias')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.clienteGestionarSucursalForm.invalid) {
      return;
    }

    console.log(this.clienteGestionarSucursalForm.value)
    
    this.clienteSucursalService.gestionarSucursalCliente(this.CLIENTE_SUCURSAL_TO_SELECTED.id,this.clienteGestionarSucursalForm.value).subscribe({
      next: (resp: any) => {
        this.ClienteGestionE.emit(resp.sucursal_gestionada);
        this.modal.close();
        this.sweet.success(
          '¡Éxito!',
          'la sucursal se gestionó correctamente'
        );
      },
    })
  }   
}
