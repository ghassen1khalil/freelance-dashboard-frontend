import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PositionCardComponent} from './position-card.component';

describe('SimpleCardComponent', () => {
  let component: PositionCardComponent;
  let fixture: ComponentFixture<PositionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
