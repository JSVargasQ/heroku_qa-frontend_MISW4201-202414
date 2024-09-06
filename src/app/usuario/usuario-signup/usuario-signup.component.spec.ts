/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsuarioSignupComponent } from './usuario-signup.component';
import {UsuarioService} from '../usuario.service'
import {HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {ReactiveFormsModule} from "@angular/forms";

describe('UsuarioSignupComponent', () => {
  let component: UsuarioSignupComponent;
  let fixture: ComponentFixture<UsuarioSignupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot(), HttpClientModule, ReactiveFormsModule],
      declarations: [UsuarioSignupComponent],
      providers: [UsuarioService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should exist fields for Apostador', () => {
    expect(component.selectedRol).toBe(component.rolApostador)
    component.changeRolUser({"target": {"value": component.rolAdministrador}})

    const firstnameInput = fixture.nativeElement.querySelector('input[formControlName="firstname"]');
    expect(firstnameInput).toBeTruthy();

    const lastnameInput = fixture.nativeElement.querySelector('input[formControlName="lastname"]');
    expect(lastnameInput).toBeTruthy();

    const emailInput = fixture.nativeElement.querySelector('input[formControlName="email"]');
    expect(emailInput).toBeTruthy();

    const creditCardInput = fixture.nativeElement.querySelector('input[formControlName="creditCard"]');
    expect(creditCardInput).toBeTruthy();

    const expirationDateInput = fixture.nativeElement.querySelector('input[formControlName="expirationDate"]');
    expect(expirationDateInput).toBeTruthy();

    const cvvInput = fixture.nativeElement.querySelector('input[formControlName="cvv"]');
    expect(cvvInput).toBeTruthy();

    const passwordInput = fixture.nativeElement.querySelector('input[formControlName="password"]');
    expect(passwordInput).toBeTruthy();

    const confirmPasswordInput = fixture.nativeElement.querySelector('input[formControlName="confirmPassword"]');
    expect(confirmPasswordInput).toBeTruthy();
  });
});
