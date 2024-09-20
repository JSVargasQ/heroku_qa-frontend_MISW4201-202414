import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private backUrl: string = environment.backURL;

    constructor(private http: HttpClient) { }

    userLogIn(usuario: string, contrasena: string): Observable<any> {
        return this.http.post<any>(`${this.backUrl}/login`, { "usuario": usuario, "contrasena": contrasena });
    }

    userSignUp(body: any): Observable<any> {
        return this.http.post<any>(`${this.backUrl}/signin`, body)
    }

    getApostadores(token: string): Observable<any> {
        return this.http.get<any>(`${this.backUrl}/apostadores`, { headers: { 'Authorization': `Bearer ${token}` } })
    }

    getUserTransactions(usuario: number, token: string): Observable<any> {
        return this.http.get<any>(`${this.backUrl}/usuario/${usuario}/transacciones`, { headers: { 'Authorization': `Bearer ${token}` } })
    }

    getUserInfo(usuario: number, token: string): Observable<any> {
        return this.http.get<any>(`${this.backUrl}/usuario/${usuario}`, { headers: { 'Authorization': `Bearer ${token}` } })
    }
}
