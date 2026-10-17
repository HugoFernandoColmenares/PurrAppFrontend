import { formatCreatedAt, formatDuration } from './speech-display.mapper';

describe('speech display', () => {
  it('formats duration with a Spanish decimal comma', () => {
    expect(formatDuration(3.2)).toBe('3,2 s');
  });

  it('formats the track date in Spanish', () => {
    const label = formatCreatedAt('2026-10-17T17:00:00.000Z');
    expect(label.length).toBeGreaterThan(0);
    expect(label).toMatch(/2026/);
  });
});
