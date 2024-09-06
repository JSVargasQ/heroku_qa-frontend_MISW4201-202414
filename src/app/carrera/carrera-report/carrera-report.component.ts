import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { Apuesta, Carrera, Competidor } from '../carrera';
import { CarreraService } from '../carrera.service';

@Component({
  selector: 'app-carrera-report',
  templateUrl: './carrera-report.component.html',
  styleUrls: ['./carrera-report.component.css']
})

export class CarreraReportComponent implements OnInit {

  carrera: Carrera;
  userId: number;
  token: string;
  gananciaCasa: number;

  constructor(
    private carreraService: CarreraService,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router) { }

  ngOnInit(): void {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.carreraService.verReporteCarrera(this.token, parseInt(this.router.snapshot.params.carreraId))
        .subscribe(reporteCarrera => {
          this.carrera = new Carrera(reporteCarrera.carrera.id, reporteCarrera.carrera.nombre_carrera, reporteCarrera.abierta, this.userId, [], [])

          if (reporteCarrera.carrera.competidores.length > 0) {
            for (let competidor of reporteCarrera.carrera.competidores) {
              this.carrera.competidores.push(new Competidor(competidor.id, competidor.nombre_competidor, competidor.probabilidad));
            }
          }

          if (reporteCarrera.carrera.apuestas.length > 0) {
            for (let apuesta of reporteCarrera.carrera.apuestas) {
              this.carrera.apuestas.push(new Apuesta(apuesta.id, apuesta.valor_apostado, apuesta.ganancia, apuesta.nombre_apostador, apuesta.id_competidor, apuesta.id_carrera));
            }
          }

          if (reporteCarrera.ganancia_casa === undefined) {
            this.gananciaCasa = 0
          } else {
            this.gananciaCasa = parseFloat(reporteCarrera.ganancia_casa)
          }

        })
    }
  }

  showError(error: string) {
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess(carrera: Carrera) {
    this.toastr.success(`La carrera ${carrera.nombre_carrera} fue editada`, "Edición exitosa");
  }

  backToDetails() {
    this.routerPath.navigate([`/carreras/${this.userId}/${this.token}`])
  }

}