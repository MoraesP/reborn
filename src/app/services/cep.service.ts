import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CEP } from '../interfaces/cep';

@Injectable({ providedIn: 'root' })
export class CepService {
  constructor(private http: HttpClient) {}

  buscarCEP(cep: number): Observable<CEP> {
    return this.http.get<CEP>(`https://viacep.com.br/ws/${cep}/json/`);
  }
}
