import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FronttwoComponent } from './fronttwo.component';

describe('FronttwoComponent', () => {
  let component: FronttwoComponent;
  let fixture: ComponentFixture<FronttwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FronttwoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FronttwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
