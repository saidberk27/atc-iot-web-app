import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPlatformsComponent } from './my-platforms.component';

describe('MyPlatformsComponent', () => {
  let component: MyPlatformsComponent;
  let fixture: ComponentFixture<MyPlatformsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPlatformsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyPlatformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
