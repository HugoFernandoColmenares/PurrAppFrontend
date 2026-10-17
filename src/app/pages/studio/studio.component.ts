import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  expressionLabel,
  formatCreatedAt,
  formatDuration,
} from '../../core/mappers/speech-display.mapper';
import { speechErrorMessage } from '../../core/mappers/speech-error.mapper';
import {
  cleanedSpeechText,
  speechTextError,
  toGenerateSpeechRequest,
} from '../../core/mappers/speech-request.mapper';
import { EXPRESSIONS, VOICES } from '../../core/models/speech-catalog.model';
import { AudioTrack, MAX_TEXT_LENGTH } from '../../core/models/speech.model';
import { SpeechApiService } from '../../core/services/speech-api.service';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioComponent {
  private readonly api = inject(SpeechApiService);

  protected readonly voices = VOICES;
  protected readonly expressions = EXPRESSIONS;
  protected readonly expressionLabel = expressionLabel;
  protected readonly formatDuration = formatDuration;
  protected readonly formatCreatedAt = formatCreatedAt;

  protected readonly text = signal('');
  protected readonly voice = signal('Bella');
  protected readonly expression = signal<string | null>(null);
  protected readonly normalize = signal(true);
  protected readonly generating = signal(false);
  protected readonly track = signal<AudioTrack | null>(null);
  protected readonly clientError = signal<string | null>(null);
  protected readonly serverError = signal<string | null>(null);

  protected readonly count = computed(
    () => cleanedSpeechText(this.text()).length,
  );
  protected readonly overLimit = computed(
    () => this.count() > MAX_TEXT_LENGTH,
  );
  protected readonly canSubmit = computed(
    () => !this.generating() && speechTextError(this.text()) === null,
  );
  protected readonly alertMessage = computed(
    () => this.clientError() ?? this.serverError(),
  );
  protected readonly describedBy = computed(() =>
    this.alertMessage()
      ? 'speech-hint speech-count speech-error'
      : 'speech-hint speech-count',
  );

  protected onText(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.text.set(value);
    const message = speechTextError(value);
    this.clientError.set(message && cleanedSpeechText(value) ? message : null);
  }

  protected selectVoice(value: string): void {
    this.voice.set(value);
  }

  protected selectExpression(value: string | null): void {
    this.expression.set(value);
  }

  protected onNormalize(event: Event): void {
    this.normalize.set((event.target as HTMLInputElement).checked);
  }

  protected generate(event: Event): void {
    event.preventDefault();
    if (this.generating()) {
      return;
    }
    const message = speechTextError(this.text());
    if (message) {
      this.clientError.set(message);
      return;
    }

    this.clientError.set(null);
    this.serverError.set(null);
    this.generating.set(true);
    const request = toGenerateSpeechRequest(
      this.text(),
      this.voice(),
      this.expression(),
      this.normalize(),
    );
    this.api.generate(request).subscribe({
      next: (track) => {
        this.track.set(track);
        this.generating.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.serverError.set(speechErrorMessage(error));
        this.generating.set(false);
      },
    });
  }
}
