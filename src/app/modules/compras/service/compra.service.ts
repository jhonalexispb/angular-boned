import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from '../../auth';
import { LoadingService } from '../../loadingScreen/loading-screen/service/loading-service.service';
import { HandleErrorService } from '../../sweetAlert/handleError.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private actualizaCarritoCompraSubject = new BehaviorSubject<boolean>(false); 
  actualizaCarritoCompra$ = this.actualizaCarritoCompraSubject.asObservable();
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    private loadingService:LoadingService,
    public handleErrorService: HandleErrorService,
  ) {}

  listOrdenCompra(page = 1, search:string = ''){
    this.loadingService.showLoading('Listando ordenes de compras')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>{
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    ) 
  }

  registerOrdenCompra(data:any){
    this.loadingService.showLoading('Registrando orden de compra')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra";
    return this.http.post(URL,data,{headers: headers}).pipe(
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

  /* obtenerRecursos(){
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
  } */

  //peticiones para registrar
  obtenerRecursosParaCrear(){
    this.loadingService.showLoading('Cargando recursos')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos_crear"
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  callProductsByLaboratorio(laboratorioIds: number[]){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos_crear/productos"
    return this.http.post(URL,{ laboratorio_id: laboratorioIds },{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  obtenerDetalleProducto(producto_id:any){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos_crear/productos/"+producto_id
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  //Recursos para las cuotas del calendario
  obtenerCuotas(){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/cuotas_pendientes"
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  //ACTUALIZAR EL CARRITO DE COMPRAS
  actualizarCarritoCompra() {
    this.actualizaCarritoCompraSubject.next(true);
  }

  //peticiones para editar
  obtenerRecursosParaEditar(){
    this.loadingService.showLoading('Cargando recursos')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos_editar"
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  obtenerOrdenParaEditar(ID_COMPRA:any){
    this.loadingService.showLoading('Cargando orden de compra')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/"+ID_COMPRA
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  obtenerCuotasParaEditarOrdenCompra(ID_COMPRA:any){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos_editar/cuotas/"+ID_COMPRA
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  //recursos extras
  obtenerProductosOrdenCompra(ID_COMPRA:any, cargando:boolean = false){
    if(cargando){
      this.loadingService.showLoading('Obteniendo mercaderia')
    }
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos/productos/"+ID_COMPRA
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  obtenerProductosOrdenCompraToWatch(ID_COMPRA:any, cargando:boolean = false){
    if(cargando){
      this.loadingService.showLoading('Consultando mercaderia')
    }
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos/ver_productos/"+ID_COMPRA
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  obtenerComprobantesOrdenCompra(ID_COMPRA:any){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos/ver_comprobantes/"+ID_COMPRA
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  obtenerMercaderiaIngresadaOrdenCompra(ID_COMPRA:any){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos/ver_productos_ingresado/"+ID_COMPRA
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  //manejo de cambios (recepcionar, cancelar recepcion)
  recepcionar_orden_compra(ID_COMPRA:any,data:any){
    this.loadingService.showLoading('Actualizando estado')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/estado/"+ID_COMPRA
    return this.http.put(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  obtenerLotes(ID_PRODUCTO:any){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos/obtener_lotes/"+ID_PRODUCTO
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  registrarComprobantesOrdenCompra(data: any, id:any){
    this.loadingService.showLoading('Ingresando mercaderia')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+`/orden_compra/registrar_comprobantes/${id}`
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }
}
