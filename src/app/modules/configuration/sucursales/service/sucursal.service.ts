import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIO } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  texto: BehaviorSubject<string>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.texto = new BehaviorSubject<string>('');
  }

  registerSucursal(data:any){
    this.texto.next('Registrando sucursal')
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/sucursales";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    )
  }

  listSucursales(page = 1, search:string = ''){
    this.texto.next('Listando sucursales')
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/sucursales?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    ) 
  }

  updateSucursal(ID_SUCURSAL:string,data:any){
    this.texto.next('Actualizando sucursales')
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/sucursales/"+ID_SUCURSAL;
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    )
  }

  deleteSucursal(ID_SUCURSAL:string){
    this.texto.next('Eliminando sucursal')
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/sucursales/"+ID_SUCURSAL;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    )
  }
}
