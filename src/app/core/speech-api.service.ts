import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api-base-url';
import { AudioTrackResponse, GenerateSpeechRequest } from './models/speech';

@Injectable({ providedIn: 'root' })
export class SpeechApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL).replace(/\/$/, '');

  generate(request: GenerateSpeechRequest): Observable<AudioTrackResponse> {
    return this.http.post<AudioTrackResponse>(
      `${this.baseUrl}/api/v1/speech/generate`,
      request,
    );
  }
}
