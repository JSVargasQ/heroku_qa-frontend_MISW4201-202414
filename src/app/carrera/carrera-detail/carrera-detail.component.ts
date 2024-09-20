import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApuestaApostador, Carrera } from '../carrera';
import { CarreraService } from '../carrera.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-carrera-detail',
  templateUrl: './carrera-detail.component.html',
  styleUrls: ['./carrera-detail.component.css']
})
export class CarreraDetailComponent implements OnInit {

  helper = new JwtHelperService();

  @Input() evento: Carrera;

  userId: number;
  token: string;
  isAdmin: boolean = true
  apuestas: ApuestaApostador[] = []

  constructor(
    private carreraService: CarreraService,
    private toastr: ToastrService,
    private routerPath: Router,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken

    this.isAdmin = this.helper.decodeToken(this.token)["rol"] === "Admin";

    if (!this.isAdmin) {
      this.getApuestas();
    }
  }

  getCompetidor(id_posible_resultado: any) {
    var competidor = this.evento.posibles_resultados.filter(x => x.id == id_posible_resultado)[0]
    return competidor.posible_resultado
  }

  getApuestas() {
    this.carreraService.getApuestasApostador(this.token, this.userId).subscribe(apuestas => {
      this.apuestas = apuestas
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

  goToEdit() {
    this.routerPath.navigate([`/eventos/editar/${this.evento.id}/${this.userId}/${this.token}`])
  }

  apostar() {
    this.routerPath.navigate([`/eventos/apostar/${this.evento.id}/${this.userId}/${this.token}`])
  }

  eliminarCarrera() {
    this.carreraService.eliminarCarrera(this.token, this.evento.id)
      .subscribe(carrera => {
        window.location.reload();
        this.showSuccess();
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
    this.ngOnInit()
  }

  terminarCarrera() {
    this.routerPath.navigate([`/eventos/terminar/${this.evento.id}/${this.userId}/${this.token}`])
  }

  showError(error: string) {
    this.toastr.error(error, "Error de autenticación")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`La carrera fue eliminada`, "Eliminada exitosamente");
  }
}
