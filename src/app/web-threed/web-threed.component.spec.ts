import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebThreedComponent } from './web-threed.component';

describe('WebThreedComponent', () => {
  let component: WebThreedComponent;
  let fixture: ComponentFixture<WebThreedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebThreedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebThreedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
