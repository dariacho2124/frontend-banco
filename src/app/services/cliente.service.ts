import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly apiUrl = '/api/clientes';

  constructor(private readonly http: HttpClient) { }

create(cliente: any): Observable<any> {
  return this.http.post(this.apiUrl, cliente);
}
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

update(id: number, cliente: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, cliente);
}

delete(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
}