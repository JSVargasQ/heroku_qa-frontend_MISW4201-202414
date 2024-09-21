import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/usuario/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  helper = new JwtHelperService();

  // Attributes
  username: string = '';
  token: string;
  isAdmin: boolean = true
  currentPath: string = '';

  // Constructor
  constructor(
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private usuarioService: UsuarioService,
  ) {
    this.routerPath.events.subscribe(() => {
      this.currentPath = this.router.snapshot.routeConfig?.path || '';
    });
  }

  // LifeCycle
  ngOnInit(): void {
    this.token = this.router.snapshot.params.userToken

    if( this.helper.decodeToken(this.token) ) {
      this.isAdmin = this.helper.decodeToken(this.token)["rol"] === "Admin";
    }

    this.getUserInfo();
  }

  // Methods
  goTo(menu: string) {
    const userId = parseInt(this.router.snapshot.params.userId);
    const token = this.router.snapshot.params.userToken;
    if (menu === 'logIn') {
      this.isAdmin = true;
      this.routerPath.navigate([`/`]);
    } else if (menu === 'evento') {
      this.routerPath.navigate([`/eventos/${userId}/${token}`]);
    } else if (menu === 'apuesta') {
      this.routerPath.navigate([`/apuestas/${userId}/${token}`]);
    } else if (menu === 'cuenta') {
      this.routerPath.navigate([`/cuenta/${userId}/${token}`]);
    } else if (menu === 'saldo') {
      this.routerPath.navigate([`/saldo/${userId}/${token}`]);
    }
  }

  getUserInfo() {
    this.usuarioService.getUserInfo(parseInt(this.router.snapshot.params.userId), this.token)
    .subscribe(user => {
      if (this.isAdmin) {
        this.username = user.usuario + ' (Administrador)';
      } else {
        this.username = user.nombres + ' ' + user.apellidos;
      }
    },
    error => {
      if (error.statusText === "UNAUTHORIZED") {
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if (error.statusText === "UNPROCESSABLE ENTITY") {
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else {
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })
  }

  showError(error: string) {
    this.toastr.error(error, "Error de autenticación")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

}
