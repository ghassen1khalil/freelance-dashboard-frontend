import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionAccordionComponent } from './position-accordion.component';

describe('AccordComponent', () => {
  let component: PositionAccordionComponent;
  let fixture: ComponentFixture<PositionAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionAccordionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
