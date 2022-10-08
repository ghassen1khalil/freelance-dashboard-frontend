import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAccordionComponent } from './dashboard-accordion.component';

describe('AccordionComponent', () => {
  let component: DashboardAccordionComponent;
  let fixture: ComponentFixture<DashboardAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAccordionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
