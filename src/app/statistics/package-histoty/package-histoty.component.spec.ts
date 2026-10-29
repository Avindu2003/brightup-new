import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageHistotyComponent } from './package-histoty.component';

describe('PackageHistotyComponent', () => {
  let component: PackageHistotyComponent;
  let fixture: ComponentFixture<PackageHistotyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageHistotyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageHistotyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
