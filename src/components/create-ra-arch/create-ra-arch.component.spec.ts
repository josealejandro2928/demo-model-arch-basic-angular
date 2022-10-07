import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRaArchComponent } from './create-ra-arch.component';

describe('CreateRaArchComponent', () => {
  let component: CreateRaArchComponent;
  let fixture: ComponentFixture<CreateRaArchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRaArchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRaArchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
