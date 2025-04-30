import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-mercaderia-ingresada',
  templateUrl: './modal-mercaderia-ingresada.component.html',
  styleUrls: ['./modal-mercaderia-ingresada.component.scss']
})
export class ModalMercaderiaIngresadaComponent {
  @Input() ORDER_COMPRA:any
  @Input() MERCADERIA:any //EXISE UN BOTON EN EL LISTADO DE COMPRAS QUE SIRVE PARA VER COMPORBANTES, Y ESTOS COMPROBANTES TIENEN SU MERCADERIA
  @Input() MERCADERIA_DIRECTA:any //EXISE UN BOTON EN EL LISTADO DE COMPRAS QUE SIRVE PARA VER TODA LA MERCADERIA INGRESADA
  @Input() COMPROBANTE:any = null
  @Input() DETALLADO:boolean = false
  PRODUCTS:any
  PRODUCTS_SAVE:any
  tabSeleccionado: string = 'mercaderia';

  subtotal: number = 0;
  impuesto: number = 0;
  total: number = 0;

  constructor(
    public modal: NgbActiveModal,
  ){}

  ngOnInit(){
    if(this.DETALLADO){
      this.PRODUCTS = this.MERCADERIA_DIRECTA
      this.PRODUCTS_SAVE = JSON.parse(JSON.stringify(this.MERCADERIA_DIRECTA));
      console.log(this.PRODUCTS_SAVE)
      this.arreglar_mercaderia(this.tabSeleccionado)
    }else{
      this.PRODUCTS = this.MERCADERIA
    }
    this.calcularTotales()
  }

  calcularTotales(): void {
    const total = this.PRODUCTS
      .map((m:any) => parseFloat(m.total))
      .filter((t:number) => !isNaN(t))
      .reduce((sum: number, t: number) => sum + t, 0);
  
    this.total = total;
    this.subtotal = total / 1.18;
    this.impuesto = total - this.subtotal;
  }

  arreglar_mercaderia(modo:any){
    this.PRODUCTS = this.PRODUCTS_SAVE
    if(modo === 'mercaderia' && this.DETALLADO){
      this.PRODUCTS = this.consolidarIngresos(this.PRODUCTS)
      console.log(this.PRODUCTS_SAVE)
    }
    console.log(this.PRODUCTS_SAVE)
    this.calcularTotales()
  }

  consolidarIngresos(ingresos: any[]) {
    const consolidados: { [clave: string]: any } = {};
  
    ingresos.forEach(item => {
      const clave = `${item.sku}||${item.bonificacion}||${item.lote ?? 'null'}||${item.fecha_vencimiento ?? 'null'}`;
  
      if (!consolidados[clave]) {
        consolidados[clave] = {
          sku: item.sku,
          nombre: item.nombre,
          imagen: item.imagen,
          caracteristicas: item.caracteristicas,
          bonificacion: item.bonificacion,
          lote: item.lote,
          fecha_vencimiento: item.fecha_vencimiento,
          cantidad: 0,
          total: 0,
          pcompra: item.pcompra
        };
      }
  
      consolidados[clave].cantidad += item.cantidad;
      consolidados[clave].total += parseFloat(item.total);
    });
  
    return Object.values(consolidados);
  }
}
