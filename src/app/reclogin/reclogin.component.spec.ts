import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecloginComponent } from './reclogin.component';

describe('RecloginComponent', () => {
  let component: RecloginComponent;
  let fixture: ComponentFixture<RecloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecloginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
