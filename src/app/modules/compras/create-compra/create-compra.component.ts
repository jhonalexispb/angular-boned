import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { CreateProveedorComponent } from '../../configuration/proveedor/create-proveedor/create-proveedor.component';
import { CompraService } from '../service/compra.service';
import { GestionarLaboratorioComponent } from '../../configuration/proveedor/gestionar-laboratorio/gestionar-laboratorio.component';
import { CreateProductComponent } from '../../products/create-product/create-product.component';
import { ProductoSeleccionadoComponent } from '../producto-seleccionado/producto-seleccionado.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { UserLocalStorageService } from '../../users/service/userLocalStorage.service';

@Component({
  selector: 'app-create-compra',
  templateUrl: './create-compra.component.html',
  styleUrls: ['./create-compra.component.scss']
})
export class CreateCompraComponent {
  @Output() OrdenCompraC:EventEmitter<any> = new EventEmitter();
  @ViewChild('proveedorSelect') proveedorSelect: NgSelectComponent;
  compraForm: FormGroup;

  LABORATORIOS_LIST:any[] = [];
  PROVEEDORES_LIST:any[] = [];
  PRODUCT_LIST:any[] = [];
  COMPRA_DETAILS:any[] = [];
  codigo:string = "Calculando codigo..."
  FORMA_PAGO_LIST:any[] = [];
  TIPO_COMPROBANTE_LIST:any[] = [];
  product_id:any = null
  activeDropdownIndex: number | null = null;

  subtotal: number = 0;
  impuesto: number = 0;
  totalCarrito: number = 0;
  igv:number = 0.18

  loading:boolean = true
  loadingProducts:boolean = true
  carritoActualizado:boolean = true

  searchTermProveedores: string = '';
  isManualChange: boolean = false;
  tempProveedorId: number | null = null;
  tempProveedorName: string | null = null;

  imageCache: Map<string, string> = new Map();

