import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Note {
  id: number;
  content: string;
  topicId: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/notes';

  getLatestForTopic(topicId: number): Observable<Note> {
    return this.http.get<Note>(`${this.base}/topic/${topicId}`);
  }
}
