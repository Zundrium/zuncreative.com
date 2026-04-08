import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebArComponent } from './web-ar.component';

describe('WebArComponent', () => {
  let component: WebArComponent;
  let fixture: ComponentFixture<WebArComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebArComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
