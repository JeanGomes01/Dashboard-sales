import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyGrownthComponent } from './monthly-grownth.component';

describe('MonthlyGrownthComponent', () => {
  let component: MonthlyGrownthComponent;
  let fixture: ComponentFixture<MonthlyGrownthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyGrownthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyGrownthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
