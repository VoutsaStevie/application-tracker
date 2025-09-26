import { PriorityPipe } from './priority.pipe';

describe('PriorityPipe', () => {
  let pipe: PriorityPipe;

  beforeEach(() => {
    pipe = new PriorityPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should translate job priority to "Faible"', () => {
    expect(pipe.transform('job')).toBe('Faible');
  });

  it('should translate stage priority to "Moyenne"', () => {
    expect(pipe.transform('stage')).toBe('Moyenne');
  });

  it('should translate high priority to "Haute"', () => {
    expect(pipe.transform('high')).toBe('Haute');
  });

  it('should return original value for unknown priority', () => {
    expect(pipe.transform('unknown' as unknown as 'job' | 'stage' | 'high')).toBe('unknown');
  });
});