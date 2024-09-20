import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApuestaApostador, Carrera, Competidor } from './carrera';
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
    return this.http.get<Carrera[]>(`${this.backUrl}/usuario/${usuario}/eventos`, { headers: headers })
  }

  crearCarrera(idUsuario: number, token: string, carrera: Carrera): Observable<Carrera> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Carrera>(`${this.backUrl}/usuario/${idUsuario}/eventos`, carrera, { headers: headers })
  }

  getCarrera(idEvento: number, token: string): Observable<Carrera> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Carrera>(`${this.backUrl}/evento/${idEvento}`, { headers: headers })
  }

  editarCarrera(token: string, idEvento: number, carrera: Carrera): Observable<Carrera> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.put<Carrera>(`${this.backUrl}/evento/${idEvento}`, carrera, { headers: headers })
  }

  eliminarCarrera(token: string, idEvento: number): Observable<Carrera> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.delete<Carrera>(`${this.backUrl}/evento/${idEvento}`, { headers: headers })
  }

  actualizarGanador(token: string, idCompetidor: number): Observable<Competidor> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.put<Competidor>(`${this.backUrl}/evento/${idCompetidor}/terminacion`, { headers: headers })
  }

  verReporteCarrera(token: string, idEvento: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Object>(`${this.backUrl}/evento/${idEvento}/reporte`, { headers: headers })
  }

  getApuestasApostador(token: string, idApostador: number): Observable<ApuestaApostador[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<ApuestaApostador[]>(`${this.backUrl}/usuario/${idApostador}/apuestas`, { headers: headers })
  }

}
