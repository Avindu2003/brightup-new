import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageActivationComponent } from './package-activation.component';

describe('PackageActivationComponent', () => {
  let component: PackageActivationComponent;
  let fixture: ComponentFixture<PackageActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageActivationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
