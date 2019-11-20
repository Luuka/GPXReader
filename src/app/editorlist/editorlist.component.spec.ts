import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorlistComponent } from './editorlist.component';

describe('EditorlistComponent', () => {
  let component: EditorlistComponent;
  let fixture: ComponentFixture<EditorlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
