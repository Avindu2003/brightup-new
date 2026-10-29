import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrViewComponent } from './ocr-view.component';

describe('OcrViewComponent', () => {
  let component: OcrViewComponent;
  let fixture: ComponentFixture<OcrViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcrViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OcrViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
