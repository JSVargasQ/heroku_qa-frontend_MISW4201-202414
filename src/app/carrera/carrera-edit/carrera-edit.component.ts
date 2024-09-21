import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Carrera } from '../carrera';
import { CarreraService } from '../carrera.service';

@Component({
  selector: 'app-carrera-edit',
  templateUrl: './carrera-edit.component.html',
  styleUrls: ['./carrera-edit.component.css']
})
export class CarreraEditComponent implements OnInit {

  userId: number;
  token: string;
  carreraId: number;
  carreraForm!: FormGroup;
  defaultTipoResultado: string;

  constructor(private carreraService: CarreraService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router) {
    this.initializeForm();
  }

  initializeForm()
  {
    this.carreraForm = new FormGroup({
      nombre: new FormControl(),
      posibles_resultados: new FormArray([])
    });
  }

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.carreraService.getCarrera(parseInt(this.router.snapshot.params.carreraId), this.token)
        .subscribe(carrera => {
          this.carreraId = carrera.id
          this.carreraForm = this.formBuilder.group({
            nombre: [carrera.nombre, [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
            posibles_resultados: new FormArray([])
          })

          this.defaultTipoResultado = carrera.posibles_resultados[0].tipo.toUpperCase()
          if (carrera.posibles_resultados.length > 0) {
            carrera.posibles_resultados.forEach((item, index) => {
              this.competidorformArray.push(this.createCompetidorForm(item));
            });
          }
        })
    }
  }

  get carreraFormControls() {
    return this.carreraForm.controls;
  }

  get competidorformArray() {
    return this.carreraFormControls.posibles_resultados as FormArray;
  }

  private createCompetidorForm(item?: any): FormGroup {
    return this.formBuilder.group({
      id: [item == null ? '' : item.id],
      posible_resultado: [item == null ? '' : item.posible_resultado, [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
      probabilidad: [item == null ? '' : Number(item.probabilidad).toFixed(2), [Validators.required, Validators.min(0), Validators.max(1)]],
      tipo: [item == null ? this.defaultTipoResultado : item.tipo.toUpperCase() ]
    });
  }

  onAddCompetidor() {
    this.competidorformArray.push(this.createCompetidorForm());
  }

  onRemoveCompetidor(index: number) {
    this.competidorformArray.removeAt(index);
  }

  cancelCreate() {
    this.carreraForm.reset()
    this.routerPath.navigate([`/eventos/${this.userId}/${this.token}`])
  }

  editarCarrera(newCarrera: Carrera) {
    this.carreraService.editarCarrera(this.token, this.carreraId, newCarrera)
      .subscribe(carrera => {
        this.showSuccess(carrera)
        this.carreraForm.reset()
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
    this.toastr.success(`El evento ${carrera.nombre} fue editada`, "Edición exitosa");
  }

}
