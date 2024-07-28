import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomHeroSectionComponent } from './bottom-hero-section.component';

describe('BottomHeroSectionComponent', () => {
  let component: BottomHeroSectionComponent;
  let fixture: ComponentFixture<BottomHeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomHeroSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BottomHeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
