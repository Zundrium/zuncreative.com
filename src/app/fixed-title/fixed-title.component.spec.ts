import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedTitleComponent } from './fixed-title.component';

describe('FixedTitleComponent', () => {
  let component: FixedTitleComponent;
  let fixture: ComponentFixture<FixedTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
