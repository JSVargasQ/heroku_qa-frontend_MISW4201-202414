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

  constructor(

    private carreraService: CarreraService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router) { this.initializeForm(); }
  
  initializeForm()
  {
    this.carreraForm = new FormGroup({
      nombre: new FormControl(),
      competidores: new FormArray([])
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
            nombre: [carrera.nombre_carrera, [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
            competidores: new FormArray([])
          })

          if (carrera.competidores.length > 0) {
            carrera.competidores.forEach((item, index) => {
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
    return this.carreraFormControls.competidores as FormArray;
  }

  private createCompetidorForm(item?: any): FormGroup {
    return this.formBuilder.group({
      id: [item == null ? '' : item.id],
      competidor: [item == null ? '' : item.nombre_competidor, [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
      probabilidad: [item == null ? '' : Number(item.probabilidad).toFixed(2), [Validators.required, Validators.min(0), Validators.max(1)]]
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
    this.routerPath.navigate([`/carreras/${this.userId}/${this.token}`])
  }

  editarCarrera(newCarrera: Carrera) {
    this.carreraService.editarCarrera(this.token, this.carreraId, newCarrera)
      .subscribe(carrera => {
        this.showSuccess(carrera)
        this.carreraForm.reset()
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

}
