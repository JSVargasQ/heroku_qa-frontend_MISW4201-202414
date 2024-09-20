import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Carrera, Competidor } from 'src/app/carrera/carrera';
import { CarreraService } from 'src/app/carrera/carrera.service';
import { Apuesta } from '../apuesta';
import { ApuestaService } from '../apuesta.service';
import { UsuarioService } from '../../usuario/usuario.service';
import { Usuario } from '../../usuario/usuario';

@Component({
  selector: 'app-apuesta-create',
  templateUrl: './apuesta-create.component.html',
  styleUrls: ['./apuesta-create.component.css']
})
export class ApuestaCreateComponent implements OnInit {

  userId: number
  token: string
  apuestaForm: FormGroup
  carreras: Array<Carrera>
  competidores: Array<Competidor>
  apostadores: Array<Usuario>

  constructor(
    private apuestaService: ApuestaService,
    private carreraService: CarreraService,
    private usuarioService: UsuarioService,
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
      this.apuestaForm = this.formBuilder.group({
        id_evento: ["", [Validators.required]],
        id_posible_resultado: ["", [Validators.required]],
        id_apostador: ["", [Validators.required]],
        valor_apostado: [0, [Validators.required]]
      })
      this.getCarreras()
      this.getApostadores()
    }
  }

  onCarreraSelect(event: any): void {
    if (event != null && event != "") {
      var carreraSeleccionada = this.carreras.filter(x => x.id == event)[0]
      this.competidores = carreraSeleccionada.posibles_resultados
    }
  }

  getCarreras(): void {
    this.carreraService.getCarreras(this.userId, this.token)
      .subscribe(carreras => {
        this.carreras = carreras.filter(x => x.abierta == true)
      },
        error => {
          console.log(error)
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

  getApostadores() {
    this.usuarioService.getApostadores(this.token)
      .subscribe(apostadores => {
        this.apostadores = apostadores
      },
        error => {
          console.log(error)
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

  createApuesta(newApuesta: Apuesta) {
    this.apuestaService.crearApuesta(newApuesta, this.token)
      .subscribe(apuesta => {
        this.showSuccess(apuesta)
        this.apuestaForm.reset()
        this.routerPath.navigate([`/apuestas/${this.userId}/${this.token}`])
      },
        error => {
          if (error.statusText === "UNAUTHORIZED") {
            this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
          }
          else if(error.statusText === "BAD REQUEST") {
            this.showError("No tiene suficiente saldo para realizar esta apuesta.")
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
    this.routerPath.navigate([`/apuestas/${this.userId}/${this.token}`])
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
