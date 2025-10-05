import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageTicketComponent } from './average-ticket.component';

describe('AverageTicketComponent', () => {
  let component: AverageTicketComponent;
  let fixture: ComponentFixture<AverageTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AverageTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AverageTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
