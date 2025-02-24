import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { CreateProveedorComponent } from '../../configuration/proveedor/create-proveedor/create-proveedor.component';
import { CompraService } from '../service/compra.service';
import { GestionarLaboratorioComponent } from '../../configuration/proveedor/gestionar-laboratorio/gestionar-laboratorio.component';
import { CreateProductComponent } from '../../products/create-product/create-product.component';
import { ProductoSeleccionadoComponent } from '../producto-seleccionado/producto-seleccionado.component';
import { NgSelectComponent } from '@ng-select/ng-select';

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
  descuento: number = 0;
  impuesto: number = 0;
  totalCarrito: number = 0;

  loading:boolean = true
  loadingProducts:boolean = true

  searchTermLaboratorio: string = '';
  searchTermProveedores: string = '';

  imageCache: Map<string, string> = new Map();

  sweet:any = new SweetalertService

  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    //llamamos al servicio
    public compraService: CompraService
  ) {}

  ngOnInit(): void {
    // 1️⃣ Inicializar el formulario primero
    this.compraForm = this.fb.group({
      laboratorio_id: [null, [Validators.required]],
      proveedor_id: [null, [Validators.required]],
      product_id: [null, [Validators.required]],
      forma_pago_id: ["", [Validators.required]],
      type_comprobante_compra_id: ["", [Validators.required]],
      igv: [1],
    });

    // 3️⃣ Suscribirse a los cambios del formulario para guardarlos automáticamente
    this.compraForm.valueChanges.subscribe(values => {
      localStorage.setItem('compra_form', JSON.stringify(values));
    });

    // 4️⃣ Llamar a la API para obtener recursos
    this.compraService.obtenerRecursosParaCrear().subscribe((resp: any) => {
      this.PROVEEDORES_LIST = resp.proveedores;
      this.FORMA_PAGO_LIST = resp.forma_pago;
      this.TIPO_COMPROBANTE_LIST = resp.tipo_comprobante;
      this.codigo = resp.codigo;
      this.loading = false;
      this.loadingProducts = false;

      // Recuperar valores guardados del formulario
      const formGuardado = localStorage.getItem('compra_form');
      if (formGuardado) {
        const valoresRecuperados = JSON.parse(formGuardado);
        this.compraForm.patchValue(valoresRecuperados);

        const proveedorId = valoresRecuperados.proveedor_id;
        const laboratorioId = valoresRecuperados.laboratorio_id;

        if (proveedorId) {
          this.onProveedorSeleccionado(proveedorId);

          // 🟢 Esperar a que LABORATORIOS_LIST se actualice y luego asignar laboratorio_id
          setTimeout(() => {
            this.compraForm.patchValue({ laboratorio_id: laboratorioId });
            this.callProductos()
          }, 100);
        }
      }
    });

    // 5️⃣ Restaurar la lista de productos de la compra
    const compraGuardada = localStorage.getItem('compra_details');
    if (compraGuardada) {
      this.COMPRA_DETAILS = JSON.parse(compraGuardada);
    }
}

  ngAfterViewInit() {
    this.proveedorSelect.focus();
  }

  onSearchLaboratorio(event: any) {
    this.searchTermLaboratorio = event.term;  // Acceder al término de búsqueda desde el evento
  }

  onSearchProveedor(event: any) {
    this.searchTermProveedores = event.term;  // Acceder al término de búsqueda desde el evento
  }

  // Enviar el formulario
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

  onProveedorSeleccionado(proveedorId: number) {
    this.LABORATORIOS_LIST = [];
    // Buscar el proveedor seleccionado en la lista de proveedores
    const proveedorSeleccionado = this.PROVEEDORES_LIST.find(p => p.id === proveedorId);

    // Si encuentra el proveedor, extrae sus laboratorios
    if (proveedorSeleccionado) {
        this.LABORATORIOS_LIST = proveedorSeleccionado.laboratorios;
        this.compraForm.patchValue({
          laboratorio_id: []
        });
        this.callProductos()
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
      this.loadingProducts = false;
      this.cacheImages()
    });
  }

  createProveedor(){
    const modalRef = this.modalService.open(CreateProveedorComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermProveedores;
    modalRef.componentInstance.ProveedorC.subscribe((r: any) => {
      this.PROVEEDORES_LIST = [r, ...this.PROVEEDORES_LIST];
      this.compraForm.patchValue({ proveedor_id: r.id });
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
              product.cachedImage = objectURL;
            })
            .catch(error => {
              console.error(error);
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
    if(producto_id == undefined){
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
      })
      localStorage.setItem('compra_details', JSON.stringify(this.COMPRA_DETAILS));

      this.sweet.successTimmer(
        '¡Éxito!',
        'producto agregado'
      );
    })
  }
}
