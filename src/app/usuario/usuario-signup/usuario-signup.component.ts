import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-usuario-signup',
  templateUrl: './usuario-signup.component.html',
  styleUrls: ['./usuario-signup.component.css'],
})
export class UsuarioSignupComponent implements OnInit {
  rolApostador: string = 'Apostador';
  rolAdministrador: string = 'Admin';

  helper = new JwtHelperService();
  usuarioForm: FormGroup;
  selectedRol: string;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.selectedRol = this.rolApostador;
    this.buildUserFormByRol(this.rolApostador);
  }

  changeRolUser(event: any): void {
    this.selectedRol = event.target?.value;
    this.buildUserFormByRol(this.selectedRol);
  }

  registrarUsuario() {
    this.usuarioService.userSignUp(this.usuarioForm.value).subscribe(
      (res) => {
        const decodedToken = this.helper.decodeToken(res.token);
        this.router.navigate([`/carreras/${decodedToken.sub}/${res.token}`]);
        this.showSuccess();
      },
      (error) => {
        if (error.error.cod === 'user_exist') {
          this.showError(`El usuario ya se encuentra registrado`);
        } else {
          this.showError(`Ha ocurrido un error: ${error.message}`);
        }
      }
    );
  }

  buildUserFormByRol(rol: string): void {
    if (rol == this.rolAdministrador) {
      this.usuarioForm = this.formBuilder.group({
        rol: [rol, [Validators.required]],
        usuario: ['', [Validators.required, Validators.maxLength(50)]],
        password: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.minLength(4),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.minLength(4),
          ],
        ],
        firstname: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        lastname: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        email: [''],
        creditCard: [''],
        expirationDate: [''],
        cvv: [''],
      });
    } else {
      this.usuarioForm = this.formBuilder.group({
        rol: [rol, [Validators.required]],
        firstname: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        lastname: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
          ],
        ],
        creditCard: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
        expirationDate: [
          '',
          [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
        ],
        cvv: [
          '',
          [Validators.required, Validators.min(100), Validators.max(999)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.minLength(4),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.minLength(4),
          ],
        ],
        usuario: [''],
      });
    }
  }

  showError(error: string) {
    this.toastr.error(error, 'Error');
  }

  showSuccess() {
    this.toastr.success(`Se ha registrado exitosamente`, 'Registro exitoso');
  }
}
