import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-evento',
  templateUrl: './edit-evento.component.html',
  styleUrls: ['./edit-evento.component.scss']
})
export class EditEventoComponent {
  eventoForm: FormGroup;
    
  @Output() eventEdit = new EventEmitter<any>();
  @Input() EVENTO_SELECTED:any

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.eventoForm = this.fb.group({
      name: [this.EVENTO_SELECTED.title,[Validators.required]],
      monto: [this.EVENTO_SELECTED.extendedProps?.amount, [Validators.required]],
      comentario: [this.EVENTO_SELECTED.extendedProps?.notes],
      fecha_pago: [this.formatDate(this.EVENTO_SELECTED.start), [Validators.required]],
      dias_despues: [null, [Validators.required]],
      fecha_recordatorio: [this.EVENTO_SELECTED.extendedProps?.reminder, [Validators.required]],
    });
    this.calcularRecordatorios()
    console.log(this.EVENTO_SELECTED.start)
  }

  submitEvent() {
    if (this.eventoForm.valid) {
      const evento = {
        id: Number(this.EVENTO_SELECTED.id),
        title: this.eventoForm.get('name')?.value,
        start: this.eventoForm.get('fecha_pago')?.value,
        allDay: true,
        className: 'bg-primary text-white',
        extendedProps: {
          amount: this.eventoForm.get('monto')?.value,
          notes: this.eventoForm.get('comentario')?.value,
          reminder: this.eventoForm.get('fecha_recordatorio')?.value
        }
      };
  
      let eventosGuardados = JSON.parse(localStorage.getItem('eventos_compra_cuotas') || '[]');
      const index = eventosGuardados.findIndex((eventoGuardado: any) => Number(eventoGuardado.id) === Number(evento.id));
      if (index !== -1) {
        eventosGuardados[index] = evento;
      }
      localStorage.setItem('eventos_compra_cuotas', JSON.stringify(eventosGuardados));
      this.eventEdit.emit(evento);
      this.modal.close();
    } else {
      return;
    }
  }

  calcularRecordatorios() {
    const fechaPago = this.eventoForm.get('fecha_pago')?.value;
    let diasDespues = this.eventoForm.get('dias_despues')?.value;
    const fechaRecordatorio = this.eventoForm.get('fecha_recordatorio')?.value;
  
    if (fechaPago && fechaRecordatorio && (diasDespues === null || diasDespues === '')) {
      const fechaPagoDate = new Date(fechaPago);
      const fechaRecordatorioDate = new Date(fechaRecordatorio);
      const diferenciaDias = Math.round((fechaRecordatorioDate.getTime() - fechaPagoDate.getTime()) / (1000 * 60 * 60 * 24));
      this.eventoForm.patchValue({ dias_despues: diferenciaDias });
    } else if (fechaPago && diasDespues) {
      const fechaPagoDate = new Date(fechaPago);
      const despuesDate = new Date(fechaPagoDate);
      despuesDate.setDate(despuesDate.getDate() + parseInt(diasDespues, 10));

      this.eventoForm.patchValue({ fecha_recordatorio: this.formatDate(despuesDate) });
    } else {
      this.eventoForm.patchValue({ fecha_recordatorio: null });
    }
  }

  formatDate(date: Date): string {
      return date.toISOString().split('T')[0];
  }
}
