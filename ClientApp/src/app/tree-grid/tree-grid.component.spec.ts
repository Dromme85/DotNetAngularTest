import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeGridComponent } from './tree-grid.component';

describe('TreeGridComponent', () => {
  let component: TreeGridComponent;
  let fixture: ComponentFixture<TreeGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
