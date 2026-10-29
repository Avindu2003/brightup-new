import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceResetComponent } from './device-reset.component';

describe('DeviceResetComponent', () => {
  let component: DeviceResetComponent;
  let fixture: ComponentFixture<DeviceResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceResetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
