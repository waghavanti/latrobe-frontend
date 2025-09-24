import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GensignupComponent } from './gensignup.component';

describe('GensignupComponent', () => {
  let component: GensignupComponent;
  let fixture: ComponentFixture<GensignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GensignupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GensignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
