import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CreateProveedorComponent } from 'src/app/modules/configuration/proveedor/create-proveedor/create-proveedor.component';
import { GestionarLaboratorioComponent } from 'src/app/modules/configuration/proveedor/gestionar-laboratorio/gestionar-laboratorio.component';
import { CreateProductComponent } from 'src/app/modules/products/create-product/create-product.component';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { UserLocalStorageService } from 'src/app/modules/users/service/userLocalStorage.service';
import { ProductoSeleccionadoComponent } from '../../producto-seleccionado/producto-seleccionado.component';
import { CompraService } from '../../service/compra.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-compra',
  templateUrl: './create-compra.component.html',
  styleUrls: ['./create-compra.component.scss']
})
export class CreateCompraComponent {
  @ViewChild('proveedorSelect') proveedorSelect: NgSelectComponent;
  compraForm: FormGroup;

  LABORATORIOS_LIST:any[] = [];
  PROVEEDORES_LIST:any[] = [];
  PRODUCT_LIST:any[] = [];
  PRODUCT_LIST_BONIFICACION:any[] = [];
  COMPRA_DETAILS:any[] = [];
  codigo:string = "Calculando codigo..."
  FORMA_PAGO_LIST:any[] = [];
  TIPO_COMPROBANTE_LIST:any[] = [];
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
    public compraService: CompraService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.compraForm = this.fb.group({
      laboratorio_id: [[], [Validators.required]],
      proveedor_id: [null, [Validators.required]],
      product_id_bonificacion: [null],
      proveedor_name: [null, [Validators.required]],
      product_id: [null, [Validators.required]],
      forma_pago_id: ["", [Validators.required]],
      type_comprobante_compra_id: ["", [Validators.required]],
      igv: [false, [Validators.required]],
      total:['0.00', [Validators.required]],
      impuesto:['0.00', [Validators.required]],
      sub_total:['0.00', [Validators.required]],
      user: [this.user.getUser()],
      notificacion:[true, [Validators.required]],
      mensaje_notificacion:['', [Validators.required]],
      fecha_ingreso:['', [Validators.required]],
      descripcion:[''],
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
    this.PRODUCT_LIST_BONIFICACION = [];
    this.compraForm.patchValue({
      product_id: null,
      product_id_bonificacion:null
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
      this.PRODUCT_LIST_BONIFICACION = resp.productos;
      this.actualizarProductosConCarritoInicial();
      this.loadingProducts = false;
      this.cacheImages()
    });
  }

  actualizarProductosConCarritoInicial() {
    const compraGuardada = localStorage.getItem('compra_details');
    if (compraGuardada) {
        this.COMPRA_DETAILS = JSON.parse(compraGuardada);
        const productosNormales = this.COMPRA_DETAILS.filter(item => item.bonificacion === false);
        const productosBonificados = this.COMPRA_DETAILS.filter(item => item.bonificacion === true);
      
        const mapNormales = new Map(productosNormales.map(item => [item.producto_id, true]));
        const mapBonificados = new Map(productosBonificados.map(item => [item.producto_id, true]));

        this.PRODUCT_LIST = this.PRODUCT_LIST.map(producto => ({
            ...producto,
            in_carrito: mapNormales.has(producto.id)
        }));

        this.PRODUCT_LIST_BONIFICACION = this.PRODUCT_LIST_BONIFICACION.map(producto => ({
            ...producto,
            in_carrito: mapBonificados.has(producto.id)
        }));
    }

    this.carritoActualizado = false;
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
      this.PRODUCT_LIST_BONIFICACION = [r.data, ...this.PRODUCT_LIST_BONIFICACION];
      this.compraForm.patchValue({ product_id: r.data.id })
      this.cacheImages()
    })
  }

  async cacheImages() {
    const cacheProductImage = async (productList: any[]) => {
      await Promise.all(
        productList.map(async (product) => {
          if (!this.imageCache.has(product.id)) {
            if (product.imagen === 'http://127.0.0.1:8000/storage/default/default_boned.webp') {
              product.cachedImage = product.imagen;
              this.imageCache.set(product.id, product.imagen);
            } else {
              try {
                const response = await fetch(product.imagen);
                if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
                
                const blob = await response.blob();
                const objectURL = URL.createObjectURL(blob);
  
                this.imageCache.set(product.id, objectURL);
                product.cachedImage = objectURL;
              } catch (error) {
                product.cachedImage = 'http://127.0.0.1:8000/storage/default/default_boned.webp';
                this.imageCache.set(product.id, product.cachedImage);
              }
            }
          } else {
            product.cachedImage = this.imageCache.get(product.id)!;
          }
        })
      );
    };
  
    await cacheProductImage(this.PRODUCT_LIST);
    await cacheProductImage(this.PRODUCT_LIST_BONIFICACION);
  }

  callProductDetail(producto_id:any, bonificacion:boolean = false) {
    if(!producto_id){
      return
    }

    this.compraForm.patchValue({product_id: null})
    this.compraForm.patchValue({product_id_bonificacion: null})

    if(bonificacion){
      const producto = this.PRODUCT_LIST_BONIFICACION.find(p => p.id === producto_id);
      if(producto.in_carrito){
        this.sweet.alerta('Aguanta','ya registraste la bonificacion ese producto en tu orden de compra')
        return
      }
    }else{
      const producto = this.PRODUCT_LIST.find(p => p.id === producto_id);
      if(producto.in_carrito){
        this.sweet.alerta('Aguanta','ya registraste ese producto en tu orden de compra')
        return
      }
    }

    let productoSeleccionado:any

    if(bonificacion){
      productoSeleccionado = this.PRODUCT_LIST_BONIFICACION.find((producto: any) => producto.id === producto_id);
    }else{
      productoSeleccionado = this.PRODUCT_LIST.find((producto: any) => producto.id === producto_id);
    }
    const laboratorio_id = this.LABORATORIOS_LIST.find((lab: any) => lab.laboratorio_id === productoSeleccionado.laboratorio_id);

    let modalRef:any
    if(bonificacion){
      modalRef = this.modalService.open(ProductoSeleccionadoComponent,{centered:true, size: 'md'})
    }else{
      modalRef = this.modalService.open(ProductoSeleccionadoComponent,{centered:true, size: 'xl'})
    }
    
    modalRef.componentInstance.PRODUCTO_ID = producto_id
    modalRef.componentInstance.PRODUCT_SELECTED = productoSeleccionado
    modalRef.componentInstance.LABORATORIO_ID = laboratorio_id
    modalRef.componentInstance.BONIFICACION = bonificacion
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
        bonificacion: producto.bonificacion
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
    }, { emitEvent: true })
  }

  setearIgv(){
    const condicion  = this.compraForm.get('igv')?.value
    this.igv = condicion ? 0 : 0.18;
    this.calcularTotales()
  }

  eliminarItem(PROD:any){
    let message = "¿Deseas eliminar el producto"
    if(PROD.bonificacion){
      message = "¿Deseas eliminar la bonificacion"
    }

    this.sweet.confirmar_borrado(
      '¿Estás seguro?', 
      `${message}: 
        <span class="text-primary">${PROD.laboratorio}</span> 
        <span class="text-success">${PROD.nombre}</span> 
        <span class="text-warning">${PROD.caracteristicas}</span>?`
    ).then((result: any) => {
      if (result.isConfirmed) {
        this.COMPRA_DETAILS = this.COMPRA_DETAILS.filter((producto: any) => !(producto.producto_id === PROD.producto_id && producto.bonificacion === PROD.bonificacion));
        localStorage.setItem('compra_details', JSON.stringify(this.COMPRA_DETAILS));
        if(PROD.bonificacion){
          const productoSeleccionado = this.PRODUCT_LIST_BONIFICACION.find((producto: any) => producto.id === PROD.producto_id);
          productoSeleccionado.in_carrito = false;
        }else{
          const productoSeleccionado = this.PRODUCT_LIST.find((producto: any) => producto.id === PROD.producto_id);
          productoSeleccionado.in_carrito = false;
        }
        this.calcularTotales();
        this.compraService.actualizarCarritoCompra()
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

  go_calendar(){
    if(!this.compraForm.get('forma_pago_id')?.value){
      this.sweet.formulario_invalido('Ups','selecciona una forma de pago')
      return
    }

    if(!this.compraForm.get('type_comprobante_compra_id')?.value){
      this.sweet.formulario_invalido('Ups','selecciona un tipo de comprobante')
      return
    }

    this.router.navigate(['/compras/register/cronograma']);
  }

  onSubmit() {
    if(!this.compraForm.get('forma_pago_id')?.value){
      this.sweet.formulario_invalido('Ups','selecciona una forma de pago')
      return
    }

    if(!this.compraForm.get('type_comprobante_compra_id')?.value){
      this.sweet.formulario_invalido('Ups','selecciona un tipo de comprobante')
      return
    }
    
    if(this.totalCarrito <= 0){
      this.sweet.alerta('Alerta','tu carrito esta vacio')
      return
    }

    this.sweet.confirmar('¿Estas seguro?',`¿Desea registrar la compra?`,'/assets/animations/general/ojitos.json','Si, hagamoslo','Cancelar').then((result:any) => {
      if (result.isConfirmed) {
        const compraForm = JSON.parse(localStorage.getItem("compra_form") || "{}");
        const compraDetails = JSON.parse(localStorage.getItem("compra_details") || "[]");

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
          }))
        };

        this.compraService.registerOrdenCompra(data).subscribe({
          next: (resp: any) => {
            localStorage.removeItem("compra_form");
            localStorage.removeItem("compra_details");
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
