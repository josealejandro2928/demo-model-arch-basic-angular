import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSaArchComponent } from './create-sa-arch.component';

describe('CreateSaArchComponent', () => {
  let component: CreateSaArchComponent;
  let fixture: ComponentFixture<CreateSaArchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSaArchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSaArchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
