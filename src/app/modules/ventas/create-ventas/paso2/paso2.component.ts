import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as L from 'leaflet';

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
  formaPago: string = '1'; // 1: contado, 2: adelantado, 3: contraentrega
  destino: string = '';
  transporte: any = null;
  direccionEntrega: string = '';
  latitud: number | null = null;
  longitud: number | null = null;
  coordenadas: string = '';
  fotoReferencia: File | null = null;
  searchTerm: string = '';

  private map: any;
  private marker: any;
  private mapaInicializado = false;

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
    private sanitizer: DomSanitizer
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
  }

  ngOnInit(): void {
    if (this.cliente) {
      this.setCliente(this.cliente);
    }
  }

  setCliente(clienteId: number) {
    this.clienteSeleccionado = this.clientes.find(c => c.id === +clienteId);
    if (this.clienteSeleccionado) {
      this.formaPago = this.clienteSeleccionado.forma_pago || '1';
      this.comprobanteSeleccionado = '';
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
      destino: this.destino,
      transporte: this.transporte,
      direccion: this.direccionEntrega,
      coordenadas: this.coordenadas,
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

  onSearch(event: { term: string; items: any[] }): void {
    this.searchTerm = event.term;
  }

  get opcionesPago() {
    if (!this.clienteSeleccionado) return [];
    switch (this.clienteSeleccionado.forma_pago) {
      case '1':
        this.formaPago = '1';
        return [{ value: '1', label: 'Crédito' }];
      case '2':
        this.formaPago = '2';
        return [{ value: '2', label: 'Contado' }];
      case '3':
        this.formaPago = ''; // Espera a que el usuario seleccione
        return [
          { value: '1', label: 'Crédito' },
          { value: '2', label: 'Contado' }
        ];
      default:
        return [];
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoReferencia = file;
    }
  }

  onClienteChange(cliente: any): void {
    this.clienteSeleccionado = cliente;

    // ✅ Seleccionar automáticamente forma de pago si hay una sola opción
    const forma = cliente?.forma_pago;
    if (forma === '1' || forma === '2') {
      this.formaPago = forma;
    } else {
      this.formaPago = ''; // Espera selección
    }

    // ✅ Calcular destino automáticamente
    const esLocal = cliente?.distrito?.startsWith('Arequipa / Arequipa');
    this.destino = esLocal ? 'local' : 'provincia';

    // ✅ Reiniciar comprobante
    this.comprobanteSeleccionado = null;

    // ✅ (Opcional) Limpiar dirección y coordenadas
    this.direccionEntrega = '';
    this.coordenadas = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteSeleccionado'] && this.clienteSeleccionado?.type_documentos) {
      const docConCodigo00 = this.clienteSeleccionado.type_documentos.find((doc:any) => doc.codigo === '00');
      if (docConCodigo00) {
        this.comprobanteSeleccionado = docConCodigo00.codigo;
      } else {
        this.comprobanteSeleccionado = ''; // O null, según lo que uses como valor vacío
      }
    }
  }
}

