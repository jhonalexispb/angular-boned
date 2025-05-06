import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { GuiaPrestamoService } from '../service/guia-prestamo.service';
import { ProductoSeleccionadoGuiaPrestamoComponent } from '../producto-seleccionado-guia-prestamo/producto-seleccionado-guia-prestamo.component';
import { ViewImageComponent } from 'src/app/components/view-image/view-image.component';

@Component({
  selector: 'app-create-guia-prestamo',
  templateUrl: './create-guia-prestamo.component.html',
  styleUrls: ['./create-guia-prestamo.component.scss']
})
export class CreateGuiaPrestamoComponent {
  @ViewChild('usuarioSelect') usuarioSelect: NgSelectComponent;
  guia_prestamo_form: FormGroup;

  LABORATORIOS_LIST:any[] = [];
  USUARIOS_LIST:any[] = [];
  PRODUCT_LIST:any[] = [];
  GUIA_PRESTAMO_DETAILS:any[] = [];
  codigo:string = "Calculando codigo..."
  guia_prestamo_id:any
  activeDropdownIndex: number | null = null;

  totalCarrito: number = 0;

  loading:boolean = true
  loadingProducts:boolean = true

  imageCache: Map<string, string> = new Map();

  sweet:any = new SweetalertService

  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    //llamamos al servicio
    public guia_prestamo_service: GuiaPrestamoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.guia_prestamo_form = this.fb.group({
      guia_prestamo_id: [],
      laboratorio_id: [[]],
      usuario_id: [null, [Validators.required]],
      product_id: [null],
      comentario: [null],
      total: ['0.00']
    });
  
    const savedId = localStorage.getItem('guia_prestamo_id');
    this.guia_prestamo_id = savedId
    const data: any = savedId
      ? { crear_guia_prestamo: false, guia_prestamo_id: savedId }
      : { crear_guia_prestamo: true };
  
