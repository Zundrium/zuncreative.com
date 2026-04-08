import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileProjectComponent } from './mobile-project.component';

describe('MobileProjectComponent', () => {
  let component: MobileProjectComponent;
  let fixture: ComponentFixture<MobileProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
