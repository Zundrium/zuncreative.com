import { AfterContentInit, Component, ContentChildren, ElementRef, HostListener, QueryList } from '@angular/core';
import { SlideComponent } from '../slide/slide.component';
import Hammer from 'hammerjs';
import * as TWEEN from '@tweenjs/tween.js';
import { SlideContainerEventService } from '../slide-container-event.service';

@Component({
  selector: 'app-slide-container',
  templateUrl: './slide-container.component.html',
  styleUrls: ['./slide-container.component.scss']
})
export class SlideContainerComponent implements AfterContentInit {
  @ContentChildren(SlideComponent) slides!: QueryList<SlideComponent>;
  private _hammerManager: any;
  private _locked: boolean = false;
  private _currentTween!: any;
  private _activeSlide!: SlideComponent;
  private _scrollParent!: HTMLElement;

  constructor(private slideContainerService: SlideContainerEventService, private _element: ElementRef) {
    this._scrollParent = this._element.nativeElement;

    this._hammerManager = new Hammer.Manager(window.document);
    this._hammerManager.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_ALL, threshold: 0 }));
    this._hammerManager.on("swipeup", (event: Event) => {
      this.next();
    });

    this._hammerManager.on("swipedown", (event: Event) => {
      this.previous();
    });
  }

  @HostListener('wheel', ['$event'])
  redirectScroll(event: any) {
    event.preventDefault();
    if (this._locked) return;
    if (event.wheelDelta >= 0) {
      this.previous();
    } else {
      this.next();
    }
  }

  @HostListener('touchmove', ['$event'])
  disableTouch(event: any) {
    event.preventDefault();
  }

  ngAfterContentInit(): void {
    if (this.slides.length > 0) {
      this._scrollParent.scrollTop = 0;
      const slide = this.slides.get(0)!;
      this._activeSlide = slide;
      slide.setActive(true);
    }
  }

  animateTo(slide: SlideComponent) {
    this._locked = true;
    if (this._currentTween) this._currentTween.stop();
    const currentScroll = { y: this._scrollParent.scrollTop };
    this._currentTween = new TWEEN.Tween(currentScroll)
      .to({ y: slide.getScrollTop() })
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        this._scrollParent.scrollTop = currentScroll.y;
      })
      .onComplete(() => {
        this.slideContainerService.triggerAnimationComplete();
      })
      .start();
    this._activeSlide.setActive(false);
    this._activeSlide = slide;
    this._activeSlide.setActive(true);
    setTimeout(() => {
      this._locked = false;
    }, 1000)
  }

  previous() {
    const currentScroll = Math.round(this._scrollParent.scrollTop);
    if (currentScroll == 0) return;
    let lastSlide: any;
    for (let i = this.slides.length - 1; i >= 0; i--) {
      const slide = this.slides.get(i)!;
      if (slide.getScrollTop() < currentScroll) {
        lastSlide = slide;
        break;
      }
    }
    if (lastSlide) this.animateTo(lastSlide);
  }

  next() {
    const currentScroll = Math.round(this._scrollParent.scrollTop);
    if (currentScroll >= this.slides.last.getScrollTop()) return;
    let lastSlide: any;
    for (let slide of this.slides) {
      if (slide.getScrollTop() > currentScroll) {
        lastSlide = slide;
        break;
      }
    }
    if (lastSlide) this.animateTo(lastSlide);
  }
}


