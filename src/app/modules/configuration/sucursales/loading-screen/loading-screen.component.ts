import { SucursalService } from '../service/sucursal.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit { 
  isLoading$: Observable<boolean>;
  texto$: Observable<string>;
  constructor(
    private sucursalService: SucursalService
  ) {}


  ngOnInit(): void {
    this.isLoading$ = this.sucursalService.isLoading$;
    this.texto$ = this.sucursalService.texto.asObservable();
  }
}
