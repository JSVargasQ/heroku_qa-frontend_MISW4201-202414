import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { Carrera } from '../carrera';
import { CarreraService } from '../carrera.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-carrera-list',
  templateUrl: './carrera-list.component.html',
  styleUrls: ['./carrera-list.component.css']
})
export class CarreraListComponent implements OnInit {

  helper = new JwtHelperService();

  constructor(
    private carreraService: CarreraService,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router
  ) { }

  userId: number
  token: string
  carreras: Array<Carrera>
  mostrarCarreras: Array<Carrera>
  carreraSeleccionada: Carrera
  indiceSeleccionado: number
  isAdmin: boolean = true

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.isAdmin = this.helper.decodeToken(this.token)["rol"] === "Admin";

      this.getCarreras();
    }
  }

  getCarreras(): void {
    this.carreraService.getCarreras(this.userId, this.token)
      .subscribe(carreras => {
        this.carreras = carreras
        this.mostrarCarreras = carreras
        if (carreras.length > 0) {
          this.onSelect(this.mostrarCarreras[0], 0)
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

  onSelect(a: Carrera, index: number) {
    this.indiceSeleccionado = index
    this.carreraSeleccionada = a
  }

  buscarCarrera(busqueda: string) {
    let carrerasBusqueda: Array<Carrera> = []
    this.carreras.map(carrera => {
      if (carrera.nombre_carrera.toLocaleLowerCase().includes(busqueda.toLowerCase())) {
        carrerasBusqueda.push(carrera)
      }
    })
    this.mostrarCarreras = carrerasBusqueda
  }

  irCrearCarrera() {
    this.routerPath.navigate([`/carreras/crear/${this.userId}/${this.token}`])
  }

  showError(error: string) {
    this.toastr.error(error, "Error de autenticación")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }
}
