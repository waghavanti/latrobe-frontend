import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenloginComponent } from './genlogin.component';

describe('GenloginComponent', () => {
  let component: GenloginComponent;
  let fixture: ComponentFixture<GenloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenloginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
