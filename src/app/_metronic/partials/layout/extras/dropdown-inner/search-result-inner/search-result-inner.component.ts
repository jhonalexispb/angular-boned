import {ChangeDetectorRef, Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'app-search-result-inner',
  templateUrl: './search-result-inner.component.html',
})
export class SearchResultInnerComponent implements OnInit {
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @HostBinding('attr.data-kt-search-element') dataKtSearch = 'content';

  compra: CompraModel | null = null;
  productos: ProductoModel[] = [];

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    const compraDetails = localStorage.getItem('compra_details');
    const compraInfo = localStorage.getItem('compra_form');
    if (compraDetails) {
      this.productos = JSON.parse(compraDetails);
    }

    if (compraInfo) {
      this.compra = JSON.parse(compraInfo);
    }
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
  product_id: number | null;
  forma_pago_id: string;
  type_comprobante_compra_id: string;
  igv: number;
}
