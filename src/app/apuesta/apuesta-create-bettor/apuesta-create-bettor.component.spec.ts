/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApuestaCreateBettorComponent } from './apuesta-create-bettor.component';

describe('ApuestaCreateBettorComponent', () => {
  let component: ApuestaCreateBettorComponent;
  let fixture: ComponentFixture<ApuestaCreateBettorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ApuestaCreateBettorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuestaCreateBettorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
