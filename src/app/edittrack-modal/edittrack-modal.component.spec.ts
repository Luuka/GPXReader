import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdittrackModalComponent } from './edittrack-modal.component';

describe('EdittrackModalComponent', () => {
  let component: EdittrackModalComponent;
  let fixture: ComponentFixture<EdittrackModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdittrackModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdittrackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
