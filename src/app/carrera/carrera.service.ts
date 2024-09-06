import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Carrera, Competidor } from './carrera';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  private backUrl: string = environment.backURL;

  constructor(private http: HttpClient) { }

  getCarreras(usuario: number, token: string): Observable<Carrera[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Carrera[]>(`${this.backUrl}/usuario/${usuario}/carreras`, { headers: headers })
  }

  crearCarrera(idUsuario: number, token: string, carrera: Carrera): Observable<Carrera> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Carrera>(`${this.backUrl}/usuario/${idUsuario}/carreras`, carrera, { headers: headers })
  }

  getCarrera(idCarrera: number, token: string): Observable<Carrera> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Carrera>(`${this.backUrl}/carrera/${idCarrera}`, { headers: headers })
  }

  editarCarrera(token: string, idCarrera: number, carrera: Carrera): Observable<Carrera> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.put<Carrera>(`${this.backUrl}/carrera/${idCarrera}`, carrera, { headers: headers })
  }

  eliminarCarrera(token: string, idCarrera: number): Observable<Carrera> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.delete<Carrera>(`${this.backUrl}/carrera/${idCarrera}`, { headers: headers })
  }

  actualizarGanador(token: string, idCompetidor: number): Observable<Competidor> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.put<Competidor>(`${this.backUrl}/carrera/${idCompetidor}/terminacion`, { headers: headers })
  }

  verReporteCarrera(token: string, idCarrera: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Object>(`${this.backUrl}/carrera/${idCarrera}/reporte`, { headers: headers })
  }

}
