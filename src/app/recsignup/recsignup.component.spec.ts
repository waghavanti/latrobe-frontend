import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecsignupComponent } from './recsignup.component';

describe('RecsignupComponent', () => {
  let component: RecsignupComponent;
  let fixture: ComponentFixture<RecsignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecsignupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
