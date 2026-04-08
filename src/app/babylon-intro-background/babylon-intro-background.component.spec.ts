import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabylonIntroBackgroundComponent } from './babylon-intro-background.component';

describe('BabylonIntroBackgroundComponent', () => {
  let component: BabylonIntroBackgroundComponent;
  let fixture: ComponentFixture<BabylonIntroBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BabylonIntroBackgroundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BabylonIntroBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
