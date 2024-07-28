import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstSignInComponent } from './first-sign-in.component';

describe('FirstSignInComponent', () => {
  let component: FirstSignInComponent;
  let fixture: ComponentFixture<FirstSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstSignInComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirstSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
