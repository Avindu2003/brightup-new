import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPackageComponent } from './subscription-package.component';

describe('SubscriptionPackageComponent', () => {
  let component: SubscriptionPackageComponent;
  let fixture: ComponentFixture<SubscriptionPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionPackageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
