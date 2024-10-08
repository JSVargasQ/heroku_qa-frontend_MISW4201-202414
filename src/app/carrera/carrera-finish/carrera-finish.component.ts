import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { Carrera, Competidor } from '../carrera';
import { CarreraService } from '../carrera.service';

@Component({
  selector: 'app-carrera-finish',
  templateUrl: './carrera-finish.component.html',
  styleUrls: ['./carrera-finish.component.css']
})

export class CarreraFinishComponent implements OnInit {

  evento: Carrera;
  userId: number;
  token: string;
  competidores: Array<Competidor>
  competidorGanador: Competidor
  competidorGanadorForm!: FormGroup;

  constructor(
    private carreraService: CarreraService,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private routerPath: Router) { }

  ngOnInit(): void {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken

      this.competidorGanadorForm = this.formBuilder.group({
        id_posible_resultado: ["", [Validators.required]]
      });

      this.carreraService.getCarrera(parseInt(this.router.snapshot.params.carreraId), this.token)
        .subscribe(carreraEncontrada => {
          this.evento = carreraEncontrada
          this.competidores = carreraEncontrada.posibles_resultados
        })
    }
  }

  showError(error: string) {
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  backToDetails() {
    this.routerPath.navigate([`/carreras/${this.userId}/${this.token}`])
  }

  terminarCarrera(form: any) {
    this.carreraService.actualizarGanador(this.token, form.id_posible_resultado)
      .subscribe(competidor => {
        this.competidorGanador = competidor
        this.routerPath.navigate([`eventos/reporte/${this.evento.id}/${this.userId}/${this.token}`])

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
}
