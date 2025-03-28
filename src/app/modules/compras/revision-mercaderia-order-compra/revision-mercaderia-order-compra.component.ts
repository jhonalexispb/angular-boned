import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-revision-mercaderia-order-compra',
  templateUrl: './revision-mercaderia-order-compra.component.html',
  styleUrls: ['./revision-mercaderia-order-compra.component.scss']
})
export class RevisionMercaderiaOrderCompraComponent {
  idCompra: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.firstChild?.paramMap.subscribe(params => {
      this.idCompra = params.get('id') || '';
    });
  }
}
