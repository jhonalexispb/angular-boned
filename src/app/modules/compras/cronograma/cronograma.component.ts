import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Importar el plugin de interacción
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEventoComponent } from './create-evento/create-evento.component';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.scss']
})
export class CronogramaComponent {
  constructor(
    public modalService: NgbModal,
  ) {}

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin], // Incluir el plugin de interacción
    initialView: 'dayGridMonth',
    weekends: true,
    events: [
      { title: 'Meeting', start: new Date(), className: "border-dark bg-dark text-white" },
      { title: "Meeting", start: "2024-06-12T14:30:00", className: "border-success bg-success text-white" },
      { title: "Happy Hour", start: "2024-06-12T17:30:00", className: "border-warning bg-warning text-white" },
      { title: "Dinner", start: "2024-06-12T20:00:00", className: "border-info bg-info text-white" }
    ],
    eventDrop: (info) => {
      const movedEvent = info.event;  // El evento que fue movido
      console.log('Evento movido:', movedEvent.title);
      console.log('Nueva fecha de inicio:', movedEvent.start);
      
      // Aquí puedes emitir el nuevo valor del evento
      this.updateEvent(movedEvent);
    },
    dateClick: (info) => {
      this.openAddEventModal(info.dateStr);
    },
    eventClick: (info) => {
      this.openEditEventModal(info.event);
    },
    // Si quieres permitir arrastrar y soltar eventos, puedes agregar la opción "editable"
    editable: true,
    droppable: false, // Permite arrastrar y soltar eventos
  };

  openAddEventModal(date: string) {
    console.log('Fecha seleccionada:', date);
    const modalRef = this.modalService.open(CreateEventoComponent,{centered:true, size: 'md'})
    // Pasar la fecha seleccionada al modal
    modalRef.componentInstance.eventDate = date;

    // Escuchar el evento emitido desde el componente hijo
    modalRef.componentInstance.eventCreated.subscribe((eventData:any) => {
      // Agregar el evento al calendario
      this.calendarOptions = {...this.calendarOptions,...{events: eventData}};
      console.log('Evento añadido:', eventData);
    });
  }

  openEditEventModal(event:any) {
    console.log('Evento seleccionado:', event);
    // Aquí abrirías el modal para editar el evento
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  updateEvent(event:any) {
    // Aquí podrías hacer lo que necesites, como actualizar el evento en una base de datos
    console.log('Evento actualizado:', event);
    // Ejemplo: enviar el evento actualizado a un servicio o emitir el nuevo valor
  }
}
