import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropImageComponent } from './drop-image.component';



@NgModule({
  declarations: [DropImageComponent],
  imports: [
    CommonModule
  ],
  exports: [DropImageComponent]
})
export class DropImageModule { }
