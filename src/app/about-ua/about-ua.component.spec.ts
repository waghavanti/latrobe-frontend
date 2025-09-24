import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUaComponent } from './about-ua.component';

describe('AboutUaComponent', () => {
  let component: AboutUaComponent;
  let fixture: ComponentFixture<AboutUaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutUaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutUaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
