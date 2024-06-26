import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, delay } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {
  constructor(private http: HttpClient) {}

  getOcorrenciasDoMes(month: number, year: number): Observable<any[]> {
    const url = `${environment.host}api/cstp/st/v1/acidente?month=${month}&year=${year}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        
        if (response && response.items) {
          return response.items;
        } else {
          return [];
        }
      })
    );
  }

  getOcorrenciasDoDia(day: number, month: number, year: number): Observable<any[]> {
    const url = `${environment.host}api/cstp/st/v1/acidente?day=${day}&month=${month}&year=${year}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        
        if (response && response.items) {
          return response.items;
        } else {
          return [];
        }
      })
    );
  }
}