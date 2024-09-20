import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import { BalanceResponse } from './registrocuenta';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private backUrl: string = environment.backURL;

  constructor(private http: HttpClient) { }

  getTransaccionesUsuario(usuario: number, token: string): Observable<BalanceResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<BalanceResponse>(`${this.backUrl}/usuario/${usuario}/balance_transacciones`, { headers: headers })
  }

  recargarSaldo(usuario: number, token: string, valor: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post(`${this.backUrl}/usuario/${usuario}/recargar`, { valor: valor }, { headers: headers })
  }

  retirarSaldo(usuario: number, token: string, valor: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post(`${this.backUrl}/usuario/${usuario}/retirar`, { valor: valor }, { headers: headers })
  }
  
}
