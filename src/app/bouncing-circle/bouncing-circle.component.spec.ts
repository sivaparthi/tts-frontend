import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BouncingCircleComponent } from './bouncing-circle.component';

describe('BouncingCircleComponent', () => {
  let component: BouncingCircleComponent;
  let fixture: ComponentFixture<BouncingCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BouncingCircleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BouncingCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
