import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAX_TEXT_LENGTH } from '../../core/models/speech.model';
import { StudioComponent } from './studio.component';

describe('StudioComponent', () => {
  let fixture: ComponentFixture<StudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudioComponent],
      providers: [provideHttpClient()],
    }).compileComponents();
    fixture = TestBed.createComponent(StudioComponent);
    await fixture.whenStable();
  });

  it('opens on Bella with an empty result and a disabled action', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Purr');
    expect(
      compiled.querySelector('.studio__voice--active')?.textContent,
    ).toContain('Bella');
    expect(compiled.querySelector('audio')).toBeNull();
    expect(compiled.textContent).toContain('El audio aparecerá aquí.');
    expect(
      (compiled.querySelector('.studio__submit') as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('shows the domain length error before sending', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const textarea = compiled.querySelector('textarea');
    expect(textarea).toBeTruthy();
    textarea!.value = 'a'.repeat(MAX_TEXT_LENGTH + 1);
    textarea!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelector('[role="alert"]')?.textContent).toContain(
      `El texto tiene ${MAX_TEXT_LENGTH + 1} caracteres`,
    );
    expect(
      (compiled.querySelector('.studio__submit') as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});
