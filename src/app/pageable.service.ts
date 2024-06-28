import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var Pageable: any;

@Injectable({
  providedIn: 'root'
})
export class PageableService {

  private _pageable: any;
  public onChange: Subject<void> = new Subject<void>();
  public onStart: Subject<void> = new Subject<void>();

  constructor() { }

  create(name: string, options: {}): any {
    this._pageable = new Pageable(name, options);
    setTimeout(() => {
      this.onStart.next();
    });
    this._pageable.on("scroll.end", (data: any) => {
      this.onChange.next();
    })
    return this._pageable;
  }
}
