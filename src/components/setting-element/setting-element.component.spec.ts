import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingElementComponent } from './setting-element.component';

describe('SettingElementComponent', () => {
  let component: SettingElementComponent;
  let fixture: ComponentFixture<SettingElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
