import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ViewImageComponent } from 'src/app/components/view-image/view-image.component';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { UserLocalStorageService } from 'src/app/modules/users/service/userLocalStorage.service';
import { ProductoSelectedComponent } from '../../producto-selected/producto-selected.component';
import { VentasService } from '../../service/ventas.service';

@Component({
  selector: 'app-paso1',
  templateUrl: './paso1.component.html',
  styleUrls: ['./paso1.component.scss']
})
export class Paso1Component {
  @ViewChild('clienteSelect') clienteSelect: NgSelectComponent;
  @Output() onPaso1Listo = new EventEmitter<any>();
  ventaForm: FormGroup;

  PRODUCT_LIST:any[] = [];
  PRODUCT_GUIA_PRESTAMO_LIST:any[] = [];
  CLIENTES_LIST:any[] = [];
  TRANSPORTES_LIST:any[] = [];
  ORDEN_VENTA_DETAILS:any[] = [];
  codigo:string = "Calculando codigo..."
  product_id:any = null

  totalCarrito: number = 0;

  margen_ganancia: number = 30;

  order_venta_id:any
  cliente_id:any

  loading:boolean = true
  loadingProducts:boolean = true
  carritoActualizado:boolean = true

  imageCache: Map<string, string> = new Map();
  activeDropdownIndex: number | null = null;

  sweet:any = new SweetalertService
  user:any = new UserLocalStorageService
  searchTerm: string = '';
  guia_prestamo:any = null
  mostrarSelectOrigen: boolean = false;
  mostrarOpcionGuia:boolean = false;
  orden_venta_data:any
  private tempOrigenSeleccionado: any;
  private origenSubscription: any;

  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    //llamamos al servicio
    public ventaService: VentasService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.ventaForm = this.fb.group({
      product_id: [null, [Validators.required]],
      orden_venta_id: ['', [Validators.required]],
      cliente_id: ['', [Validators.required]],
      total: ['0.00', [Validators.required]],
      tipo_precio: ['', Validators.required],
      select_origen: [false],
      origen_seleccionado: ['0'],
      user: [this.user.getUser()]
    });

    this.route.queryParams.subscribe(params => {
      const idFromUrl = params['id'];
      const idFromStorage = localStorage.getItem('orden_venta_id');

      if (idFromUrl) {
        // 🛠️ Modo edición con ID en URL
        this.order_venta_id = idFromUrl;
        localStorage.setItem('orden_venta_id', idFromUrl);

        this.ventaService.registerOrdenVenta({
          crear_orden_venta: false,
          orden_venta_id: idFromUrl
        }).subscribe((resp: any) => {
          this.handleOrdenVentaResponse(resp);
        });

      } else if (idFromStorage) {
        // ⏳ Reanudar guía pendiente
        this.order_venta_id = idFromStorage;

        this.ventaService.registerOrdenVenta({
          crear_orden_venta: false,
          orden_venta_id: idFromStorage
        }).subscribe((resp: any) => {
          this.handleOrdenVentaResponse(resp);
        });

      } else {
        // 🆕 Crear nueva guía
        this.ventaService.registerOrdenVenta({
          crear_orden_venta: true,
          usar_guia_prestamo: this.route.snapshot.queryParamMap.get('make_with_guia_prestamo') === 'true'
        }).subscribe((resp: any) => {
          this.order_venta_id = resp.orden_venta_id;
          localStorage.setItem('orden_venta_id', this.order_venta_id);
          this.handleOrdenVentaResponse(resp);
        });
      }
    });

    this.tempOrigenSeleccionado = this.ventaForm.get('origen_seleccionado')?.value;

