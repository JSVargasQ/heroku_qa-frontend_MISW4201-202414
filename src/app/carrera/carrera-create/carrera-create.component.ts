import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Carrera } from '../carrera';
import { CarreraService } from '../carrera.service';

@Component({
  selector: 'app-carrera-create',
  templateUrl: './carrera-create.component.html',
  styleUrls: ['./carrera-create.component.css']
})
export class CarreraCreateComponent implements OnInit {

  userId: number
  tipoEvento: "CARRERA" | "PARTIDO";
  token: string
  eventoForm: FormGroup

  constructor(
    private eventoService: CarreraService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router
  ) { }


  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.eventoForm = this.formBuilder.group({
        nombre: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
        tipo: ["", [Validators.required]],
        fecha_inicio: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
        fecha_fin: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
        descripcion: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
        equipo_1: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
        equipo_2: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
        posibles_resultados: new FormArray([])
      });
      this.competidorformArray.push(this.createCompetidorForm());
    }
  }

  get eventoFormControls() {
    return this.eventoForm.controls;
  }

  get competidorformArray() {
    return this.eventoFormControls.posibles_resultados as FormArray;
  }

  private createCompetidorForm(item?: any): FormGroup {
    return this.formBuilder.group({
      posible_resultado: [item == null ? '' : item.competidor, [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
      probabilidad: [item == null ? '' : item.probabilidad, [Validators.required, Validators.min(0), Validators.max(1)]]
    });
  }

  onAddCompetidor() {
    this.competidorformArray.push(this.createCompetidorForm());
  }

  onRemoveCompetidor(index: number) {
    this.competidorformArray.removeAt(index);
  }

  cancelCreate() {
    this.eventoForm.reset()
    this.routerPath.navigate([`/eventos/${this.userId}/${this.token}`])
  }

  createEvento(newEvento: Carrera) {
    let tipoResultado: "COMPETIDOR" | "MARCADOR" = (newEvento.tipo === "CARRERA") ? "COMPETIDOR" : "MARCADOR" ;
    for( let i =0; i < newEvento.posibles_resultados.length; i++) {
      newEvento.posibles_resultados[i].tipo = tipoResultado;
    }

    this.eventoService.crearCarrera(this.userId, this.token, newEvento)
      .subscribe(evento => {
        this.showSuccess(evento)
        this.eventoForm.reset()
        this.routerPath.navigate([`/eventos/${this.userId}/${this.token}`])
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
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess(carrera: Carrera) {
    this.toastr.success(`La carrera ${carrera.nombre} fue creada`, "Creación exitosa");
  }

  onChangeTipoEvento() {
    this.eventoForm.get("equipo_1")?.reset()
    this.eventoForm.get("equipo_2")?.reset()
    this.tipoEvento = this.eventoForm.get("tipo")?.value;

    if(this.tipoEvento === 'PARTIDO') {
      this.eventoForm.get('equipo_1')?.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(128)]);
      this.eventoForm.get('equipo_2')?.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(128)]);
    } else {
      this.eventoForm.get('equipo_1')?.clearValidators();
      this.eventoForm.get('equipo_2')?.clearValidators();
    }

    this.eventoForm.get('equipo_1')?.updateValueAndValidity();
    this.eventoForm.get('equipo_2')?.updateValueAndValidity();
  }
}
