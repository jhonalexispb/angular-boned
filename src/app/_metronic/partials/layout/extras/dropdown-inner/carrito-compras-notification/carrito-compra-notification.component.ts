import { Component, HostBinding, OnInit} from '@angular/core';
import { CompraService } from 'src/app/modules/compras/service/compra.service';
import { UserLocalStorageService } from 'src/app/modules/users/service/userLocalStorage.service';

@Component({
  selector: 'app-carrito-compra-notification',
  templateUrl: './carrito-compra-notification.component.html',
})
export class carritoComprasNotificationComponent implements OnInit {
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @HostBinding('attr.data-kt-search-element') dataKtSearch = 'content';

  compra: CompraModel | null = null;
  productos: ProductoModel[] = [];
  user:any = new UserLocalStorageService
  user_name:string = ''

  constructor(private compraService: CompraService) {
  }

  ngOnInit(): void {
    this.obtenerListCompra();
    this.compraService.actualizaCarritoCompra$.subscribe((actualizado) => {
      if (actualizado) {
        this.obtenerListCompra();
      }
    });
    this.user_name = this.user.getUser()?.name;
  }

  obtenerListCompra() {
    const compraDetails = localStorage.getItem('compra_details');
    const compraInfo = localStorage.getItem('compra_form');
  
    this.productos = compraDetails ? JSON.parse(compraDetails) : []; // Si no existe, asigna un array vacío
    this.compra = compraInfo ? JSON.parse(compraInfo) : {}; // Si no existe, asigna un objeto vacío
  }
}

interface ProductoModel {
  producto_id: number;
  laboratorio: string;
  nombre: string;
  caracteristicas: string;
  sku: string;
  cantidad: number;
  condicion_vencimiento: number;
  fecha_vencimiento: string;
  margen_minimo: string;
  meses: number;
  pcompra: string;
  pventa: string;
}

interface CompraModel {
  laboratorio_id: number[];
  proveedor_id: number;
  proveedor_name: string;
  product_id: number | null;
  forma_pago_id: string;
  type_comprobante_compra_id: string;
  igv: number;
}
