import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-fixed-title',
  templateUrl: './fixed-title.component.html',
  styleUrls: ['./fixed-title.component.scss']
})
export class FixedTitleComponent implements AfterViewInit {

  constructor(private _element: ElementRef) { }

  ngAfterViewInit(): void {
    this._offset = this.calculateOffset();
    window.addEventListener("resize", () => {
      this._offset = this.calculateOffset();
    });
    window.requestAnimationFrame(this.update.bind(this));
  }

  private _offset: number = 0;
  private _oldScroll: number = 0;

  calculateOffset() {
    return (this._element.nativeElement.parentNode.parentNode.offsetHeight / 2) - this._element.nativeElement.parentNode.parentNode.offsetTop - (this._element.nativeElement.offsetHeight / 2);
  }

  update() {
    if (window.scrollY != this._oldScroll) {
      this._oldScroll = window.scrollY;
      this._element.nativeElement.style.transform = `translate3d(0, ${window.scrollY + this._offset}px, 0)`;
    }
    window.requestAnimationFrame(this.update.bind(this));
  }

}
