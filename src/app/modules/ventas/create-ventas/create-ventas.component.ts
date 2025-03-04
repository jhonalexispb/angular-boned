import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { UserLocalStorageService } from '../../users/service/userLocalStorage.service';
import { ProductoSelectedComponent } from '../producto-selected/producto-selected.component';
import { VentasService } from '../service/ventas.service';

@Component({
  selector: 'app-create-ventas',
  templateUrl: './create-ventas.component.html',
  styleUrls: ['./create-ventas.component.scss']
})
export class CreateVentasComponent {
  @Output() OrdenCompraC:EventEmitter<any> = new EventEmitter();
    @ViewChild('productSelect') productSelect: NgSelectComponent;
    ventaForm: FormGroup;
  
    PRODUCT_LIST:any[] = [];
    VENTA_PRODUCTS_DETAILS:any[] = [];
    codigo:string = "Calculando codigo..."
    product_id:any = null
  
    subtotal: number = 0;
    impuesto: number = 0;
    totalCarrito: number = 0;

    margen_ganancia: number = 30
  
    loading:boolean = true
    loadingProducts:boolean = true
    carritoActualizado:boolean = true
  
    imageCache: Map<string, string> = new Map();
  
    sweet:any = new SweetalertService
    user:any = new UserLocalStorageService
  
    constructor(
      private fb: FormBuilder,
      public modalService: NgbModal,
      private cdr: ChangeDetectorRef,
      //llamamos al servicio
      public ventaService: VentasService
    ) {}
  
    ngOnInit(): void {
      this.ventaForm = this.fb.group({
        product_id: [null, [Validators.required]],
        carrito_venta_id: ['', [Validators.required]],
        total:['0.00', [Validators.required]],
        impuesto:['0.00', [Validators.required]],
        sub_total:['0.00', [Validators.required]],
        user: [this.user.getUser()] 
      });
  
      this.ventaForm.valueChanges.subscribe(values => {
          localStorage.setItem('venta_form', JSON.stringify(values));
      });
  
      this.ventaService.obtenerRecursosIniciales().subscribe((resp: any) => {
        this.codigo = resp.codigo;
        this.ventaForm.patchValue({carrito_venta_id: resp.carrito_venta_id})
        this.loading = false;
        this.loadingProducts = false;
        this.callProductos()
  
        const formGuardado = localStorage.getItem('venta_form');
        if (formGuardado) {
          const valoresRecuperados = JSON.parse(formGuardado);
          this.ventaForm.patchValue(valoresRecuperados);
  
          const carrito_venta_id = valoresRecuperados.carrito_venta_id;
  
            this.callProductos()
            const compraGuardada = localStorage.getItem('compra_details');
            if (compraGuardada) {
              this.VENTA_PRODUCTS_DETAILS = JSON.parse(compraGuardada);
              this.calcularTotales();
            }
            
          }
        }
      );
    }
  
