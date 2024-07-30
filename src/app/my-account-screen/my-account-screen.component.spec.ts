import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccountScreenComponent } from './my-account-screen.component';

describe('MyAccountScreenComponent', () => {
  let component: MyAccountScreenComponent;
  let fixture: ComponentFixture<MyAccountScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAccountScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyAccountScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
