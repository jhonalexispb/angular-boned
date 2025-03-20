import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';

@Component({
  selector: 'app-edit-evento',
  templateUrl: './edit-evento.component.html',
  styleUrls: ['./edit-evento.component.scss']
})
export class EditEventoComponent {
  eventoForm: FormGroup;
    
  @Output() eventEdit = new EventEmitter<any>();
  @Input() EVENTO_SELECTED:any
  @Input() MONTO_PENDIENTE:any
  @Input() LOCAL_STG:any
  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.eventoForm = this.fb.group({
      name: [this.EVENTO_SELECTED.title,[Validators.required]],
      monto: [this.EVENTO_SELECTED.extendedProps?.saldo, [Validators.required]],
      comentario: [this.EVENTO_SELECTED.extendedProps?.notes],
      fecha_pago: [{ value: this.formatDate(this.EVENTO_SELECTED.start), disabled: true }, [Validators.required]],
      dias_despues: [this.EVENTO_SELECTED.extendedProps?.dias_reminder, [Validators.required]],
      fecha_recordatorio: [this.EVENTO_SELECTED.extendedProps?.reminder, [Validators.required]],
    });
    this.MONTO_PENDIENTE = this.MONTO_PENDIENTE + this.eventoForm.get('monto')?.value
    this.MONTO_PENDIENTE = parseFloat(this.MONTO_PENDIENTE.toFixed(2));
    this.calcularRecordatorioInicial()
  }

  submitEvent() {
    if(this.eventoForm.get('monto')?.value > this.MONTO_PENDIENTE){
      this.sweet.alerta('Alto ahi','el monto ingresado supera al monto pendiente')
      return
    }
    if (this.eventoForm.valid) {
      const evento = {
        id: Number(this.EVENTO_SELECTED.id),
        title: this.eventoForm.get('name')?.value,
        start: this.eventoForm.get('fecha_pago')?.value,
        allDay: true,
        className: 'bg-primary text-white',
        extendedProps: {
          amount: this.eventoForm.get('monto')?.value,
          saldo: this.eventoForm.get('monto')?.value,
          notes: this.eventoForm.get('comentario')?.value,
          dias_reminder: this.eventoForm.get('dias_despues')?.value,
          reminder: this.eventoForm.get('fecha_recordatorio')?.value
        }
      };
  
      let eventosGuardados = JSON.parse(localStorage.getItem(this.LOCAL_STG) || '[]');
      const index = eventosGuardados.findIndex((eventoGuardado: any) => Number(eventoGuardado.id) === Number(evento.id));
      if (index !== -1) {
        eventosGuardados[index] = evento;
      }
      localStorage.setItem(this.LOCAL_STG, JSON.stringify(eventosGuardados));
      this.eventEdit.emit(evento);
      this.modal.close();
    } else {
      return;
    }
  }

  calcularRecordatorios() {
    const fechaPago = this.eventoForm.get('fecha_pago')?.value;
    const diasDespues = this.eventoForm.get('dias_despues')?.value;

    if (fechaPago) {
        const fechaPagoDate = new Date(fechaPago);

        const despuesDate = new Date(fechaPagoDate);
        despuesDate.setDate(despuesDate.getDate() + parseInt(diasDespues, 10));
        const dia_formateado = this.formatDate(despuesDate)
        this.eventoForm.patchValue({fecha_recordatorio : dia_formateado})
    }
  }

  
  calcularRecordatorioInicial() {
    const fechaPago = this.eventoForm.get('fecha_pago')?.value;
    const diasDespues = this.eventoForm.get('dias_despues')?.value;
    const fechaRecordatorio = this.eventoForm.get('fecha_recordatorio')?.value;

    if(diasDespues){
      return
    }

    if (fechaPago) {
        const fechaPagoDate = new Date(fechaPago);
        const fechaRecordatorioDate = new Date(fechaRecordatorio);
        const diferenciaMs = fechaRecordatorioDate.getTime() - fechaPagoDate.getTime();
        const diasDespues = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
        this.eventoForm.patchValue({ dias_despues: diasDespues
      });
    }
  }
  

  formatDate(date: Date): string {
      return date.toISOString().split('T')[0];
  }
}
