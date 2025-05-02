import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ProductoSeleccionadoComponent } from '../../compras/producto-seleccionado/producto-seleccionado.component';
import { CreateProductComponent } from '../../products/create-product/create-product.component';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { GuiaPrestamoService } from '../service/guia-prestamo.service';
import { ProductoSeleccionadoGuiaPrestamoComponent } from '../producto-seleccionado-guia-prestamo/producto-seleccionado-guia-prestamo.component';

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
      laboratorio_id: [[]],
      usuario_id: [null, [Validators.required]],
      product_id: [null],
      total:['0.00', [Validators.required]],
    });

    this.guia_prestamo_service.obtenerRecursosParaCrear().subscribe((resp: any) => {
      this.USUARIOS_LIST = resp.usuarios;
      this.LABORATORIOS_LIST = resp.laboratorios;
      this.PRODUCT_LIST = resp.productos;
      this.codigo = resp.codigo;
      this.loading = false;
      this.loadingProducts = false;

      this.cacheImages()
    });
  }

  ngAfterViewInit() {
    this.usuarioSelect.focus();
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
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
    });
  }

  createProducto(){
    const modalRef = this.modalService.open(CreateProductComponent,{centered:true, size: 'xl'})
    const laboratorios_id = this.guia_prestamo_form.get('laboratorio_id')?.value;
    const labs_selec = this.LABORATORIOS_LIST
      .filter((lab: any) => laboratorios_id.includes(lab.id))
      .map((lab:any) => ({
        id: lab.laboratorio_id,
        name:lab.name
      }))
    modalRef.componentInstance.LABORATORIOS_SELECCIONADOS_POR_COMPRA = labs_selec
    modalRef.componentInstance.isButtonVisible = false;
    modalRef.componentInstance.isFabricanteRequired = false;
    modalRef.componentInstance.ProductoC.subscribe((r:any)=>{
      this.PRODUCT_LIST = [{ ...r.data }, ...this.PRODUCT_LIST];
      this.guia_prestamo_form.patchValue({ product_id: r.data.id })
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
  }

  callProductDetail(producto_id:any) {
    if(!producto_id){
      return
    }

    this.guia_prestamo_form.patchValue({product_id: null})
    const producto = this.PRODUCT_LIST.find(p => p.id === producto_id);
    if(producto.in_carrito){
      this.sweet.alerta('Aguanta','ya registraste ese producto en tu orden de compra')
      return
    }

    const productoSeleccionado = this.PRODUCT_LIST.find((producto: any) => producto.id === producto_id);
    const laboratorio_id = this.LABORATORIOS_LIST.find((lab: any) => lab.id === productoSeleccionado.laboratorio_id);
    const modalRef = this.modalService.open(ProductoSeleccionadoGuiaPrestamoComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.PRODUCT_SELECTED = productoSeleccionado
    modalRef.componentInstance.ProductoComprado.subscribe((producto:any)=>{
      this.GUIA_PRESTAMO_DETAILS.push({
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

      this.calcularTotales();
      this.cdr.detectChanges();

      this.sweet.successTimmer(
        '¡Éxito!',
        'producto agregado'
      );
      productoSeleccionado.in_carrito = true;
    })
  }

  calcularTotales() {
    this.totalCarrito = this.GUIA_PRESTAMO_DETAILS.reduce((acc, item) => acc + item.total, 0);

    this.guia_prestamo_form.patchValue({
      total: this.totalCarrito,
    }, { emitEvent: true })
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
        this.GUIA_PRESTAMO_DETAILS = this.GUIA_PRESTAMO_DETAILS.filter((producto: any) => !(producto.producto_id === PROD.producto_id));
        
        const productoSeleccionado = this.PRODUCT_LIST.find((producto: any) => producto.id === PROD.producto_id);
        productoSeleccionado.in_carrito = false;
        
        this.calcularTotales();
        this.sweet.success('Eliminado', 'el producto ha sido eliminado correctamente', '/assets/animations/general/borrado_exitoso.json');
      }
    });
  }

  //FUNCIONES PARA MODIFICAR LA TABLA

  cambiarCantidad(index: number, cambio: number) {
    if (this.GUIA_PRESTAMO_DETAILS[index].cantidad + cambio > 0) {
      this.GUIA_PRESTAMO_DETAILS[index].cantidad += cambio;
      this.actualizarValores(index);
    }
  }

  actualizarValores(index: number) {
    let item = this.GUIA_PRESTAMO_DETAILS[index];
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

    this.calcularTotales()
  }

  actualizarMargenGanancia(index: number){
    let item = this.GUIA_PRESTAMO_DETAILS[index];
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
      this.GUIA_PRESTAMO_DETAILS[index].pcompra = parseFloat(valor) || 0;
      this.actualizarValores(index);
    } else if (tipo === 'pventa') {
      this.GUIA_PRESTAMO_DETAILS[index].pventa = parseFloat(valor) || 0;
      this.actualizarMargenGanancia(index);
    } else if (tipo === 'margen_minimo') {
      this.GUIA_PRESTAMO_DETAILS[index].margen_minimo = parseFloat(valor) || 0;
      this.actualizarValores(index);
    }
  }

  onSubmit() {
    if(this.totalCarrito <= 0){
      this.sweet.alerta('Alerta','tu carrito esta vacio')
      return
    }

    this.sweet.confirmar('¿Estas seguro?',`¿Desea registrar la compra?`,'/assets/animations/general/ojitos.json','Si, hagamoslo','Cancelar').then((result:any) => {
      if (result.isConfirmed) {
        const guia_prestamo_form = JSON.parse(localStorage.getItem("compra_form") || "{}");
        const compraDetails = JSON.parse(localStorage.getItem("GUIA_PRESTAMO_details") || "[]");

        const data = {
          compra_form: {
            usuario_id: guia_prestamo_form.usuario_id,
            total: guia_prestamo_form.total || 0,
          },
          GUIA_PRESTAMO_details: compraDetails.map((item: any) => ({
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

        this.guia_prestamo_service.registerGuiaPrestamo(data).subscribe({
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
