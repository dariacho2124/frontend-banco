import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private readonly apiUrl = '/api/movimientos';

  constructor(private readonly http: HttpClient) { }

  getMovimientos(clienteId: number, inicio: string, fin: string): Observable<any[]> {
    const inicioLimpio = inicio ? inicio.split('T')[0] : inicio;
    const finLimpio = fin ? fin.split('T')[0] : fin;
    const url = `${this.apiUrl}/reportes?clienteId=${clienteId}&inicio=${inicioLimpio}&fin=${finLimpio}`;
    return this.http.get<any[]>(url);
  }
  getAll(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);
}

delete(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

  save(movimiento: any): Observable<any> {
    return this.http.post(this.apiUrl, movimiento);
  }
}