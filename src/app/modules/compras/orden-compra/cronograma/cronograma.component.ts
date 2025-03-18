import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CreateEventoComponent } from './create-evento/create-evento.component';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { EditEventoComponent } from './edit-evento/edit-evento.component';
import { CompraService } from '../../service/compra.service';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.scss']
})
export class CronogramaComponent {
  @Output() OrdenCompraC:EventEmitter<any> = new EventEmitter();
  constructor(
    public modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    public compraService: CompraService
  ) {}

  totalMonto: number = 0;
  totalPendiente: number = 0;
  cuotas:number  = 0
  proveedor:string;
  sweet:any = new SweetalertService
  eventosPendientes:any[] = [];

  mostrandoCarga = false;

  @ViewChild('calendar') calendarComponent: any;

  ngOnInit():void {
    const formGuardado = localStorage.getItem('compra_form');
    if (formGuardado) {
      const valoresRecuperados = JSON.parse(formGuardado);
      this.proveedor = valoresRecuperados.proveedor_name
      this.totalMonto = valoresRecuperados.total
      this.totalPendiente = valoresRecuperados.total

      const eventoGuardado = localStorage.getItem('eventos_compra_cuotas');
      if (eventoGuardado) {
        this.eventosPendientes = JSON.parse(eventoGuardado);
        this.eventosPendientes.sort((a, b) => {
          return new Date(a.start).getTime() - new Date(b.start).getTime();
        });
        const eventos = JSON.parse(eventoGuardado);
        this.cuotas = eventos.length;
        const total = eventos.reduce((acc:any, evento:any) => acc + (evento.extendedProps?.amount || 0), 0);
        this.totalPendiente = this.totalMonto - total;
        const valoresRecuperados = JSON.parse(eventoGuardado);
        this.calendarOptions = {...this.calendarOptions,...{events: valoresRecuperados}};
      }
    }
  }
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    eventDrop: (info) => {
      const movedEvent = info.event;
      this.updateEvent(movedEvent);
    },
    dateClick: (info) => {
      this.openAddEventModal(info.dateStr);
    },
    eventClick: (info) => {
      this.openEditEventModal(info.event);
    },
    editable: true,
    droppable: false,
    dayMaxEventRows: 2,
    eventDidMount: (info) => {
      this.updateDailyTotal(info.el, info.event);
      info.el.style.whiteSpace = 'wrap';
      info.el.style.fontSize = '12px';
      info.el.style.overflow = 'hidden';
      info.el.style.textOverflow = 'ellipsis';
    }
  };

  private updateDailyTotal(el: HTMLElement, event: any) {
    const date = event.startStr; 
    const cell = document.querySelector(`[data-date="${date}"]`);
    
    if (cell) {
      let totalContainer = cell.querySelector('.daily-total');
      
      if (!totalContainer) {
        totalContainer = document.createElement('div');
        totalContainer.classList.add('daily-total');
        cell.prepend(totalContainer);
      }

      let currentTotal = Number(totalContainer.getAttribute('data-total')) || 0;
      currentTotal += event.extendedProps.amount || 0;
      totalContainer.setAttribute('data-total', currentTotal.toString());
      totalContainer.innerHTML = `<b class="bg-warning text-white p-2 rounded">S/${currentTotal}</b>`;
    }
  }

  cambiarVista(vista: string) {
    this.calendarOptions = { ...this.calendarOptions, initialView: vista };
    this.reiniciarCalendario()
  }

  openAddEventModal(date: string) {
    if(!this.proveedor){
      this.sweet.alert('Paremos aqui','No estas trabajando con ningun proveedor')
      return
    }
    if(this.totalMonto<=0){
      this.sweet.alerta('Alto ahi','tu carrito de compra esta vacio')
      return
    }
    if(this.totalPendiente<=0){
      this.sweet.alerta('Alto ahi','ya no hay montos pendientes por programar')
      return
    }
    const modalRef = this.modalService.open(CreateEventoComponent,{centered:true, size: 'md'})
    // Pasar la fecha seleccionada al modal
    modalRef.componentInstance.eventDate = date;
    modalRef.componentInstance.proveedor = this.proveedor;
    modalRef.componentInstance.MONTO_PENDIENTE = this.totalPendiente

    // Escuchar el evento emitido desde el componente hijo
    modalRef.componentInstance.eventCreated.subscribe((eventData:any) => {
      this.addEventToCalendar(eventData);
      this.sweet.success('Bien','la cuota se genero de manera satisfactoria')
    });
  }

  addEventToCalendar(newEvent: any) {
    this.calendarOptions.events = [...(Array.isArray(this.calendarOptions.events) ? this.calendarOptions.events : []), newEvent];
    if (this.calendarComponent) {
      this.cuotas++
      const eventoGuardado:any = localStorage.getItem('eventos_compra_cuotas');
      this.eventosPendientes = JSON.parse(eventoGuardado);
      this.eventosPendientes.sort((a, b) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
      if (eventoGuardado) {
        const eventos = JSON.parse(eventoGuardado);
        this.cuotas = eventos.length;
        const total = eventos.reduce((acc:any, evento:any) => acc + (evento.extendedProps?.amount || 0), 0);
        this.totalPendiente = this.totalMonto - total;
      }
      this.cdRef.detectChanges();
    }
  }

  openEditEventModal(event:any) {
    const modalRef = this.modalService.open(EditEventoComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.EVENTO_SELECTED = event
    modalRef.componentInstance.MONTO_PENDIENTE = this.totalPendiente
    // Pasar la fecha seleccionada al modal

    // Escuchar el evento emitido desde el componente hijo
    modalRef.componentInstance.eventEdit.subscribe((eventData:any) => {
      this.addEventToCalendar(eventData);
      this.reiniciarCalendario(eventData.start)
      this.sweet.success('Bien','la cuota se actualizo de manera satisfactoria')
    });
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  updateEvent(event: any) {
    let eventosGuardados = JSON.parse(localStorage.getItem('eventos_compra_cuotas') || '[]');
    const index = eventosGuardados.findIndex((eventoGuardado: any) => Number(eventoGuardado.id) === Number(event.id));

    if (index !== -1) {
      eventosGuardados[index].start = event.start.toISOString().split('T')[0];
      const diasReminder = eventosGuardados[index].extendedProps.dias_reminder || 0;

      let nuevaFechaReminder = new Date(event.start);
      nuevaFechaReminder.setDate(nuevaFechaReminder.getDate() + diasReminder);

      let reminderDateString = nuevaFechaReminder.toISOString().split('T')[0];
      eventosGuardados[index].extendedProps.reminder = reminderDateString;

      localStorage.setItem('eventos_compra_cuotas', JSON.stringify(eventosGuardados));
      const eventoGuardado:any = localStorage.getItem('eventos_compra_cuotas');
      this.eventosPendientes = JSON.parse(eventoGuardado);
      this.eventosPendientes.sort((a, b) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
      this.reiniciarCalendario(event.start)
    }
  }

  borrar_evento(cuota:any){
    this.sweet.confirmar_borrado('Ups',`Esta seguro de borrar la cuota de S/ ${cuota.extendedProps.amount}`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        const eventoGuardado = localStorage.getItem('eventos_compra_cuotas');
        if (eventoGuardado) {
          let eventos = JSON.parse(eventoGuardado);

          // Filtrar eventos para eliminar el seleccionado
          eventos = eventos.filter((evento: any) => evento.id !== cuota.id);

          // Guardar el array actualizado en localStorage
          localStorage.setItem('eventos_compra_cuotas', JSON.stringify(eventos));

          this.sweet.success('Bien','la cuota fue eliminada correctamente')
          const evento_list:any = localStorage.getItem('eventos_compra_cuotas');
          this.eventosPendientes = JSON.parse(evento_list);
          this.eventosPendientes.sort((a, b) => {
          return new Date(a.start).getTime() - new Date(b.start).getTime();
          });

          this.cuotas = JSON.parse(eventoGuardado).length;
          const total = eventos.reduce((acc:any, evento:any) => acc + (evento.extendedProps?.amount || 0), 0);
          this.totalPendiente = this.totalMonto - total;
          /* this.cdRef.detectChanges(); */
          this.reiniciarCalendario()
        }
      }
    });
  }

  reiniciarCalendario(fechaInicio?: string) {
    // 1. Mostrar "Cargando..." antes de actualizar el calendario
    this.mostrandoCarga = true;
    this.cdRef.detectChanges();
    
    // 2. Vaciar los eventos temporalmente
    this.calendarOptions = { ...this.calendarOptions, events: [] ,initialDate: fechaInicio || this.calendarOptions.initialDate};

    // 3. Recargar los eventos desde localStorage después de un pequeño delay
    setTimeout(() => {
        const eventoGuardado = localStorage.getItem('eventos_compra_cuotas');
        if (eventoGuardado) {
            let eventos = JSON.parse(eventoGuardado);
            
            // Actualizar las cuotas y el total pendiente
            this.eventosPendientes = eventos;
            this.eventosPendientes.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
            this.cuotas = eventos.length;
            const total = eventos.reduce((acc:any, evento:any) => acc + (evento.extendedProps?.amount || 0), 0);
            this.totalPendiente = this.totalMonto - total;

            // 4. Restaurar los eventos en el calendario
            this.calendarOptions = { ...this.calendarOptions, events: eventos };
        }

        // 5. Ocultar el mensaje de carga
        this.mostrandoCarga = false;
        this.cdRef.detectChanges();
    }, 100);  // Pequeña pausa para simular carga
  }

  onSubmit() {
    if(this.totalMonto <= 0){
      this.sweet.alerta('Alerta','tu carrito esta vacio')
      return
    }
    if (this.totalPendiente != 0) {
      if(this.totalPendiente > 0){
        this.sweet.alerta('Alerta','hay un monto pendiente por gestionar')
      }else{
        this.sweet.alerta('Alerta','el monto pendiente no puede ser negativo, gestiona tus cuotas por favor')
      }
      return
    }

    const compraForm = JSON.parse(localStorage.getItem("compra_form") || "{}");
    const compraDetails = JSON.parse(localStorage.getItem("compra_details") || "[]");
    const eventosCompraCuotas = JSON.parse(localStorage.getItem("eventos_compra_cuotas") || "[]");

    const data = {
      compra_form: {
        proveedor_id: compraForm.proveedor_id,
        type_comprobante_compra_id: compraForm.type_comprobante_compra_id || '',
        forma_pago_id: compraForm.forma_pago_id || '',
        igv: compraForm.igv || false,
        total: compraForm.total || 0,
        impuesto: compraForm.impuesto || 0,
        sub_total: compraForm.sub_total || 0,
        notificacion: compraForm.notificacion,
        mensaje_notificacion: compraForm.mensaje_notificacion || '',
        fecha_ingreso: compraForm.fecha_ingreso || '',
        descripcion: compraForm.descripcion || '',
      },
      compra_details: compraDetails.map((item: any) => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        condicion_vencimiento: item.condicion_vencimiento,
        margen_ganancia: item.margen_minimo,
        fecha_vencimiento: item.fecha_vencimiento,
        pcompra: item.pcompra,
        pventa: item.pventa,
        total: item.total,
      })),
      eventos_compra_cuotas: eventosCompraCuotas.map((cuota: any) => ({
        start: cuota.start,
        amount: cuota.extendedProps.amount,
        notes: cuota.extendedProps.notes,
        reminder: cuota.extendedProps.reminder
      }))
    };

    console.log(data)

    this.compraService.registerOrdenCompra(data).subscribe({
      next: (resp: any) => {
        this.OrdenCompraC.emit(resp);
        this.sweet.success(
          '¡Éxito!',
          'la orden de compra se registró correctamente'
        );

        /* localStorage.removeItem("compra_form");
        localStorage.removeItem("compra_detail");
        localStorage.removeItem("eventos_compra_cuotas"); */
      },
    })
  }
}
