import { angleForIndex, indexForAngle } from '../emotion-wheel';
import { EMOTIONS } from '@/lib/types';

const TOTAL = EMOTIONS.length;

describe('angleForIndex', () => {
  it('places the first emotion near the left edge of the semicircle (165deg)', () => {
    expect(angleForIndex(0, TOTAL)).toBeCloseTo(165);
  });

  it('places the last emotion near the right edge of the semicircle (15deg)', () => {
    expect(angleForIndex(TOTAL - 1, TOTAL)).toBeCloseTo(15);
  });

  it('spaces every emotion evenly across the 180 degree arc', () => {
    const angles = EMOTIONS.map((_, i) => angleForIndex(i, TOTAL));
    for (let i = 1; i < angles.length; i++) {
      expect(angles[i - 1] - angles[i]).toBeCloseTo(180 / TOTAL);
    }
  });
});

describe('indexForAngle', () => {
  it('is the inverse of angleForIndex for every real emotion slot', () => {
    for (let i = 0; i < TOTAL; i++) {
      const angle = angleForIndex(i, TOTAL);
      expect(indexForAngle(angle, TOTAL)).toBe(i);
    }
  });

  it('clamps angles below 0 to the last index (drag past the left edge)', () => {
    expect(indexForAngle(-45, TOTAL)).toBe(TOTAL - 1);
  });

  it('clamps angles above 180 to the first index (drag past the right edge)', () => {
    expect(indexForAngle(225, TOTAL)).toBe(0);
  });
});
