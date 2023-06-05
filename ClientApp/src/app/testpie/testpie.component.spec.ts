import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestpieComponent } from './testpie.component';

describe('TestpieComponent', () => {
  let component: TestpieComponent;
  let fixture: ComponentFixture<TestpieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestpieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestpieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
