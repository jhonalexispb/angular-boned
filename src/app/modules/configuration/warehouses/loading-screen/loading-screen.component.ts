
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WarehouseService } from '../service/warehouse.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit { 
  isLoading$: Observable<boolean>;
  texto$: Observable<string>;
  constructor(
    private warehouseService: WarehouseService
  ) {}


  ngOnInit(): void {
    this.isLoading$ = this.warehouseService.isLoading$;
    this.texto$ = this.warehouseService.texto.asObservable();
  }
}
