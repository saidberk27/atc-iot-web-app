import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBuildingsComponent } from './my-buildings.component';

describe('MyBuildingsComponent', () => {
  let component: MyBuildingsComponent;
  let fixture: ComponentFixture<MyBuildingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBuildingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyBuildingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
