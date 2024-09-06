import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Carrera, Competidor } from 'src/app/carrera/carrera';
import { ApuestaService } from '../apuesta.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Apuesta } from '../apuesta';
import { CarreraService } from 'src/app/carrera/carrera.service';
import { UsuarioService } from 'src/app/usuario/usuario.service';

@Component({
  selector: 'app-apuesta-create-bettor',
  templateUrl: './apuesta-create-bettor.component.html',
  styleUrls: ['./apuesta-create-bettor.component.css']
})
export class ApuestaCreateBettorComponent implements OnInit {

  helper = new JwtHelperService();

  userId: number
  token: string
  carrera: Carrera;
  apuestaForm: FormGroup
  competidores: Array<Competidor>

  constructor(
    private apuestaService: ApuestaService,
    private carreraService: CarreraService,
    private userService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.carreraService.getCarrera(parseInt(this.router.snapshot.params.carreraId), this.token)
        .subscribe(carrera => {
          this.carrera = carrera
          this.competidores = carrera.competidores
        })
      this.apuestaForm = this.formBuilder.group({
        id_competidor: ["", [Validators.required]],
        id_apostador: [this.userId, [Validators.required]],
        valor_apostado: [0, [Validators.required, Validators.min(1)]]
      })
    }
  }

  createApuesta(newApuesta: Apuesta) {
    var canBet: boolean = false;
    this.userService.getUserTransactions(this.userId, this.token)
      .subscribe(transacciones => {
        if (transacciones.length > 0) {
          var saldo = 0

          for (const transaccion of transacciones) {
            if (transaccion.tipo === "recarga" || transaccion.tipo === "ganancia") {
              saldo += transaccion.valor;
            } else if (transaccion.tipo === "retiro" || transaccion.tipo === "apuesta") {
              saldo -= transaccion.valor;
            }
          }
          canBet = saldo > 0;
          if (canBet) {
            newApuesta.id_carrera = this.carrera.id
            this.apuestaService.crearApuesta(newApuesta, this.token)
              .subscribe(apuesta => {
                this.showSuccess(apuesta)
                this.apuestaForm.reset()
                this.routerPath.navigate([`/carreras/${this.userId}/${this.token}`])
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
          } else {
            this.showError("No cuenta con dinero suficiente para hacer esta apuesta. Revise el saldo de su cuenta.")
          }
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

  cancelCreate() {
    this.apuestaForm.reset()
    this.routerPath.navigate([`/carreras/apostar/${this.carrera.id}/${this.userId}/${this.token}`])
  }

  showError(error: string) {
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess(apuesta: Apuesta) {
    this.toastr.success(`La apuesta fue creada`, "Creación exitosa");
  }

}
