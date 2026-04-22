import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Topic {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class TopicsService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/topics';

  getAll(): Observable<Topic[]> {
    return this.http.get<Topic[]>(this.base);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
