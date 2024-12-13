import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { URL_SERVICIO } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root'
})
export class LugarEntregaService {

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

  registerLugarEntrega(data:any){
    this.texto.next('Registrando lugar de entrega')
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/lugar_entrega";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    )
  }

  listLugarEntrega(page = 1, search:string = ''){
    this.texto.next('Listando lugares de entrega')
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/lugar_entrega?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    ) 
  }

  updateLugarEntrega(ID_LUGAR_ENTREGA:string,data:any){
    this.texto.next('Actualizando lugar de entrega')
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/lugar_entrega/"+ID_LUGAR_ENTREGA;
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    )
  }

  deleteLugarEntrega(ID_LUGAR_ENTREGA:string){
    this.texto.next('Eliminando lugar de entrega')
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/lugar_entrega/"+ID_LUGAR_ENTREGA;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    )
  }
}
