import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import { CreateLugarEntregaComponent } from 'src/app/modules/configuration/lugar-entrega/create-lugar-entrega/create-lugar-entrega.component';
import { VentaProcesoService } from '../../service/venta_proceso_detalle.service';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { VentasService } from '../../service/ventas.service';
import { Router } from '@angular/router';

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
  selector: 'app-paso2',
  templateUrl: './paso2.component.html',
  styleUrls: ['./paso2.component.scss']
})
export class Paso2Component implements OnInit {
  @Input() cliente: any;
  @Input() clientes: any[] = [];
  @Input() order_venta_data: any;
  @Input() transportes: any[] = [];
  @Output() onRegresarPaso1 = new EventEmitter<void>();

  clienteSeleccionado: any = null;
  comprobanteSeleccionado: string | null = null;
  zona_reparto: any = null;
  transporte: any = null;
  direccionEntrega: any = null;
  modo_entrega: any = '1';
  latitud: any | null = null;
  longitud: any | null = null;
  coordenadas: string = '';
  searchTerm: string = '';
  comentario: string = '';
  direccionesEntrega: any[] = [];
  imagenReferencia:any

  sweet:any = new SweetalertService

  ventaSinGuardar = true;

  private map: any;
  private marker: any;
  private mapaInicializado = false;



  opcionesPago: { value: string, label: string }[] = [];
  formaPago: any | null = null;

  ngAfterViewChecked(): void {
    // Solo inicializar si hay cliente seleccionado y aún no se ha inicializado el mapa
    if (this.clienteSeleccionado && !this.mapaInicializado) {
      const mapDiv = document.getElementById('map');
      if (mapDiv) {
        this.inicializarMapa();
        this.mapaInicializado = true;
      }
    }
  }

  constructor(
    private sanitizer: DomSanitizer,
    public modalService: NgbModal,
    public venta_proceso_service: VentaProcesoService,
    public order_venta_service: VentasService,
    private router: Router,
  ) {}

