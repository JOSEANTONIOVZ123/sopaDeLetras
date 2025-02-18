import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopaLetrasComponent } from './sopa-letras.component';

describe('SopaLetrasComponent', () => {
  let component: SopaLetrasComponent;
  let fixture: ComponentFixture<SopaLetrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SopaLetrasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SopaLetrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
