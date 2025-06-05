import { CompraService } from 'src/app/modules/compras/service/compra.service';
import { AuthService } from './../../../../../modules/auth/services/auth.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() appHeaderDefaulMenuDisplay: boolean;
  @Input() isRtl: boolean;

  itemClass: string = 'ms-1 ms-lg-3';
  btnClass: string = 'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
  userAvatarClass: string = 'symbol-35px symbol-md-40px';
  btnIconClass: string = 'fs-2 fs-md-1';

  user:any;
  cantidadProductos: number = 0;

  totalProductosGuiaPrestamo:any

  constructor(
    public authService: AuthService,
    private compraService: CompraService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user;
    this.obtenerCantidadProductos();
    this.compraService.actualizaCarritoCompra$.subscribe((actualizado) => {
      if (actualizado) {
        this.obtenerCantidadProductos();
      }
    });
    console.log(this.totalProductosGuiaPrestamo)
  }

  obtenerCantidadProductos() {
    const compraGuardada = localStorage.getItem('compra_details');
    if (compraGuardada) {
      this.cantidadProductos = JSON.parse(compraGuardada).length;
    }else{
      this.cantidadProductos = 0
    }
  }
}
