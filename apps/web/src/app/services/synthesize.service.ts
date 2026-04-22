import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SynthesizeEntry {
  topicId: number;
  topicName: string;
  confirmation: string;
}

export interface SynthesizeResult {
  entries: SynthesizeEntry[];
}

@Injectable({ providedIn: 'root' })
export class SynthesizeService {
  private readonly http = inject(HttpClient);

  process(text: string): Observable<SynthesizeResult> {
    return this.http.post<SynthesizeResult>('/api/synthesize', { text });
  }
}
