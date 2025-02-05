import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewImageComponent } from './view-image.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewImageComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [ViewImageComponent]
})
export class ViewImageModule { }
