import { Component, EventEmitter, HostBinding, OnInit, Output} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-carrito-venta-notification',
  templateUrl: './carrito-venta-notification.component.html',
})
export class CarritoVentaNotificationComponent implements OnInit {
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @HostBinding('attr.data-kt-search-element') dataKtSearch = 'content';

  @Output() cantidadProductosGuiaPrestamo = new EventEmitter<number>();

  user$: Observable<any>;
  private unsubscribe: Subscription[] = [];

  constructor(
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
     this.user$.subscribe((user) => {
      const cantidad = user?.guia_prestamo?.productos_guia_prestamo?.length || 0;
      this.cantidadProductosGuiaPrestamo.emit(cantidad);
      console.log(cantidad)
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
