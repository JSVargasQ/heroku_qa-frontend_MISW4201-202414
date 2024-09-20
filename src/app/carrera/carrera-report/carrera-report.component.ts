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

  evento: Carrera;
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
          this.evento = new Carrera(reporteCarrera.evento.id, reporteCarrera.evento.nombre, "", "", "CARRERA", "", reporteCarrera.abierta, this.userId, [], [])

          if (reporteCarrera.evento.posibles_resultados.length > 0) {
            for (let competidor of reporteCarrera.evento.posibles_resultados) {
              this.evento.posibles_resultados.push(new Competidor(competidor.id, "COMPETIDOR", competidor.posible_resultado, competidor.probabilidad));
            }
          }

          if (reporteCarrera.evento.apuestas.length > 0) {
            for (let apuesta of reporteCarrera.evento.apuestas) {
              this.evento.apuestas.push(new Apuesta(apuesta.id, apuesta.valor_apostado, apuesta.ganancia, apuesta.apostador, apuesta.id_posible_resultado, apuesta.id_evento));
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
    this.toastr.success(`La carrera ${carrera.nombre} fue editada`, "Edición exitosa");
  }

  backToDetails() {
    this.routerPath.navigate([`/eventos/${this.userId}/${this.token}`])
  }

}
