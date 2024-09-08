import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroCuenta } from './registrocuenta';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  private backUrl: string = environment.backURL;

  constructor(private http: HttpClient) { }

  getTransaccionesUsuario(usuario: number, token: string): Observable<RegistroCuenta[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<RegistroCuenta[]>(`${this.backUrl}/usuario/${usuario}/transacciones`, { headers: headers })
  }
}
