import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlideContainerEventService {

  public onAnimationComplete: Subject<void> = new Subject<void>();

  constructor() { }

  triggerAnimationComplete() {
    this.onAnimationComplete.next();
  }
}