  sweet:any = new SweetalertService
  user:any = new UserLocalStorageService

  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    //llamamos al servicio
    public compraService: CompraService
  ) {}

  ngOnInit(): void {
    this.compraForm = this.fb.group({
      laboratorio_id: [[], [Validators.required]],
      proveedor_id: [null, [Validators.required]],
      proveedor_name: [null, [Validators.required]],
      product_id: [null, [Validators.required]],
      forma_pago_id: ["", [Validators.required]],
      type_comprobante_compra_id: ["", [Validators.required]],
      igv: [false, [Validators.required]],
      total:['0.00', [Validators.required]],
      impuesto:['0.00', [Validators.required]],
      sub_total:['0.00', [Validators.required]],
      user: [this.user.getUser()] 
    });

    this.compraForm.valueChanges.subscribe(values => {
        localStorage.setItem('compra_form', JSON.stringify(values));
    });

    this.compraService.obtenerRecursosParaCrear().subscribe((resp: any) => {
      this.PROVEEDORES_LIST = resp.proveedores;
      this.FORMA_PAGO_LIST = resp.forma_pago;
      this.TIPO_COMPROBANTE_LIST = resp.tipo_comprobante;
      this.codigo = resp.codigo;
      this.loading = false;
      this.loadingProducts = false;

      const formGuardado = localStorage.getItem('compra_form');
      if (formGuardado) {
        const valoresRecuperados = JSON.parse(formGuardado);
        this.compraForm.patchValue(valoresRecuperados);

        const proveedorId = valoresRecuperados.proveedor_id;
        const laboratorioId = valoresRecuperados.laboratorio_id;
        this.tempProveedorId = valoresRecuperados.proveedor_id;
        this.tempProveedorName = valoresRecuperados.proveedor_name;

        if(this.compraForm.get('igv')?.value){
          this.igv = 0
        }

        if (proveedorId) {
          this.onProveedorSeleccionado(proveedorId);

          setTimeout(() => {
            this.compraForm.patchValue({ laboratorio_id: laboratorioId });
            this.callProductos()
            const compraGuardada = localStorage.getItem('compra_details');
            if (compraGuardada) {
              this.COMPRA_DETAILS = JSON.parse(compraGuardada);
              this.calcularTotales();
            }
          }, 100);
        }
      }
    });
  }

  ngAfterViewInit() {
    this.proveedorSelect.focus();
  }

  onSearchProveedor(event: any) {
    this.searchTermProveedores = event.term;
  }

  onSubmit() {
    if (this.compraForm.valid) {
      /* this.compraService.registerProducto(this.compraForm.value).subscribe({
        next: (resp: any) => {
          this.OrdenCompraC.emit(resp);
          this.sweet.success(
            '¡Éxito!',
            'el producto se registró correctamente'
          );
        },
      }) */
    }

  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  onProveedorChange(proveedorId: number) {
    this.isManualChange = true;
    this.onProveedorSeleccionado(proveedorId);
  }

  onProveedorSeleccionado(proveedorId: number) {
    const actualizarLaboratorios = (proveedorId: number) => {
      const proveedorSeleccionado = this.PROVEEDORES_LIST.find(p => p.id === proveedorId);
      if (proveedorSeleccionado) {
        this.LABORATORIOS_LIST = proveedorSeleccionado.laboratorios;
        this.compraForm.patchValue({
          laboratorio_id: [],
          proveedor_name: proveedorSeleccionado.name
        });
        this.tempProveedorId = proveedorSeleccionado.id
        this.tempProveedorName = proveedorSeleccionado.name
        this.callProductos();
      }
    };
  
    if (this.COMPRA_DETAILS.length > 0 && this.isManualChange && this.tempProveedorId != null) {
      this.sweet
        .confirmar_habilitado_deshabilitado(
          '¿Estás seguro?',
          `Si cambias de proveedor se eliminarán todos los productos agregados.`,
          '/assets/animations/general/alerta.json',
          'Sí, cambiemos de proveedor'
        )
        .then((result: any) => {
          if (result.isConfirmed) {
            this.LABORATORIOS_LIST = [];
            actualizarLaboratorios(proveedorId);
            this.COMPRA_DETAILS = []
            localStorage.setItem('compra_details', JSON.stringify([]));
            this.compraService.actualizarCarritoCompra()
            this.callProductos()
          }else{
            this.compraForm.patchValue({
              proveedor_id: this.tempProveedorId,
              proveedor_name: this.tempProveedorName
            });
          }
        });
    } else {
      actualizarLaboratorios(proveedorId);
    }
  }

  callProductos(){
    this.loadingProducts = true;
    this.PRODUCT_LIST = [];
    this.compraForm.patchValue({
      product_id: null
    });

    // Obtener los laboratorios seleccionados
    const laboratorioSeleccionado = this.compraForm.value.laboratorio_id; 

    if (!laboratorioSeleccionado || laboratorioSeleccionado.length === 0) {
      this.loadingProducts = false;
      return;
    }

    const laboratorioIds = laboratorioSeleccionado
    .map((id:any) => this.LABORATORIOS_LIST.find(lab => lab.id === id)?.laboratorio_id)
    .filter((labId:any) => labId !== undefined); // Filtrar valores `undefined` por seguridad

    if (laboratorioIds.length === 0) {
      this.loadingProducts = false;
      return;
    }

    this.compraService.callProductsByLaboratorio(laboratorioIds).subscribe((resp: any) => {
      this.PRODUCT_LIST = resp.productos;
      this.actualizarProductosConCarritoInicial();
      this.loadingProducts = false;
      this.cacheImages()
    });
  }

  actualizarProductosConCarritoInicial() {
    const compraGuardada = localStorage.getItem('compra_details');
    if (compraGuardada) {
      this.PRODUCT_LIST = this.PRODUCT_LIST.map(producto => {
        if (this.COMPRA_DETAILS.find(item => item.producto_id === producto.id)) {
          return { ...producto, in_carrito: true };
        }
        return producto;
      });
    }
    this.carritoActualizado = false
  }

  createProveedor(){
    const modalRef = this.modalService.open(CreateProveedorComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermProveedores;
    modalRef.componentInstance.ProveedorC.subscribe((r: any) => {
      this.PROVEEDORES_LIST = [r, ...this.PROVEEDORES_LIST];
      this.compraForm.patchValue({ proveedor_id: r.id,proveedor_name: r.name });
      this.compraForm.patchValue({
        laboratorio_id: []
      });
    });
  }

  gestionarLaboratoriosProveedor(idProveedor:any){
    const modalRef = this.modalService.open(GestionarLaboratorioComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PROVEEDOR_ID = idProveedor
    modalRef.componentInstance.LIST_LABORATORIOS_ACTUALIZADO.subscribe((nuevaLista: any[]) => {
      if (Array.isArray(nuevaLista)) {
        // Obtener los laboratorios actualmente seleccionados
        let selectedIds: number[] = this.compraForm.get('laboratorio_id')?.value || [];

        // Crear mapas para manejar la lista actual y la nueva lista eficientemente
        const mapActual = new Map(this.LABORATORIOS_LIST.map(lab => [lab.id, lab]));
        const mapNuevo = new Map(nuevaLista.map(lab => [lab.id, lab]));

        // Filtrar laboratorios eliminados
        selectedIds = selectedIds.filter(id => mapNuevo.has(id));

        // Agregar los laboratorios nuevos a la lista
        nuevaLista.forEach(lab => {
          if (!mapActual.has(lab.id)) {
            this.LABORATORIOS_LIST.push(lab);
            selectedIds.push(lab.id);
          }
        });

        // Actualizar la lista de laboratorios con los cambios
        this.LABORATORIOS_LIST = this.LABORATORIOS_LIST.map(lab => 
          mapNuevo.has(lab.id) ? { ...mapNuevo.get(lab.id) } : lab
        );

        this.LABORATORIOS_LIST = nuevaLista

        // Aplicar los IDs actualizados al formulario
        this.compraForm.patchValue({ laboratorio_id: selectedIds });
        this.callProductos()
      }
    });
  }

  createProducto(){
    const modalRef = this.modalService.open(CreateProductComponent,{centered:true, size: 'xl'})
    const laboratorios_id = this.compraForm.get('laboratorio_id')?.value;
    const labs_selec = this.LABORATORIOS_LIST
      .filter((lab: any) => laboratorios_id.includes(lab.id))
      .map((lab:any) => ({
        id: lab.laboratorio_id,
        name:lab.name
      }))
    modalRef.componentInstance.LABORATORIOS_SELECCIONADOS_POR_COMPRA = labs_selec
    modalRef.componentInstance.isButtonVisible = false;
    modalRef.componentInstance.ProductoC.subscribe((r:any)=>{
      this.PRODUCT_LIST = [r.data, ...this.PRODUCT_LIST];
      this.compraForm.patchValue({ product_id: r.data.id })
      this.cacheImages()
    })
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
    this.compraForm.patchValue({product_id: null})
    if(this.COMPRA_DETAILS.find(p => p.producto_id === producto_id)){
      this.sweet.alerta('Aguanta','ya registraste ese producto en tu orden de compra')
      return
    }
    const productoSeleccionado = this.PRODUCT_LIST.find((producto: any) => producto.id === producto_id);
    const laboratorio_id = this.LABORATORIOS_LIST.find((lab: any) => lab.laboratorio_id === productoSeleccionado.laboratorio_id);
    const modalRef = this.modalService.open(ProductoSeleccionadoComponent,{centered:true, size: 'xl'})
    modalRef.componentInstance.PRODUCTO_ID = producto_id
    modalRef.componentInstance.PRODUCT_SELECTED = productoSeleccionado
    modalRef.componentInstance.LABORATORIO_ID = laboratorio_id
    modalRef.componentInstance.ProductoComprado.subscribe((producto:any)=>{
      this.COMPRA_DETAILS.push({
        producto_id: producto_id,
        laboratorio: productoSeleccionado.laboratorio,
        color_laboratorio: laboratorio_id.color,
        nombre: productoSeleccionado.nombre,
        caracteristicas: productoSeleccionado.caracteristicas,
        sku: productoSeleccionado.sku,
        cantidad: Number(producto.cantidad),
        condicion_vencimiento: producto.condicion_vencimiento,
        fecha_vencimiento: producto.fecha_vencimiento,
        margen_minimo: producto.margen_minimo,
        meses: producto.meses,
        pcompra: producto.pcompra,
        pventa: producto.pventa,
        total: producto.total,
        ganancia: producto.ganancia,
      })
      localStorage.setItem('compra_details', JSON.stringify(this.COMPRA_DETAILS));
      this.calcularTotales();
      this.cdr.detectChanges();
      this.compraService.actualizarCarritoCompra()

      this.sweet.successTimmer(
        '¡Éxito!',
        'producto agregado'
      );
      productoSeleccionado.in_carrito = true;
    })
  }

  calcularTotales() {
    this.subtotal = this.COMPRA_DETAILS.reduce((acc, item) => acc + item.total, 0);
    this.impuesto = this.subtotal * this.igv;
  
    this.totalCarrito = this.subtotal + this.impuesto;
    this.compraForm.patchValue({
      total: this.totalCarrito,
      impuesto: this.impuesto,
      sub_total: this.subtotal
    }, { emitEvent: false })
  }

  setearIgv(){
    const condicion  = this.compraForm.get('igv')?.value
    this.igv = condicion ? 0 : 0.18;
    this.calcularTotales()
  }

  eliminarItem(PROD:any){
    this.sweet.confirmar_borrado(
      '¿Estás seguro?', 
      `¿Deseas eliminar el producto: 
        <span class="text-primary">${PROD.laboratorio}</span> 
        <span class="text-success">${PROD.nombre}</span> 
        <span class="text-warning">${PROD.caracteristicas}</span>?`
    ).then((result: any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, eliminamos el producto
        this.COMPRA_DETAILS = this.COMPRA_DETAILS.filter((producto: any) => producto.producto_id !== PROD.producto_id); // Eliminar el producto de la lista
        // Actualizamos el localStorage
        localStorage.setItem('compra_details', JSON.stringify(this.COMPRA_DETAILS));
        const productoSeleccionado = this.PRODUCT_LIST.find((producto: any) => producto.id === PROD.producto_id);
        productoSeleccionado.in_carrito = false;
        this.calcularTotales();
        this.compraService.actualizarCarritoCompra()
        // Mostrar mensaje de éxito
        this.sweet.success('Eliminado', 'El producto ha sido eliminado correctamente', '/assets/animations/general/borrado_exitoso.json');
      }
    });
  }

  //FUNCIONES PARA MODIFICAR LA TABLA

  cambiarCantidad(index: number, cambio: number) {
    if (this.COMPRA_DETAILS[index].cantidad + cambio > 0) {
      this.COMPRA_DETAILS[index].cantidad += cambio;
      this.actualizarValores(index);
    }
  }

  actualizarFecha(index: number) {
    let item = this.COMPRA_DETAILS[index];
    if (!item) return;

    localStorage.setItem('compra_details', JSON.stringify(this.COMPRA_DETAILS));
  }

  actualizarValores(index: number) {
    let item = this.COMPRA_DETAILS[index];
    if (!item) return;
  
    // Verificar que pcompra y margen_minimo sean números válidos
    let pcompra = parseFloat(item.pcompra);
    let margen_minimo = parseFloat(item.margen_minimo);
    
    if (isNaN(pcompra) || isNaN(margen_minimo)) {
      return; // Sale si los valores no son válidos
    }
  
    // Realiza los cálculos si son números válidos
    let nuevoPventa = pcompra + (pcompra * (margen_minimo / 100));
    item.pventa = parseFloat(nuevoPventa.toFixed(2));
  
    // Calcular el total
    let nuevoTotal = item.cantidad * pcompra;
    item.total = parseFloat(nuevoTotal.toFixed(2));
  
    // Calcular la ganancia
    let nuevaGanancia = (item.pventa - pcompra) * item.cantidad;
    item.ganancia = parseFloat(nuevaGanancia.toFixed(2));

    localStorage.setItem('compra_details', JSON.stringify(this.COMPRA_DETAILS));
    this.calcularTotales()
  }

  actualizarMargenGanancia(index: number){
    let item = this.COMPRA_DETAILS[index];
    if (!item) return;
  
    let pcompra = parseFloat(item.pcompra);
    let pventa = parseFloat(item.pventa);
    
    if (isNaN(pcompra) || isNaN(pventa)) {
      return;
    }
  
    let nuevoMargen = ((pventa - pcompra)/pcompra)*100;
    item.margen_minimo = parseFloat(nuevoMargen.toFixed(2));
  
    let nuevaGanancia = (item.pventa - pcompra) * item.cantidad;
    item.ganancia = parseFloat(nuevaGanancia.toFixed(2));

    localStorage.setItem('compra_details', JSON.stringify(this.COMPRA_DETAILS));
  }
  

  validarPrecio(event: any, index: number, tipo: string) {
    let valor = event.target.value;
  
    // Reemplazar todo lo que no sea número o punto decimal
    valor = valor.replace(/[^0-9.]/g, '');
  
    let partes = valor.split('.');
  
    // Si hay más de un punto decimal, conservar solo el primero
    if (partes.length > 2) {
      valor = partes[0] + '.' + partes.slice(1).join('');
    }
  
    // Si empieza con un punto, agregar un '0' al inicio
    if (valor.startsWith('.')) {
      valor = '0' + valor;
    }
  
    // Limitar a 2 decimales si hay una parte decimal
    if (partes.length === 2) {
      partes[1] = partes[1].substring(0, 2);
      valor = partes.join('.');
    }
  
    // **Asignar el valor corregido al input**
    event.target.value = valor;

    if (tipo === 'pcompra') {
      this.COMPRA_DETAILS[index].pcompra = parseFloat(valor) || 0;
      this.actualizarValores(index);
    } else if (tipo === 'pventa') {
      this.COMPRA_DETAILS[index].pventa = parseFloat(valor) || 0;
      this.actualizarMargenGanancia(index);
    } else if (tipo === 'margen_minimo') {
      this.COMPRA_DETAILS[index].margen_minimo = parseFloat(valor) || 0;
      this.actualizarValores(index);
    }
  }

  toggleCondicionVencimiento(index: number) {
    let item = this.COMPRA_DETAILS[index];
    if (!item) return;
  
    // Alternar el valor de condicion_vencimiento entre 0 y 1
    item.condicion_vencimiento = item.condicion_vencimiento === 1 ? 0 : 1;
  
    // Actualizar COMPRA_DETAILS en localStorage
    localStorage.setItem('compra_details', JSON.stringify(this.COMPRA_DETAILS));
  }
}
