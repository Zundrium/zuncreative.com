import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent implements OnInit {
  public active: boolean = false;

  constructor(private _element: ElementRef) { }

  setActive(active: boolean) {
    if (active) {
      this.active = true;
      this._element.nativeElement.classList.add('slide-active');
    } else {
      this.active = false;
      this._element.nativeElement.classList.remove('slide-active');
    }
  }

  getScrollTop(): number {
    return this._element.nativeElement.offsetTop;
  }

  ngOnInit(): void {
  }

}
