import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomHeroSection2Component } from './bottom-hero-section-2.component';

describe('BottomHeroSection2Component', () => {
  let component: BottomHeroSection2Component;
  let fixture: ComponentFixture<BottomHeroSection2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomHeroSection2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BottomHeroSection2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
