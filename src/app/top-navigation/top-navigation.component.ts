import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit {
  //@ViewChild('navIcon') navIcon!: ElementRef;
  //@ViewChild('menuBody') menuBody!: ElementRef;
  @ViewChild('webARButton') webARButton!: ElementRef;
  @ViewChild('web3DButton') web3DButton!: ElementRef;
  @ViewChild('contactButton') contactButton!: ElementRef;
  @Input('app') app!: AppComponent;

  constructor() { }

  ngOnInit(): void {
  }

  // openMenu() {
  //   if (this.navIcon.nativeElement.classList.contains("open")) {
  //     this.navIcon.nativeElement.classList.remove("open");
  //     this.menuBody.nativeElement.classList.remove("open");
  //   } else {
  //     this.navIcon.nativeElement.classList.add("open");
  //     this.menuBody.nativeElement.classList.add("open");
  //   }
  // }

  showWebAR() {

  }

  showWeb3D() {
    console.log(this.app);
  }

  showContact() {

  }


}
