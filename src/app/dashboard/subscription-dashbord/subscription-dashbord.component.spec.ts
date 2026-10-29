import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionDashbordComponent } from './subscription-dashbord.component';

describe('SubscriptionDashbordComponent', () => {
  let component: SubscriptionDashbordComponent;
  let fixture: ComponentFixture<SubscriptionDashbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionDashbordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
