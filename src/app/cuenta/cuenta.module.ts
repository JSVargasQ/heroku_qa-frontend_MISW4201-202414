import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderModule } from '../app-header/app-header.module';
import { CuentaDetailComponent } from './cuenta-detail/cuenta-detail.component';



@NgModule({
  declarations: [CuentaDetailComponent],
  imports: [
    CommonModule, AppHeaderModule
  ],
  exports: [CuentaDetailComponent]
})
export class CuentaModule { }
