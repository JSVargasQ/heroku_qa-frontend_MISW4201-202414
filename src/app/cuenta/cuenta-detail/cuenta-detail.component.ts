import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuentaService } from '../cuenta.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cuenta-detail',
  templateUrl: './cuenta-detail.component.html',
  styleUrl: './cuenta-detail.component.css'
})
export class CuentaDetailComponent implements OnInit {

  userId: number;
  token: string;
  saldoActual: number;

  constructor(
    private router: ActivatedRoute,
    private cuentaService: CuentaService,
    private toastr: ToastrService,
  ) {}
  
  ngOnInit() {
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken

    this.getRegistrosUsuario()
  }

  getRegistrosUsuario() {
    this.cuentaService.getTransaccionesUsuario(this.userId, this.token)
    .subscribe(registros => {
      this.saldoActual = registros.reduce((acc, registro) => acc + registro.valor, 0)
    },
    error => {
      console.log(error)
      if (error.statusText === "UNAUTHORIZED") {
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else {
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })
  }

  
  showError(error: string) {
    this.toastr.error(error, "Error cargando registros de Usuario")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error cargando registros de Usuario")
  }

}
