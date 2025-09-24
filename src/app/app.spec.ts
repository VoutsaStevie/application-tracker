import { TestBed } from '@angular/core/testing';
import { App } from './app'; // <-- ton composant principal réel
import { ActivatedRoute } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App], // si App est standalone
      providers: [{ provide: ActivatedRoute, useValue: {} }] // mock minimal
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('applicationList App');

  });
});
