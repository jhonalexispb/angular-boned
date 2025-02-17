import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DivLoadingComponent } from './div-loading.component';



@NgModule({
  declarations: [DivLoadingComponent],
  imports: [
    CommonModule
  ],
  exports: [DivLoadingComponent]
})
export class DivLoadingModule { }