    this.guia_prestamo_service.crear_guia_prestamo(data).subscribe((resp: any) => {
      this.handleGuiaPrestamoResponse(resp);
    });
  }
  
  private handleGuiaPrestamoResponse(resp: any) {
    this.USUARIOS_LIST = resp.usuarios;
    this.LABORATORIOS_LIST = resp.laboratorios;
    this.PRODUCT_LIST = resp.productos;
    this.codigo = resp.codigo;
    this.guia_prestamo_id = resp.guia_prestamo_id;
    this.GUIA_PRESTAMO_DETAILS = resp.movimiento
  
    localStorage.setItem('guia_prestamo_id', this.guia_prestamo_id.toString());
    this.evaluarProductosCarrito()
    this.guia_prestamo_form.patchValue({
      guia_prestamo_id: this.guia_prestamo_id,
    });
  
    this.loading = false;
    this.loadingProducts = false;
    this.cacheImages();
    this.calcularTotales()
  }

  ngAfterViewInit() {
    this.usuarioSelect.focus();
  }

  evaluarProductosCarrito(){
    const idsEnCarrito = this.GUIA_PRESTAMO_DETAILS.map((p: any) => p.producto_id);
    this.PRODUCT_LIST.forEach((producto: any) => {
      producto.in_carrito = idsEnCarrito.includes(producto.id);
    });
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  customSearchFn(term: string, item: any): boolean {
    term = term.toLowerCase();
    return item.nombre?.toLowerCase().includes(term) ||
           item.caracteristicas?.toLowerCase().includes(term) ||
           item.sku?.toLowerCase().includes(term);
  }

  callProductos(){
    this.loadingProducts = true;
    this.PRODUCT_LIST = [];
    this.guia_prestamo_form.patchValue({
      product_id: null,
    });

    // Obtener los laboratorios seleccionados
    const laboratorioSeleccionado = this.guia_prestamo_form.value.laboratorio_id; 

    const laboratorioIds = laboratorioSeleccionado
    .map((id:any) => this.LABORATORIOS_LIST.find(lab => lab.id === id)?.id)
    .filter((labId:any) => labId !== undefined); // Filtrar valores `undefined` por seguridad

    this.guia_prestamo_service.callProductsByLaboratorio(laboratorioIds).subscribe((resp: any) => {
      this.PRODUCT_LIST = resp.productos.map((p: any) => ({ ...p })); // Crear copias independientes
      this.loadingProducts = false;
      this.cacheImages()
      this.evaluarProductosCarrito()
    });
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
  }

  callProductDetail(producto_id:any) {
    if(!producto_id){
      return
    }

    this.guia_prestamo_form.patchValue({product_id: null})
    const producto = this.PRODUCT_LIST.find(p => p.id === producto_id);
    if(producto.in_carrito){
      this.sweet.alerta('Aguanta','ya registraste ese producto en tu guia de prestamo')
      return
    }

    const productoSeleccionado = this.PRODUCT_LIST.find((producto: any) => producto.id === producto_id);
    const modalRef = this.modalService.open(ProductoSeleccionadoGuiaPrestamoComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.PRODUCT_SELECTED = productoSeleccionado
    modalRef.componentInstance.GUIA_PRESTAMO_ID = this.guia_prestamo_id
    const sub = modalRef.componentInstance.ProductoGestionado.subscribe((productos: any[]) => {
      productos.forEach((movimiento: any) => {
        this.GUIA_PRESTAMO_DETAILS.push({
          id: movimiento.id,
          producto_id: movimiento.producto_id,
          sku: movimiento.sku,
          laboratorio: movimiento.laboratorio,
          color_laboratorio: movimiento.color_laboratorio,
          nombre: movimiento.nombre,
          caracteristicas: movimiento.caracteristicas,
          pventa: movimiento.pventa,
          imagen: movimiento.imagen,
          lote: movimiento.lote,
          cantidad: Number(movimiento.cantidad),
        });
      });
    
      this.calcularTotales();
      this.cdr.detectChanges();

      this.callProductos()
    
      this.sweet.successTimmer(
        '¡Éxito!',
        'Producto agregado'
      );
      
      productoSeleccionado.in_carrito = true;
    });

    modalRef.result.finally(() => {
      sub.unsubscribe();
    });
  }

  viewImagen(image:string){
      const modalRef = this.modalService.open(ViewImageComponent,{centered:true, size: 'md'})
      modalRef.componentInstance.IMAGE_SELECTED = image
  }

  calcularTotales() {
    this.totalCarrito = this.GUIA_PRESTAMO_DETAILS.reduce((acc, item) => {
      return acc + (Number(item.cantidad) * Number(item.pventa));
    }, 0);
  
    this.guia_prestamo_form.patchValue({
      total: this.totalCarrito.toFixed(2),
    }, { emitEvent: true });
  }

  eliminarItem(PROD:any){
    let message = "¿Deseas eliminar el producto"

    this.sweet.confirmar_borrado(
      '¿Estás seguro?', 
      `${message}: 
        <span class="text-primary">${PROD.laboratorio}</span> 
        <span class="text-success">${PROD.nombre}</span> 
        <span class="text-warning">${PROD.caracteristicas}</span>?`
    ).then((result: any) => {
      if (result.isConfirmed) {
        this.guia_prestamo_service.deleteMovimientoGuiaPrestamo(PROD.id).subscribe((resp: any) => {
          this.GUIA_PRESTAMO_DETAILS = this.GUIA_PRESTAMO_DETAILS.filter((movimiento: any) => !(movimiento.id === PROD.id));
          this.callProductos();
          this.calcularTotales();
          this.sweet.success('Eliminado', 'el producto ha sido eliminado correctamente', '/assets/animations/general/borrado_exitoso.json');
        });
      }
    });
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
  }

  // Cambiar con botones + y -
  cambiarCantidad(index: number, cambio: number) {
    const P = this.GUIA_PRESTAMO_DETAILS[index];
    this.iniciarEdicion(P);
  
    const nuevaCantidad = P.cantidad + cambio;
    if (nuevaCantidad < 1) return;
  
    P.cantidad = nuevaCantidad;
    this.activarConfirmacion(P);
    this.calcularTotales();
  }

  // Confirmar el cambio (llama API)
  confirmarCambio(P: any) {
    this.guia_prestamo_service.updateMovimientoGuiaPrestamo(P.id, { cantidad: P.cantidad }).subscribe((resp: any) => {
      P.editando = false;
      delete P.cantidadOriginal;
      this.calcularTotales();
      this.sweet.success('Bien hecho','movimiento actualizado de manera satisfactoria')
    });
  }

  // Cancelar y volver al valor anterior
  cancelarCambio(P: any) {
    P.cantidad = P.cantidadOriginal;
    P.editando = false;
    delete P.cantidadOriginal;
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

  onSubmit() {
    if(this.totalCarrito <= 0){
      this.sweet.alerta('Alerta','tu carrito esta vacio')
      return
    }

    if(!this.guia_prestamo_form.get('usuario_id')?.value){
      this.sweet.alerta('Alerta','selecciona el usuario a quien entregaras la mercaderia')
      return
    }

    this.sweet.confirmar('¿Estas seguro?',`¿Desea guardar la guia de prestamo?`,'/assets/animations/general/ojitos.json','Si, hagamoslo','Cancelar').then((result:any) => {
      if (result.isConfirmed) {
        const data = {
          user_encargado_id: this.guia_prestamo_form.get('usuario_id')?.value,
          comentario: this.guia_prestamo_form.get('comentario')?.value
        };

        this.guia_prestamo_service.actualizar_guia_prestamo(data,this.guia_prestamo_id).subscribe({
          next: (resp: any) => {
            setTimeout(() => {
              this.router.navigate(['/guias_prestamo/list']);
        
              this.sweet.success(
                '¡Éxito!',
                'la guia de prestamo se registró correctamente'
              );
            }, 100);
          },
        });
      }
    })
  }
}
