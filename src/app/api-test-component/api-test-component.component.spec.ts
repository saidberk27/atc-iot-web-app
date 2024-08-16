import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTestComponentComponent } from './api-test-component.component';

describe('ApiTestComponentComponent', () => {
  let component: ApiTestComponentComponent;
  let fixture: ComponentFixture<ApiTestComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiTestComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApiTestComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
