import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { PageableService } from './pageable.service';
import { SlideContainerEventService } from './slide-container-event.service';

@Directive({
  selector: '[playInView]'
})
export class PlayInViewDirective implements AfterViewInit {

  private videoElement: HTMLVideoElement;
  private visible: boolean = false;

  constructor(private element: ElementRef, private slideContainerEventService: SlideContainerEventService) {
    this.videoElement = element.nativeElement;
    this.videoElement.muted = true;

    this.videoElement.addEventListener('canplay', (e) => {
      this.videoElement.classList.add("is-loaded");
    });

    slideContainerEventService.onAnimationComplete.subscribe(() => {
      this.checkVisibility();
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkVisibility();
    })
  }

  checkVisibility() {
    const inView = this.isElementInViewport();
    if (!this.visible && inView) {
      this.visible = true;
      this.videoElement.play();
    } else if (this.visible && !inView) {
      this.visible = false;
      this.videoElement.pause();
    }
  }

  // source: https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
  isElementInViewport() {
    const rect = this.videoElement.getBoundingClientRect();
    if (rect.width == 0 || rect.height == 0) return false;
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 1 && /* or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + 1 /* or $(window).width() */
    );
  }
}
