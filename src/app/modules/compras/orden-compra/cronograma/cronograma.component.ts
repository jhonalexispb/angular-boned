import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CreateEventoComponent } from './create-evento/create-evento.component';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { EditEventoComponent } from './edit-evento/edit-evento.component';
import { CompraService } from '../../service/compra.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.scss']
})
export class CronogramaComponent {
  constructor(
    public modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    public compraService: CompraService,
    private router: Router
  ) {}

  totalMonto: number = 0;
  totalPendiente: number = 0;
  cuotas:number  = 0
  proveedor:string;
  sweet:any = new SweetalertService
  eventosPendientes:any[] = [];
  cuotas_pendientes:any[] = [];

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
        const totalMontoFixed = parseFloat(this.totalMonto.toFixed(2));
        const totalFixed = parseFloat(total.toFixed(2));

        this.totalPendiente = totalMontoFixed - totalFixed;
        const valoresRecuperados = JSON.parse(eventoGuardado);
        this.calendarOptions = {...this.calendarOptions,...{events: valoresRecuperados}};
      }
    }
    this.listCuotas()
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
      if (info.event.id) {
        this.openEditEventModal(info.event); // 🔹 Solo abrir modal si el evento tiene ID (es del localStorage)
      }
    },
    editable: true,
    droppable: false,
    dayMaxEventRows: 2,
    eventDidMount: (info) => {
      this.updateDailyTotal(info.event);
      info.el.style.whiteSpace = 'wrap';
      info.el.style.fontSize = '12px';
      info.el.style.overflow = 'hidden';
      info.el.style.textOverflow = 'ellipsis';
    }
  };

  private updateDailyTotal(event: any) {
    const date = event.startStr; 
    const cell = document.querySelector(`[data-date="${date}"]`);
    
    if (cell) {
      let totalContainer = cell.querySelector('.daily-total');
      
      if (!totalContainer) {
        totalContainer = document.createElement('div');
        totalContainer.classList.add('daily-total');
      
        cell.prepend(totalContainer);
      }

      const eventos = Array.isArray(this.calendarOptions.events) ? this.calendarOptions.events : [];

      let totalAmount = 0;

      eventos.forEach((ev: any) => {
        if (ev.start === date) {
            totalAmount += parseFloat(ev.extendedProps?.amount) || 0;
            
        }
      });
      totalContainer.innerHTML = `<b class="bg-info text-white p-2 responsive-text rounded">S/${totalAmount.toFixed(2)}</b>`;
    }
  }

  listCuotas(){
    this.mostrandoCarga = true
    this.compraService.obtenerCuotas().subscribe((resp: any) => {
      this.cuotas_pendientes = resp.cuotas_pendientes.map((evento: any) => ({
        ...evento,
        extendedProps: {
            ...evento.extendedProps,
            amount: parseFloat(evento.extendedProps?.amount) || 0, // Convertir a float y manejar valores nulos
            saldo: parseFloat(evento.extendedProps?.saldo) || 0
        },
        editable: false
      }));

      this.calendarOptions = { 
        ...this.calendarOptions, 
        events: [...(Array.isArray(this.calendarOptions.events) ? this.calendarOptions.events : []), ...this.cuotas_pendientes]
      };

      setTimeout(() => {
        this.calendarOptions = { ...this.calendarOptions };
  
        // 🔹 Verificar si events es un array antes de usar forEach
        const eventos = Array.isArray(this.calendarOptions.events) ? this.calendarOptions.events : [];
        eventos.forEach((event: any) => {
          this.updateDailyTotal(event);
        });
      }, 0);
      this.mostrandoCarga = false
    })
  }

  cambiarVista(vista: string) {
    this.calendarOptions = { ...this.calendarOptions, initialView: vista };
    this.reiniciarCalendario()
  }

  openAddEventModal(date: string) {
    if(!this.proveedor){
      this.sweet.alerta('Paremos aqui','No estas trabajando con ningun proveedor')
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
    modalRef.componentInstance.LOCAL_STG = 'eventos_compra_cuotas'

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
        const totalMontoFixed = parseFloat(this.totalMonto.toFixed(2));
        const totalFixed = parseFloat(total.toFixed(2));
        this.totalPendiente = totalMontoFixed - totalFixed;
      }
      this.cdRef.detectChanges();
    }
  }

  openEditEventModal(event:any) {
    const modalRef = this.modalService.open(EditEventoComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.EVENTO_SELECTED = event
    modalRef.componentInstance.MONTO_PENDIENTE = this.totalPendiente
    modalRef.componentInstance.LOCAL_STG = 'eventos_compra_cuotas'
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
            const totalMontoFixed = parseFloat(this.totalMonto.toFixed(2));
            const totalFixed = parseFloat(total.toFixed(2));
            this.totalPendiente = totalMontoFixed - totalFixed;

            // 4. Restaurar los eventos en el calendario
            this.calendarOptions = { ...this.calendarOptions, events: eventos };
            this.calendarOptions = { 
              ...this.calendarOptions, 
              events: [...(Array.isArray(this.calendarOptions.events) ? this.calendarOptions.events : []), ...this.cuotas_pendientes]
            };   

            setTimeout(() => {
              this.calendarOptions = { ...this.calendarOptions };
        
              // 🔹 Verificar si events es un array antes de usar forEach
              const eventos = Array.isArray(this.calendarOptions.events) ? this.calendarOptions.events : [];
              eventos.forEach((event: any) => {
                this.updateDailyTotal(event);
              });
            }, 0);
        }
        // 5. Ocultar el mensaje de carga
        this.mostrandoCarga = false;
        this.cdRef.detectChanges();
    }, 100);  // Pequeña pausa para simular carga
  }

  irFecha(date:any){
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(date);
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

    this.sweet.confirmar('¿Estas seguro?',`¿Desea registrar la compra?`,'/assets/animations/general/ojitos.json','Si, hagamoslo','Cancelar').then((result:any) => {
      if (result.isConfirmed) {
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
            reminder: cuota.extendedProps.reminder,
            dias_reminder: cuota.extendedProps.dias_reminder,
            title: cuota.title
          }))
        };

        this.compraService.registerOrdenCompra(data).subscribe({
          next: (resp: any) => {
            localStorage.removeItem("compra_form");
            localStorage.removeItem("compra_details");
            localStorage.removeItem("eventos_compra_cuotas");
            this.compraService.actualizarCarritoCompra();
            setTimeout(() => {
              this.router.navigate(['/compras/list']);
        
              this.sweet.success(
                '¡Éxito!',
                'La orden de compra se registró correctamente'
              );
            }, 100);
          },
        });
      }
    })
  }
}
