import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppHeaderModule } from '../app-header/app-header.module';
import { ApuestaCreateComponent } from './apuesta-create/apuesta-create.component';
import { ApuestaDetailComponent } from './apuesta-detail/apuesta-detail.component';
import { ApuestaEditComponent } from './apuesta-edit/apuesta-edit.component';
import { ApuestaListComponent } from './apuesta-list/apuesta-list.component';
import { ApuestaCreateBettorComponent } from './apuesta-create-bettor/apuesta-create-bettor.component';



@NgModule({
  declarations: [ApuestaListComponent, ApuestaDetailComponent, ApuestaCreateComponent, ApuestaEditComponent, ApuestaCreateBettorComponent],
  imports: [
    CommonModule, AppHeaderModule, ReactiveFormsModule
  ],
  exports: [ApuestaListComponent, ApuestaDetailComponent, ApuestaCreateComponent, ApuestaEditComponent, ApuestaCreateBettorComponent]
})
export class ApuestaModule { }
