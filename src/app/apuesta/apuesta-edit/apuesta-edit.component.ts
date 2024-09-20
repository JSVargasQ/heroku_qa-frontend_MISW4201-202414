import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Carrera, Competidor } from 'src/app/carrera/carrera';
import { CarreraService } from 'src/app/carrera/carrera.service';
import { Apuesta } from '../apuesta';
import { ApuestaService } from '../apuesta.service';
import { Usuario } from 'src/app/usuario/usuario';
import { UsuarioService } from 'src/app/usuario/usuario.service';

@Component({
  selector: 'app-apuesta-edit',
  templateUrl: './apuesta-edit.component.html',
  styleUrls: ['./apuesta-edit.component.css']
})
export class ApuestaEditComponent implements OnInit {

  userId: number;
  token: string;
  apuestaId: number;
  apuestaForm!: FormGroup;
  eventos: Array<Carrera>
  posibles_resultados: Array<Competidor>
  apostadores: Array<Usuario>

  constructor(
    private apuestaService: ApuestaService,
    private carreraService: CarreraService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService) { this.initializeForm(); }

  initializeForm()
  {
    this.apuestaForm = new FormGroup({
      id_evento: new FormControl(),
      id_posible_resultado: new FormControl(),
      id_apostador: new FormControl(),
      valor_apostado: new FormControl()
    });
  }

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.apuestaService.getApuesta(this.router.snapshot.params.apuestaId, this.token)
        .subscribe(apuesta => {
          this.apuestaId = apuesta.id
          this.apuestaForm = this.formBuilder.group({
            id_evento: [apuesta.id_evento, [Validators.required]],
            id_posible_resultado: [apuesta.id_posible_resultado, [Validators.required]],
            id_apostador: [apuesta.apostador.id, [Validators.required]],
            valor_apostado: [Number(apuesta.valor_apostado).toFixed(2), [Validators.required]]
          })
          this.getCarreras(apuesta.id_evento)
          this.getApostadores()
        })
    }
  }

  onEventoSelect(event: any): void {
    if (event != null && event != "") {
      var carreraSeleccionada = this.eventos.filter(x => x.id == event)[0]
      this.posibles_resultados = carreraSeleccionada.posibles_resultados
    }
  }

  getCarreras(id_evento: number): void {
    this.carreraService.getCarreras(this.userId, this.token)
      .subscribe(eventos => {
        this.eventos = eventos
        this.onEventoSelect(id_evento)
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

  cancelCreate() {
    this.apuestaForm.reset()
    this.routerPath.navigate([`/apuestas/${this.userId}/${this.token}`])
  }

  editarApuesta(newApuesta: Apuesta) {
    this.apuestaService.editarApuesta(newApuesta, this.apuestaId, this.token)
      .subscribe(apuesta => {
        this.showSuccess(apuesta)
        this.apuestaForm.reset()
        this.routerPath.navigate([`/apuestas/${this.userId}/${this.token}`])
      },
        error => {
          if (error.statusText === "UNAUTHORIZED") {
            this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
          }
          else if (error.statusText === "BAD REQUEST") {
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

  showError(error: string) {
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess(apuesta: Apuesta) {
    this.toastr.success(`La apuesta ${apuesta.id} fue editada`, "Edición exitosa");
  }

}
