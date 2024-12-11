import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIO } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

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

  registerWarehouse(data:any){
    this.texto.next('Registrando almacén')
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/warehouses";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    )
  }

  listWarehouses(page = 1, search:string = ''){
    this.texto.next('Listando almacenes')
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/warehouses?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    ) 
  }

  /* configAll(){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/warehouses/config";
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    ) 
  } */

  updateWarehouse(ID_WAREHOUSE:string,data:any){
    this.texto.next('Actualizando almacén')
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/warehouses/"+ID_WAREHOUSE;
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    )
  }

  deleteWarehouse(ID_WAREHOUSE:string){
    this.texto.next('Eliminando almacén')
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/warehouses/"+ID_WAREHOUSE;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    )
  }
}
