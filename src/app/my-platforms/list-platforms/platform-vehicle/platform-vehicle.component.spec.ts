import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformVehicleComponent } from './platform-vehicle.component';

describe('PlatformVehicleComponent', () => {
  let component: PlatformVehicleComponent;
  let fixture: ComponentFixture<PlatformVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlatformVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
