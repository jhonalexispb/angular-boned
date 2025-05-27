import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import { CreateLugarEntregaComponent } from 'src/app/modules/configuration/lugar-entrega/create-lugar-entrega/create-lugar-entrega.component';

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
  @Input() transportes: any[] = [];
  @Output() onVentaCompleta = new EventEmitter<any>();

  clienteSeleccionado: any = null;
  comprobanteSeleccionado: string | null = null;
  zona_reparto: any = null;
  transporte: any = null;
  direccionEntrega: any = null;
  latitud: number | null = null;
  longitud: number | null = null;
  coordenadas: string = '';
  fotoReferencia: File | null = null;
  searchTerm: string = '';
  direccionesEntrega: any[] = [];

  private map: any;
  private marker: any;
  private mapaInicializado = false;



  opcionesPago: { value: string, label: string }[] = [];
  formaPago: string | null = null;

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
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    public modalService: NgbModal,
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
    console.log(dir)
    if (dir?.latitud && dir?.longitud) {
      this.actualizarMapa(parseFloat(dir.latitud), parseFloat(dir.longitud));
    }else{
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
    console.log(this.clientes)
    if (this.cliente) {
      this.setCliente(this.cliente);
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
      this.opcionesPago = [{ value: 'credito', label: 'Crédito' }];
    } else if (forma == 2) {
      this.opcionesPago = [{ value: 'contado', label: 'Contado' }];
    } else if (forma == 3) {
      this.opcionesPago = [
        { value: 'credito', label: 'Crédito' },
        { value: 'contado', label: 'Contado' }
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

    if (lugares.length === 1) {
      this.direccionEntrega = lugares[0];
      if (lugares[0].latitud && lugares[0].longitud) {
        this.actualizarMapa(parseFloat(lugares[0].latitud), parseFloat(lugares[0].longitud));
      } else {
        this.resetearMapa(); 
      }
    } else {
      this.direccionEntrega = null; // usuario debe seleccionar
    }
  }

  resetearMapa() {
    const coordsNeutras: [number, number] = [-12.0464, -77.0428]; // ejemplo Lima centro
    this.map.setView(coordsNeutras, 13);
    
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null; // 👈 Importante
    }
  }

  compareClientes = (c1: any, c2: any) => {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  };

  registrarVenta() {
    if (!this.clienteSeleccionado) return;

    const venta = {
      cliente_id: this.clienteSeleccionado.id,
      comprobante: this.comprobanteSeleccionado,
      forma_pago: this.formaPago,
      zona_reparto: this.zona_reparto,
      transporte: this.transporte,
      direccion: this.direccionEntrega,
      foto: this.fotoReferencia
    };

    this.onVentaCompleta.emit(venta);
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoReferencia = file;
    }
  }

  createLugarEntrega(){
    const modalRef = this.modalService.open(CreateLugarEntregaComponent,{centered:true, size: 'md'})
    console.log(this.clienteSeleccionado)
    modalRef.componentInstance.sucursal = this.clienteSeleccionado.id;
    modalRef.componentInstance.LugarEntregaC.subscribe((nuevaDireccion: any) => {
      // Agrega la nueva dirección a la lista
      this.direccionesEntrega.push(nuevaDireccion);
      this.direccionEntrega = nuevaDireccion;

      // Si tiene coordenadas, actualiza el mapa
      if (nuevaDireccion.latitud && nuevaDireccion.longitud) {
        this.actualizarMapa(nuevaDireccion.latitud, nuevaDireccion.longitud);
      }
    });
  }
}

