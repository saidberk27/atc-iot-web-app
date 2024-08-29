import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorScreenComponent } from './sensor-screen.component';

describe('SensorScreenComponent', () => {
  let component: SensorScreenComponent;
  let fixture: ComponentFixture<SensorScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