    ngAfterViewInit() {
      this.productSelect.focus();
    }

  
    onSubmit() {
      if (this.ventaForm.valid) {
        /* this.ventaService.registerProducto(this.ventaForm.value).subscribe({
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
  
    callProductos(){
      this.loadingProducts = true;
      this.PRODUCT_LIST = [];
      this.ventaForm.patchValue({
        product_id: null
      });
  
      this.ventaService.callProducts().subscribe((resp: any) => {
        this.PRODUCT_LIST = resp.productos;
        this.loadingProducts = false;
        this.cacheImages()
      });
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
      if(this.VENTA_PRODUCTS_DETAILS.find(p => p.producto_id === producto_id)){
        this.sweet.alerta('Aguanta','ya registraste ese producto en tu orden de compra')
        return
      }
      const productoSeleccionado = this.PRODUCT_LIST.find((producto: any) => producto.id === producto_id);

      const modalRef = this.modalService.open(ProductoSelectedComponent,{centered:true, size: 'md'})
      modalRef.componentInstance.PRODUCTO_ID = producto_id
      modalRef.componentInstance.PRODUCT_SELECTED = productoSeleccionado
      modalRef.componentInstance.ProductoComprado.subscribe((producto:any)=>{
        this.VENTA_PRODUCTS_DETAILS.push({
          producto_id: producto_id,
          laboratorio: productoSeleccionado.laboratorio,
          nombre: productoSeleccionado.nombre,
          caracteristicas: productoSeleccionado.caracteristicas,
          sku: productoSeleccionado.sku,
          cantidad: Number(producto.cantidad),
          condicion_vencimiento: producto.condicion_vencimiento,
          fecha_vencimiento: producto.fecha_vencimiento,
          margen_ganancia: producto.margen_ganancia,
          meses: producto.meses,
          pcompra: producto.pcompra,
          pventa: producto.pventa,
          total: producto.total,
          ganancia: producto.ganancia,
        })
        localStorage.setItem('compra_details', JSON.stringify(this.VENTA_PRODUCTS_DETAILS));
        this.calcularTotales();
        this.cdr.detectChanges();
        this.ventaService.actualizarCarritoCompra()
  
        this.sweet.successTimmer(
          '¡Éxito!',
          'producto agregado'
        );
        productoSeleccionado.in_carrito = true;
      })
    }
  
    calcularTotales() {
      this.subtotal = this.VENTA_PRODUCTS_DETAILS.reduce((acc, item) => acc + item.total, 0);
    
      this.totalCarrito = this.subtotal + this.impuesto;
      this.ventaForm.patchValue({
        total: this.totalCarrito,
        impuesto: this.impuesto,
        sub_total: this.subtotal
      }, { emitEvent: false })
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
          this.VENTA_PRODUCTS_DETAILS = this.VENTA_PRODUCTS_DETAILS.filter((producto: any) => producto.producto_id !== PROD.producto_id); // Eliminar el producto de la lista
          // Actualizamos el localStorage
          localStorage.setItem('compra_details', JSON.stringify(this.VENTA_PRODUCTS_DETAILS));
          const productoSeleccionado = this.PRODUCT_LIST.find((producto: any) => producto.id === PROD.producto_id);
          productoSeleccionado.in_carrito = false;
          this.calcularTotales();
          this.ventaService.actualizarCarritoCompra()
          // Mostrar mensaje de éxito
          this.sweet.success('Eliminado', 'El producto ha sido eliminado correctamente', '/assets/animations/general/borrado_exitoso.json');
        }
      });
    }
  
    //FUNCIONES PARA MODIFICAR LA TABLA
  
    cambiarCantidad(index: number, cambio: number) {
      if (this.VENTA_PRODUCTS_DETAILS[index].cantidad + cambio > 0) {
        this.VENTA_PRODUCTS_DETAILS[index].cantidad += cambio;
        this.actualizarValores(index);
      }
    }
  
    actualizarFecha(index: number) {
      let item = this.VENTA_PRODUCTS_DETAILS[index];
      if (!item) return;
  
      localStorage.setItem('compra_details', JSON.stringify(this.VENTA_PRODUCTS_DETAILS));
    }
  
    actualizarValores(index: number) {
      let item = this.VENTA_PRODUCTS_DETAILS[index];
      if (!item) return;
    
      // Verificar que pcompra y margen_ganancia sean números válidos
      let pcompra = parseFloat(item.pcompra);
      let margen_ganancia = parseFloat(item.margen_ganancia);
      
      if (isNaN(pcompra) || isNaN(margen_ganancia)) {
        return; // Sale si los valores no son válidos
      }
    
      // Realiza los cálculos si son números válidos
      let nuevoPventa = pcompra + (pcompra * (margen_ganancia / 100));
      item.pventa = parseFloat(nuevoPventa.toFixed(2));
    
      // Calcular el total
      let nuevoTotal = item.cantidad * pcompra;
      item.total = parseFloat(nuevoTotal.toFixed(2));
    
      // Calcular la ganancia
      let nuevaGanancia = (item.pventa - pcompra) * item.cantidad;
      item.ganancia = parseFloat(nuevaGanancia.toFixed(2));
  
      localStorage.setItem('compra_details', JSON.stringify(this.VENTA_PRODUCTS_DETAILS));
      this.calcularTotales()
    }
  
    actualizarMargenGanancia(index: number){
      let item = this.VENTA_PRODUCTS_DETAILS[index];
      if (!item) return;
    
      let pcompra = parseFloat(item.pcompra);
      let pventa = parseFloat(item.pventa);
      
      if (isNaN(pcompra) || isNaN(pventa)) {
        return;
      }
    
      let nuevoMargen = ((pventa - pcompra)/pcompra)*100;
      item.margen_ganancia = parseFloat(nuevoMargen.toFixed(2));
    
      let nuevaGanancia = (item.pventa - pcompra) * item.cantidad;
      item.ganancia = parseFloat(nuevaGanancia.toFixed(2));
  
      localStorage.setItem('compra_details', JSON.stringify(this.VENTA_PRODUCTS_DETAILS));
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
        this.VENTA_PRODUCTS_DETAILS[index].pcompra = parseFloat(valor) || 0;
        this.actualizarValores(index);
      } else if (tipo === 'pventa') {
        this.VENTA_PRODUCTS_DETAILS[index].pventa = parseFloat(valor) || 0;
        this.actualizarMargenGanancia(index);
      } else if (tipo === 'margen_ganancia') {
        this.VENTA_PRODUCTS_DETAILS[index].margen_ganancia = parseFloat(valor) || 0;
        this.actualizarValores(index);
      }
    }
}
