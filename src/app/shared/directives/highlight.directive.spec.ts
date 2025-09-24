import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HighlightDirective } from './highlight.directive';

@Component({
  selector: 'app-test-component',
  template: '<div [appHighlight]="color" [appHighlightDelay]="delay">Test</div>',
  standalone: true,
  imports: [HighlightDirective] // 🔹 on importe la directive ici
})
class TestComponent {
  color = 'yellow';
  delay = 0;
}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent] // 🔹 on importe le composant standalone
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should apply highlight color after delay', async () => {
    component.color = 'red';
    component.delay = 0; // ou mettre une valeur si tu veux tester le délai
    fixture.detectChanges();

    // comme il y a un setTimeout dans la directive, on attend un microtick
    await new Promise(resolve => setTimeout(resolve, component.delay + 10));

    const element = fixture.nativeElement.querySelector('div');
    expect(element.style.backgroundColor).toBe('red');
  });
});
