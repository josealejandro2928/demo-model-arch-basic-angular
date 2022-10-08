import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSaveRADesign } from './dialog-save-ra-design.component';

describe('DialogSaveRADesign', () => {
  let component: DialogSaveRADesign;
  let fixture: ComponentFixture<DialogSaveRADesign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSaveRADesign ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSaveRADesign);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
