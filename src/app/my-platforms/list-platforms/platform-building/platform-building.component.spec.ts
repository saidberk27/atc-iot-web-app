import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformBuildingComponent } from './platform-building.component';

describe('PlatformBuildingComponent', () => {
  let component: PlatformBuildingComponent;
  let fixture: ComponentFixture<PlatformBuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformBuildingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlatformBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
