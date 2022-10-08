import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRaDesign } from './select-ra-design.component';

describe('SelectRaDesign', () => {
  let component: SelectRaDesign;
  let fixture: ComponentFixture<SelectRaDesign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectRaDesign ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectRaDesign);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
