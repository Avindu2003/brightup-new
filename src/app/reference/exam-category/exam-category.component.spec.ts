import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamCategoryComponent } from './exam-category.component';

describe('ExamCategoryComponent', () => {
  let component: ExamCategoryComponent;
  let fixture: ComponentFixture<ExamCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