  inicializarMapa(): void {
    this.map = L.map('map').setView([-12.0464, -77.0428], 13); // Ejemplo: Lima

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.latitud = lat;
      this.longitud = lng;
      this.coordenadas = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
    });

     setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

  actualizarMapaDireccion() {
    const dir = this.direccionEntrega;
    if (!dir) {
      this.imagenReferencia = null;
      this.resetearMapa();
      return;
    }

    this.imagenReferencia = dir.imagen || null;

    if (dir.latitud && dir.longitud) {
      console.log('estoy revisando2')
      this.actualizarMapa(parseFloat(dir.latitud), parseFloat(dir.longitud));
    } else {
      console.log('estoy revisando3')
      this.resetearMapa();
    }
  }

  actualizarMapa(lat: number, lng: number) {
    if (!this.map) {
      console.warn("Mapa no inicializado aún");
      return;
    }

    this.latitud = lat;
    this.longitud = lng;

    const coords: [number, number] = [lat, lng];

    if (this.marker) {
      this.marker.setLatLng(coords);
    } else {
      this.marker = L.marker(coords).addTo(this.map);
    }

    this.map.setView(coords, 15);
  }

  ngOnInit(): void {
    console.log(this.order_venta_data)
    window.addEventListener('beforeunload', this.beforeUnloadListener);
    if (this.order_venta_data) {
      this.clienteSeleccionado = this.obtenerClientePorId(this.order_venta_data.cliente_id);
      this.comprobanteSeleccionado = this.obtenerComprobantePorId(this.order_venta_data.comprobante_codigo);
      this.formaPago = this.obtenerFormaPago(this.order_venta_data.forma_pago);
      this.comentario = this.order_venta_data.comentario;
      this.zona_reparto = this.order_venta_data.zona_reparto;
      this.transporte = this.order_venta_data.transporte_id;
      this.modo_entrega = this.order_venta_data.modo_entrega ?? 1;
      this.direccionEntrega = this.obtenerDireccionPorId(this.order_venta_data.lugar_entrega_id);
      this.imagenReferencia = this.obtenerImagenPorDireccionId(this.order_venta_data.lugar_entrega_id);

      if (this.clienteSeleccionado) {
        this.direccionesEntrega = this.clienteSeleccionado.lugares_entrega || [];
      }

      if (!this.mapaInicializado && this.clienteSeleccionado) {
        this.inicializarMapa();
        this.mapaInicializado = true;
      }
      if(this.clienteSeleccionado){
        this.actualizarMapaDireccion()
      }
      return;
    }
    const dataGuardada = this.venta_proceso_service.getVentaParcial();

    if (dataGuardada) {
      // Restaurar datos guardados
      this.clienteSeleccionado = dataGuardada.clienteSeleccionado;
      this.comprobanteSeleccionado = dataGuardada.comprobanteSeleccionado;
      this.zona_reparto = dataGuardada.zona_reparto;
      this.transporte = dataGuardada.transporte;
      this.direccionEntrega = dataGuardada.direccionEntrega;
      this.modo_entrega = dataGuardada.modo_entrega;
      this.latitud = dataGuardada.latitud;
      this.longitud = dataGuardada.longitud;
      this.coordenadas = dataGuardada.coordenadas;
      this.imagenReferencia = dataGuardada.imagenReferencia;
      this.formaPago = dataGuardada.formaPago;
      this.opcionesPago = dataGuardada.opcionesPago;
      this.comentario = dataGuardada.comentario;

      // Cargar las direcciones del cliente guardado
      this.direccionesEntrega = this.clienteSeleccionado?.lugares_entrega || [];

      // Inicializa o actualiza el mapa si es necesario
      if (!this.mapaInicializado) {
        this.inicializarMapa();
        this.mapaInicializado = true;
      }
      this.resetearMapa();

      // Si hay coordenadas, actualizar mapa
      if (this.latitud && this.longitud) {
        this.actualizarMapa(parseFloat(this.latitud), parseFloat(this.longitud));
      }

    } else {
      if (this.cliente) {
        this.setCliente(this.cliente);
      }
    }
  }

  obtenerClientePorId(id: number) {
    return this.clientes.find(c => c.id === id);
  }

  obtenerComprobantePorId(codigo: any) {
    const i = this.clienteSeleccionado?.type_documentos?.find((c: any) => c.codigo == codigo) || null;
    return i ? i.codigo : null;
  }

  obtenerDireccionPorId(id: number) {
    return this.clienteSeleccionado?.lugares_entrega?.find((d:any) => d.id === id) || null;
  }

  obtenerFormaPago(formaPago: any) {
    const forma = this.clienteSeleccionado?.forma_pago;

    if (forma == 1) {
      this.opcionesPago = [{ value: '1', label: 'Crédito' }];
    } else if (forma == 2) {
      this.opcionesPago = [{ value: '0', label: 'Contado' }];
    } else if (forma == 3) {
      this.opcionesPago = [
        { value: '1', label: 'Crédito' },
        { value: '0', label: 'Contado' }
      ];
    } else {
      this.opcionesPago = []; // Vacío si no se reconoce la forma de pago
    }

    return formaPago;
  }

  obtenerImagenPorDireccionId(id:any){
    const i = this.clienteSeleccionado?.lugares_entrega?.find((c: any) => c.id == id) || null;
    return i ? i.imagen : null;
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.beforeUnloadListener);
  }

  beforeUnloadListener = (event: BeforeUnloadEvent) => {
    if (this.ventaSinGuardar) {
      event.preventDefault();
      event.returnValue = ''; // Obligatorio para que funcione en algunos navegadores
      return '';
    }
  }

  onClienteSeleccionado(cliente: any) {
    if (!cliente) {
        this.clienteSeleccionado = null;
        this.comprobanteSeleccionado = null;
        this.formaPago = null;
        this.opcionesPago = [];
        this.zona_reparto = null;
        return;
      }

      this.setCliente(cliente.id);
    }

  setCliente(clienteId: number) {
    // 🔁 Limpiar campos previos
    console.log('eligiendo cliente')
    this.clienteSeleccionado = null;
    this.comprobanteSeleccionado = null;
    this.formaPago = null;
    this.opcionesPago = [];
    this.zona_reparto = null;
    this.direccionEntrega = null;
    this.direccionesEntrega = [];

    // 🔍 Buscar el nuevo cliente
    this.clienteSeleccionado = this.clientes.find(c => c.id === +clienteId);

    if (!this.clienteSeleccionado) return;

    // ---------- Comprobantes ----------
    const documentos = this.clienteSeleccionado.type_documentos || [];

    if (documentos.length === 1) {
      this.comprobanteSeleccionado = documentos[0].codigo;
    } else {
      const doc00 = documentos.find((d: any) => d.codigo === '00');
      this.comprobanteSeleccionado = doc00 ? doc00.codigo : null;
    }

    // ---------- Zona ----------
    this.zona_reparto = this.clienteSeleccionado.zona_reparto;

    // ---------- Forma de Pago ----------
    const forma = this.clienteSeleccionado.forma_pago;

    if (forma == 1) {
      this.opcionesPago = [{ value: '1', label: 'Crédito' }];
    } else if (forma == 2) {
      this.opcionesPago = [{ value: '0', label: 'Contado' }];
    } else if (forma == 3) {
      this.opcionesPago = [
        { value: '1', label: 'Crédito' },
        { value: '0', label: 'Contado' }
      ];
    }

    // Selección automática si solo hay una opción
    this.formaPago = this.opcionesPago.length === 1 ? this.opcionesPago[0].value : null;

    // ---------- Lugares de Entrega ----------
    const lugares = this.clienteSeleccionado.lugares_entrega || [];
    this.direccionesEntrega = lugares;

    if (!this.mapaInicializado) {
      this.inicializarMapa();
      this.mapaInicializado = true;
    }
    this.resetearMapa(); 
    if (lugares.length === 1) {
      this.direccionEntrega = lugares[0];
      this.imagenReferencia = lugares[0].imagen
      if (lugares[0].latitud && lugares[0].longitud) {
        this.actualizarMapa(parseFloat(lugares[0].latitud), parseFloat(lugares[0].longitud));
      } 
    } else {
      this.direccionEntrega = null; // usuario debe seleccionar
    }
  }

  resetearMapa() {
    console.log('resetenado')
    const coordsNeutras: [number, number] = [-12.0464, -77.0428];
    this.map.setView(coordsNeutras, 13);
    this.latitud = null
    this.longitud = null
    
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
  }

  compareClientes = (c1: any, c2: any) => {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  };

  registrarVenta() {
    if (!this.clienteSeleccionado){
      this.sweet.alerta('Atencion','selecciona un cliente')
      return;
    }

    if (!this.comprobanteSeleccionado){
      this.sweet.alerta('Atencion','selecciona un comprobante')
      return;
    }

    if (this.formaPago === null || this.formaPago === undefined || this.formaPago === ''){
      this.sweet.alerta('Atencion','selecciona una forma de pago')
      return;
    }

    if ((this.zona_reparto === null || this.zona_reparto === undefined || this.zona_reparto === '') && this.modo_entrega == 1){
      this.sweet.alerta('Atencion','selecciona una zona de reparto')
      return;
    }

    if (!this.transporte && this.modo_entrega == 1){
      this.sweet.alerta('Atencion','selecciona un transporte')
      return;
    }

    if (!this.direccionEntrega && this.modo_entrega == 1){
      this.sweet.alerta('Atencion','selecciona una direccion de entrega')
      return;
    }

    if (!this.modo_entrega){
      this.sweet.alerta('Atencion','selecciona un modo de entrega')
      return;
    }

    const tipoDocumento = this.clienteSeleccionado.type_documentos.find((doc:any) => doc.codigo === this.comprobanteSeleccionado);

    if (!tipoDocumento) {
      console.error("Tipo de documento no encontrado para el código:", this.comprobanteSeleccionado);
      return; // o mostrar error al usuario
    }

    const orden_venta_id = localStorage.getItem('orden_venta_id') || '0';
    if(orden_venta_id == '0'){
      this.sweet.alerta('Atencion','no se pudo obtener la orden de venta')
      return;
    }

    const venta: any = {
      cliente_id: this.clienteSeleccionado.id,
      comprobante_id: tipoDocumento.id,
      forma_pago: parseInt(this.formaPago),
      comentario: this.comentario,
      modo_entrega: this.modo_entrega,
    };

    // 🚚 Si el modo de entrega es con reparto, agregar campos relacionados
    if (this.modo_entrega == 1) {
      venta.zona_reparto = this.zona_reparto;
      venta.transporte_id = this.transporte;
      venta.lugar_entrega_id = this.direccionEntrega?.id;

      if (this.latitud && this.longitud) {
        venta.latitud = this.latitud;
        venta.longitud = this.longitud;
      }
    }

    // ✅ Función para enviar la venta y limpiar
    const guardarVenta = (ventaData: any) => {
      this.order_venta_service.updateOrdenVenta(orden_venta_id, ventaData).subscribe({
        next: (resp: any) => {
          setTimeout(() => {
            this.venta_proceso_service.setVentaParcial({
              clienteSeleccionado: null,
              comprobanteSeleccionado: null,
              zona_reparto: null,
              transporte: null,
              direccionEntrega: null,
              direccionesEntrega: [],
              modo_entrega: null,
              latitud: null,
              longitud: null,
              coordenadas: null,
              imagenReferencia: null,
              formaPago: null,
              opcionesPago: [],
              comentario: ''
            });
            this.router.navigate(['/ventas/list']);
            this.sweet.success('Venta registrada', 'La orden de venta fue guardada exitosamente');
          }, 100);
        },
      });
    };

    if (this.order_venta_data.state_orden > 0) {
      guardarVenta(venta); // ya está aprobada
    } else {
      this.sweet.confirmar(
        'Consulta',
        'Antes de registrar la venta ¿Deseas aprobar la cotización?',
        '/assets/animations/general/ojitos.json',
        'Sí, aprobar',
        true,
        'No'
      ).then((result: any) => {
        venta.aprobar = result.isConfirmed;
        guardarVenta(venta); // con resultado de confirmación
      });
    }

  }

  obtenerUbicacionActual(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          this.latitud = lat;
          this.longitud = lng;
          this.coordenadas = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

          if (this.marker) {
            this.map.removeLayer(this.marker);
          }

          this.marker = L.marker([lat, lng]).addTo(this.map)
            .bindPopup("¡Estás aquí!").openPopup();

          this.map.setView([lat, lng], 15);
        },
        (error) => {
          console.error("Error al obtener ubicación:", error);
          alert("No se pudo obtener tu ubicación.");
        }
      );
    } else {
      alert("Tu navegador no soporta geolocalización.");
    }
  }

  highlightMatch(text: string, term: string): SafeHtml {
    if (!term || !text) return text;
    const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    const highlighted = text.replace(
      regex,
      `<span style="background-color: #ffcc00; color: #000; font-weight: bold; padding: 2px 4px; border-radius: 3px;">$1</span>`
    );
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  createLugarEntrega(){
    const modalRef = this.modalService.open(CreateLugarEntregaComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.sucursal = this.clienteSeleccionado.id;
    modalRef.componentInstance.LugarEntregaC.subscribe((nuevaDireccion: any) => {
      // Agrega la nueva dirección a la lista
      this.direccionesEntrega.push(nuevaDireccion);
      this.direccionEntrega = nuevaDireccion;

      // Si tiene coordenadas, actualiza el mapa
      if (nuevaDireccion.latitud && nuevaDireccion.longitud) {
        this.actualizarMapa(nuevaDireccion.latitud, nuevaDireccion.longitud);
      }
      this.imagenReferencia = nuevaDireccion.imagen;
    });
  }

  ir_paso_uno(){
    this.venta_proceso_service.setVentaParcial({
      clienteSeleccionado: this.clienteSeleccionado,
      comprobanteSeleccionado: this.comprobanteSeleccionado,
      zona_reparto: this.zona_reparto,
      transporte: this.transporte,
      direccionEntrega: this.direccionEntrega,
      direccionesEntrega: this.direccionesEntrega,
      modo_entrega: this.modo_entrega,
      latitud: this.latitud,
      longitud: this.longitud,
      coordenadas: this.coordenadas,
      imagenReferencia: this.imagenReferencia,
      formaPago: this.formaPago,
      opcionesPago:this.opcionesPago,
      comentario: this.comentario
    });

    this.onRegresarPaso1.emit();
  }
}

