import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api-base-url';
import { AudioTrack, GenerateSpeechRequest } from '../models/speech.model';

@Injectable({ providedIn: 'root' })
export class SpeechApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL).replace(/\/$/, '');

  generate(request: GenerateSpeechRequest): Observable<AudioTrack> {
    return this.http.post<AudioTrack>(
      `${this.baseUrl}/api/v1/speech/generate`,
      request,
    );
  }
}
