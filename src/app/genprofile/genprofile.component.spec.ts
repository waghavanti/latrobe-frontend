import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenprofileComponent } from './genprofile.component';

describe('GenprofileComponent', () => {
  let component: GenprofileComponent;
  let fixture: ComponentFixture<GenprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
