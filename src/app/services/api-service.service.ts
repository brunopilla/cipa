import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getColaborador(matricula: string): Observable<any> {
    return this.http.get<any>(`${environment.host}api/prghur/cstp/v1/eleicao-cipa/${matricula}`);
  }

  atualizarData(matricula: string, data: Date): Observable<any> {
    return this.http.put<any>(`${environment.host}api/prghur/cstp/v1/eleicao-cipa/${matricula}`, { data });
  }
}