    this.origenSubscription = this.ventaForm.get('origen_seleccionado')?.valueChanges.subscribe(nuevoValor => {
      if (nuevoValor !== this.tempOrigenSeleccionado) {
        // Solo confirmar si hay productos
        if (this.ORDEN_VENTA_DETAILS && this.ORDEN_VENTA_DETAILS.length > 0) {
          this.confirmarCambioOrigen(nuevoValor);
        } else {
          // Si no hay productos, simplemente cambia
          this.tempOrigenSeleccionado = nuevoValor;
          this.aplicarCambioOrigen(nuevoValor);
        }
      }
    });
  }

  confirmarCambioOrigen(nuevoValor: string) {
    this.sweet.confirmar_habilitado_deshabilitado(
      '¿Estás seguro?',
      'Si cambias de origen se eliminarán todos los productos agregados.',
      '/assets/animations/general/alerta.json',
      'Sí, cambiar origen'
    ).then((result: any) => {
      if (result.isConfirmed) {
        this.tempOrigenSeleccionado = nuevoValor;
        this.ORDEN_VENTA_DETAILS = [];
        this.aplicarCambioOrigen(nuevoValor);
      } else {
        // Revertir visualmente
        this.ventaForm.patchValue({
          origen_seleccionado: this.tempOrigenSeleccionado
        }, { emitEvent: false });
      }
    });
  }

  aplicarCambioOrigen(valor: string) {
    if (valor === '0') {
      this.callProductos();
    } else if (valor === '1') {
      this.useProductosGuiaPrestamo();
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

  private handleOrdenVentaResponse(resp: any) {
    this.CLIENTES_LIST = resp.clientes.map((cliente:any) => ({
      ...cliente,
      nombre_completo: `${cliente.ruc} - ${cliente.razon_social} - ${cliente.nombre_comercial} - ${cliente.direccion} - ${cliente.distrito}`
    }));
    this.orden_venta_data = resp.orden_venta_data;
    this.TRANSPORTES_LIST = resp.transportes;
    this.PRODUCT_LIST = resp.productos;
    this.codigo = resp.codigo;
    this.order_venta_id = resp.orden_venta_id;
    this.ORDEN_VENTA_DETAILS = this.agruparMovimientosPorProducto(resp.movimiento);
    this.cliente_id = resp.cliente_id
    this.PRODUCT_GUIA_PRESTAMO_LIST = resp.productos_guia_prestamo

    /* if (resp.guia_prestamo_id) {
      this.guia_prestamo = resp.guia_prestamo_codigo;
      this.mostrarOpcionGuia = true;
      this.ventaForm.patchValue({ origen_seleccionado: '1' });
      this.useProductosGuiaPrestamo();
    } else if (resp.productos_guia_prestamo && resp.productos_guia_prestamo.length > 0) {
      this.guia_prestamo = resp.guia_prestamo_codigo;
      this.mostrarOpcionGuia = true;
      this.ventaForm.patchValue({ origen_seleccionado: '0' });
    } else { */
      this.mostrarOpcionGuia = false;
      this.ventaForm.patchValue({ origen_seleccionado: '0' });
    /* } */

    // Mostrar el select solo cuando ya se obtuvo respuesta
    this.mostrarSelectOrigen = true;
  
    localStorage.setItem('orden_venta_id', this.order_venta_id.toString());
    this.evaluarProductosCarrito()
    this.ventaForm.patchValue({
      orden_venta_id: this.order_venta_id,
      cliente_id: this.cliente_id,
    });
  
    this.loading = false;
    this.loadingProducts = false;
    this.cacheImages();
    this.calcularTotales()
    this.actualizarEscalasEnOrden();
  }

  evaluarProductosCarrito(){
    const idsEnCarrito = this.ORDEN_VENTA_DETAILS.map((p: any) => p.producto_id);
    this.PRODUCT_LIST.forEach((producto: any) => {
      producto.in_carrito = idsEnCarrito.includes(producto.id);
    });
  }

  callProductos(){
    this.loadingProducts = true;
    this.PRODUCT_LIST = [];
    this.ventaForm.patchValue({
      product_id: null
    });
    const ordenProductosIds = this.ORDEN_VENTA_DETAILS.map(p => p.producto_id);
    this.ventaService.callProducts({orden_productos_ids: ordenProductosIds}).subscribe((resp: any) => {
      this.PRODUCT_LIST = resp.productos.map((p: any) => ({ ...p })); // Crear copias independientes
      this.loadingProducts = false;
      this.cacheImages()
      this.evaluarProductosCarrito()
      this.actualizarEscalasEnOrden();
    });
  }

  useProductosGuiaPrestamo(){
    this.loadingProducts = true;
    this.PRODUCT_LIST = [];
    this.PRODUCT_LIST = this.PRODUCT_GUIA_PRESTAMO_LIST;
    this.ventaForm.patchValue({
      product_id: null
    });
    this.loadingProducts = false;
  }

  actualizarEscalasEnOrden() {
    if (!this.ORDEN_VENTA_DETAILS || !Array.isArray(this.ORDEN_VENTA_DETAILS)) return;

    this.ORDEN_VENTA_DETAILS.forEach(detalle => {
      const productoActualizado = this.PRODUCT_LIST.find(p => p.id === detalle.producto_id);

      if (productoActualizado && productoActualizado.maneja_escalas) {
        // Actualiza las escalas
        detalle.escalas = productoActualizado.escalas || [];
      }
    });
  }

  getEscalaActiva(escalas: any[], cantidad: number): any {
    if (!escalas || escalas.length === 0) return null;
    return escalas
      .filter(e => cantidad >= e.cantidad)
      .sort((a, b) => b.cantidad - a.cantidad)[0] || null;
  }

  cacheImages() {
    this.PRODUCT_LIST.forEach(product => {
      // Verificar si la imagen ya está en el cache
      if (!this.imageCache.has(product.id)) {
        // Si la imagen es la predeterminada, no intentamos cargarla
        if (product.imagen === 'http://127.0.0.1:8000/storage/default/default_boned.webp') {
          product.cachedImage = product.imagen; // Usar imagen predeterminada directamente
          this.imageCache.set(product.id, product.imagen); // Cachear imagen predeterminada
        } else {
          // Intentar cargar la imagen
          fetch(product.imagen)
            .then(response => {
              if (!response.ok) {
                // Si la respuesta no es exitosa, establecer imagen predeterminada
                throw new Error(`Failed to fetch image: ${response.status}`);
              }
              return response.blob();
            })
            .then(blob => {
              if (this.imageCache.has(product.id)) {
                URL.revokeObjectURL(this.imageCache.get(product.id)!);
              }
  
              const objectURL = URL.createObjectURL(blob);
              this.imageCache.set(product.id, objectURL);
              product.cachedImage = objectURL; // Asignar la imagen cargada al producto
            })
            .catch(error => {
              // Si hay error al cargar la imagen, usar la imagen por defecto
              product.cachedImage = 'http://127.0.0.1:8000/storage/default/default_boned.webp';
              this.imageCache.set(product.id, product.cachedImage); // Cachear la imagen predeterminada
            });
        }
      } else {
        // Si la imagen ya está en cache, usar la versión cacheada
        product.cachedImage = this.imageCache.get(product.id)!;
      }
    });
  }

  callProductDetail(producto_id:any) {
    if(!producto_id){
      return
    }
    this.ventaForm.patchValue({product_id: null})
    if(this.ORDEN_VENTA_DETAILS.find(p => p.producto_id === producto_id)){
      this.sweet.alerta('Aguanta','ya registraste ese producto en tu orden de venta')
      return
    }
    const productoSeleccionado = this.PRODUCT_LIST.find((producto: any) => producto.id === producto_id);

    const modalRef = this.modalService.open(ProductoSelectedComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.ORDER_VENTA_ID = this.order_venta_id
    modalRef.componentInstance.PRODUCT_SELECTED = productoSeleccionado
    const sub = modalRef.componentInstance.ProductoGestionado.subscribe((productos:any)=>{
      const productosAgrupados = this.agruparMovimientosPorProducto(productos);
      productosAgrupados.forEach(productoAgrupado => {
        this.ORDEN_VENTA_DETAILS.push(productoAgrupado);
      });
      this.calcularTotales();
      this.cdr.detectChanges();

      this.sweet.successTimmer(
        '¡Éxito!',
        'producto agregado'
      );
      /* productoSeleccionado.in_carrito = true; */
      this.callProductos()
    })

    modalRef.result.finally(() => {
      sub.unsubscribe();
    });
  }

  calcularTotales() {
    this.totalCarrito = this.ORDEN_VENTA_DETAILS.reduce((acc, item) => {
      return acc + (Number(item.cantidad) * Number(item.pventa_nuevo));
    }, 0);
    this.ventaForm.patchValue({
      total: this.totalCarrito.toFixed(2),
    }, { emitEvent: false });
  }

  eliminarItem(P: any) {
    let message = "eliminaras los movimientos del producto"
    this.sweet.confirmar_borrado(
      '¿Estás seguro?', 
      `${message}: 
        <span class="text-primary">${P.laboratorio}</span> 
        <span class="text-success">${P.nombre}</span> 
        <span class="text-warning">${P.caracteristicas}</span>?`
    ).then((result:any) => {
      if (result.isConfirmed) {
        this.ventaService.eliminarMovimientosProducto(P.producto_id, this.order_venta_id).subscribe({
          next: (resp) => {
            this.ORDEN_VENTA_DETAILS = this.ORDEN_VENTA_DETAILS.filter(item => item.producto_id !== P.producto_id);
            this.calcularTotales();
            this.sweet.success('¡Eliminado!', 'Se eliminaron los movimientos de este producto.','/assets/animations/general/borrado_exitoso.json');
            this.callProductos()
          },
          error: (err) => {
            this.sweet.error('Error', 'No se pudo eliminar el producto');
          }
        });
      }
    });
  }

  agruparMovimientosPorProducto(movimientos: any[]): any[] {
    const agrupadoPorProducto: any = {};

    movimientos.forEach((movimiento: any) => {
      const productoID = movimiento.producto_id;

      if (!agrupadoPorProducto[productoID]) {
        agrupadoPorProducto[productoID] = {
          cantidad: 0,
          caracteristicas: movimiento.caracteristicas,
          color_laboratorio: movimiento.color_laboratorio,
          imagen: movimiento.imagen,
          laboratorio: movimiento.laboratorio,
          nombre: movimiento.nombre,
          producto_id: productoID,
          pventa: movimiento.pventa,
          pventa_nuevo: movimiento.pventa,
          sku: movimiento.sku,
          tipo_promocion: movimiento.tipo_promocion,
          total: 0,
          lotes_detalle: [],
        };
      }

      agrupadoPorProducto[productoID].cantidad += Number(movimiento.cantidad);
      agrupadoPorProducto[productoID].total += Number(movimiento.total);

      agrupadoPorProducto[productoID].lotes_detalle.push({
        lote: movimiento.lote,
        fecha_vencimiento: movimiento.fecha_vencimiento,
        cantidad: movimiento.cantidad,
      });
    });

    return Object.values(agrupadoPorProducto);
  }

  customSearchFn(term: string, item: any): boolean {
    term = term.toLowerCase();
    return item.nombre?.toLowerCase().includes(term) ||
            item.caracteristicas?.toLowerCase().includes(term) ||
            item.sku?.toLowerCase().includes(term);
  }

  viewImagen(image:string){
      const modalRef = this.modalService.open(ViewImageComponent,{centered:true, size: 'md'})
      modalRef.componentInstance.IMAGE_SELECTED = image
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  //FUNCIONES PARA MODIFICAR LA TABLA

  // Se llama al comenzar la edición
  iniciarEdicion(P: any) {
    if (!P.editando) {
      P.editando = true;
      P.cantidadOriginal = P.cantidad;
    }
  }

  // Se llama si el input cambia
  activarConfirmacion(P: any) {
    if (P.cantidad !== P.cantidadOriginal) {
      P.editando = true;
    }

    this.aplicar_escala(P)
  }

  aplicar_escala(P: any){
    if (P.escalas && P.escalas.length > 0) {
      const escala = this.getEscalaActiva(P.escalas, P.cantidad);
      if (escala) {
        P.pventa_nuevo = parseFloat(escala.precio);
      } else {
        // Si no hay escala, buscar el precio base en PRODUCT_LIST
        const productoOriginal = this.PRODUCT_LIST.find(prod => prod.id === P.producto_id);
        P.pventa_nuevo = productoOriginal ? parseFloat(productoOriginal.pventa) : parseFloat(P.pventa);
      }
    }else{
      // Si no hay escala, buscar el precio base en PRODUCT_LIST
        const productoOriginal = this.PRODUCT_LIST.find(prod => prod.id === P.producto_id);
        P.pventa_nuevo = productoOriginal ? parseFloat(productoOriginal.pventa) : parseFloat(P.pventa);
    }

    P.total = P.pventa_nuevo * P.cantidad;
  }

  // Cambiar con botones + y -
  cambiarCantidad(index: number, cambio: number) {
    const P = this.ORDEN_VENTA_DETAILS[index];
    this.iniciarEdicion(P);
  
    const nuevaCantidad = P.cantidad + cambio;
    if (nuevaCantidad < 1) return;
  
    P.cantidad = nuevaCantidad;
    this.activarConfirmacion(P);
    this.calcularTotales();
  }

  // Confirmar el cambio (llama API)
  confirmarCambio(P: any) {
    if (P.cantidad <= 0) {
      this.sweet.alerta('Cantidad inválida', 'La cantidad debe ser mayor a 0');
      return;
    }

    if (P.cantidad === P.cantidadOriginal) {
      this.sweet.alerta('Sin cambios', 'No se ha modificado la cantidad');
      P.editando = false;
      return;
    }

    /* this.spinner.show(); */

    const data = {
      orden_venta_id: this.order_venta_id,
      producto_id: P.producto_id,
      cantidad: P.cantidad
    };

    this.ventaService.editarCantidadProducto(data).subscribe({
      next: (response: any) => {
        // agrupamos los nuevos movimientos devueltos por el backend
        const agrupados = this.agruparMovimientosPorProducto(response.movimiento);

        // reemplazamos el producto editado en orden_venta_details
        const index = this.ORDEN_VENTA_DETAILS.findIndex((m: any) => m.producto_id === P.producto_id);
        if (index !== -1) {
          this.ORDEN_VENTA_DETAILS.splice(index, 1, ...agrupados);
        }

        this.sweet.success('Cantidad actualizada', 'El cambio se realizó correctamente.');
        this.calcularTotales();
        this.callProductos()
      },
    });
  }

  // Cancelar y volver al valor anterior
  cancelarCambio(P: any) {
    P.cantidad = P.cantidadOriginal;
    P.editando = false;
    delete P.cantidadOriginal;

    /* this.aplicar_escala(P) */
    P.pventa_nuevo = P.pventa;
    P.total = P.pventa * P.cantidad;
    this.calcularTotales();
  }

  validarNumero(event: KeyboardEvent, P: any): void {
    const key = event.key;
  
    // Permitir solo números y algunas teclas de control
    const esNumero = /^\d$/.test(key);
    const teclasPermitidas = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
  
    if (!esNumero && !teclasPermitidas.includes(key)) {
      event.preventDefault();
      return;
    }
  
    // Evitar que se escriba 0 como primer dígito
    if (key === "0" && (!P.cantidad || P.cantidad.toString() === "0")) {
      event.preventDefault();
      P.cantidad = 1;
    }
  }

  validarVacio(P: any): void {
    if (!P.cantidad || P.cantidad < 1) {
      P.cantidad = 1;
    }
  }

  siguientePaso() {
    if(this.ORDEN_VENTA_DETAILS.length <= 0){
      this.sweet.alerta('Ey','tu orden de venta está vacía');
      return
    }
    const clienteId = this.ventaForm.value.cliente_id;
    const tprecio = this.ventaForm.value.tipo_precio;
    
    this.onPaso1Listo.emit({
      /* cliente: clienteId, */
      cliente: null,
      clientes: this.CLIENTES_LIST,
      transportes: this.TRANSPORTES_LIST,
      order_venta_data: this.orden_venta_data,
      t_precio: tprecio
    });
  }
}
