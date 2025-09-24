import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecpageComponent } from './recpage.component';

describe('RecpageComponent', () => {
  let component: RecpageComponent;
  let fixture: ComponentFixture<RecpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
