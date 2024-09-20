import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderModule } from '../app-header/app-header.module';
import { CuentaDetailComponent } from './cuenta-detail/cuenta-detail.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [CuentaDetailComponent],
  imports: [
    CommonModule, AppHeaderModule, FormsModule
  ],
  exports: [CuentaDetailComponent]
})
export class CuentaModule { }
