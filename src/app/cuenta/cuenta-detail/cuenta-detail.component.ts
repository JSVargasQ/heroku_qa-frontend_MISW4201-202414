import { Component, ViewChild ,ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuentaService } from '../cuenta.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { Transaction } from '../registrocuenta';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cuenta-detail',
  templateUrl: './cuenta-detail.component.html',
  styleUrl: './cuenta-detail.component.css'
})
export class CuentaDetailComponent implements OnInit {

  userId: number;
  token: string;
  saldoActual: number;
  transactions: Array<Transaction>;
  public recarga: number;
  public retiro: number;

  constructor(
    private router: ActivatedRoute,
    private cuentaService: CuentaService,
    private toastr: ToastrService,
  ) {}
  
  ngOnInit() {
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken

    this.getTransaccionesUsuario()
  }

  getTransaccionesUsuario() {
    this.cuentaService.getTransaccionesUsuario(this.userId, this.token)
    .subscribe(response => {
      this.saldoActual = response.balance;
      this.transactions = response.transactions;
      this.transactions.sort((a, b) =>  new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());
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

  onSubmitRecarga(){
    console.log('Valor ingresado:', this.recarga);

    this.cuentaService.recargarSaldo(this.userId, this.token, this.recarga)
    .subscribe(response => {
      this.showSuccess(response)
      this.getTransaccionesUsuario()
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

  onSubmitRetiro(){
    console.log('Valor ingresado:', this.retiro);

    this.cuentaService.retirarSaldo(this.userId, this.token, this.retiro)
    .subscribe(response => {
      this.showSuccess(response)
      this.getTransaccionesUsuario()
    },
    error => {
      console.log(error)
      if (error.statusText === "UNAUTHORIZED") {
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      if (error.statusText === "BAD REQUEST") {
        this.showError(error.error)
      }
      else {
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })
  }

  showError(error: string) {
    this.toastr.error(error)
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error cargando registros de Usuario")
  }

  showSuccess(message: string) {
    this.toastr.success(message)
  }

  getTransactionType(tipo: string): string {
    switch (tipo) {
      case 'recarga':
        return 'Recarga';
      case 'ganancia':
        return 'Ganancia';
      case 'retiro':
        return 'Retiro';
      case 'apuesta':
        return 'Apuesta';
      default:
        return tipo;
    }
  }

}
