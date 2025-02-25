import { Component, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-evento',
  templateUrl: './create-evento.component.html',
  styleUrls: ['./create-evento.component.scss']
})
export class CreateEventoComponent {
  eventName: string = '';
  eventAmount: number | null = null;
  eventNotes: string = '';
  eventDate: string = '';
  sendReminder: boolean = false;

  @Output() eventCreated = new EventEmitter<any>(); // Definir el @Output

  constructor(public modal: NgbActiveModal) {}

  submitEvent() {
    if (this.eventName && this.eventAmount !== null && this.eventDate) {
      // Formatear los datos para FullCalendar
      const eventData = {
        title: this.eventName, // Título del evento
        start: this.eventDate, // La fecha del evento, puedes incluir hora si es necesario
        allDay: true, // Ya que es un evento de un solo día
        className: 'bg-primary text-white', // Puedes cambiar esto dependiendo del color que desees
        extendedProps: {
          amount: this.eventAmount, // Monto de la letra
          notes: this.eventNotes, // Comentario adicional
          reminder: this.sendReminder // Recordatorio
        }
      };

      console.log('Evento creado:', eventData);

      // Emitir el evento usando @Output
      this.eventCreated.emit(eventData);

      // Cerrar el modal
      this.modal.close();
    } else {
      console.log('Faltan campos obligatorios');
    }
  }
}
