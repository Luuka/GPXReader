import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditormapComponent } from './editormap.component';

describe('EditormapComponent', () => {
  let component: EditormapComponent;
  let fixture: ComponentFixture<EditormapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditormapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditormapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
