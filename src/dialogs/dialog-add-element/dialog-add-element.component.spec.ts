import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddElementComponent } from './dialog-add-element.component';

describe('DialogAddElementComponent', () => {
  let component: DialogAddElementComponent;
  let fixture: ComponentFixture<DialogAddElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
