import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from '../../auth';
import { LoadingService } from '../../loadingScreen/loading-screen/service/loading-service.service';
import { HandleErrorService } from '../../sweetAlert/handleError.service';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
   sweet:any = new SweetalertService  
  private actualizaCarritoVentaSubject = new BehaviorSubject<boolean>(false); 
  actualizaCarritoCompra$ = this.actualizaCarritoVentaSubject.asObservable();
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    private loadingService:LoadingService,
    public handleErrorService: HandleErrorService,
  ) {}

  listOrdenVenta(page = 1, search:string = ''){
    this.loadingService.showLoading('Listando ordenes de ventas')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_venta?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>{
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    ) 
  }

  registerOrdenVenta(data:any){
    this.loadingService.showLoading('Registrando orden de compra')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_venta";
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }


  obtenerDetalleProducto(producto_id:any){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_venta/recursos_crear/productos/"+producto_id
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }


  //SERVICIO PARA LOS MOVIMIENTOS
  registerMovimientoOrdenVenta(data:any){
    this.loadingService.showLoading('Registrando movimiento')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/atributtes/orden_venta/detalle";
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  editarCantidadProducto(data: any){
    this.loadingService.showLoading('Actualizando movimiento')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/atributtes/orden_venta/detalle/editar_cantidad";
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  eliminarMovimientosProducto(producto_id:string,orden_venta_id: number){
    this.loadingService.showLoading('Eliminando movimiento')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+`/atributtes/orden-venta/eliminar-producto/${producto_id}/${orden_venta_id}`;
    return this.http.delete(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }























  updateOrdenCompra(ID_ORDEN_COMPRA:string,data:any){
    this.loadingService.showLoading('Actualizando orden de compra')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/"+ID_ORDEN_COMPRA;
    return this.http.put(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  deleteOrdenCompra(ID_ORDEN_COMPRA:string){
    this.loadingService.showLoading('Eliminando orden de compra')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/"+ID_ORDEN_COMPRA;
    return this.http.delete(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  obtenerRecursos(){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos";
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>{
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    ) 
  }

  //peticiones para registrar

  callProducts(data:any){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_venta/recursos_crear/obtener_productos"
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  //ACTUALIZAR EL CARRITO DE COMPRAS
  actualizarCarritoCompra() {
    this.actualizaCarritoVentaSubject.next(true);  // Emitir la señal de actualización
  }
}
