import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlatformsComponent } from './list-platforms.component';

describe('ListPlatformsComponent', () => {
  let component: ListPlatformsComponent;
  let fixture: ComponentFixture<ListPlatformsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPlatformsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPlatformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
