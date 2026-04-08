import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Project } from '../project/project.component';

@Component({
  selector: 'app-mobile-project',
  templateUrl: './mobile-project.component.html',
  styleUrls: ['./mobile-project.component.scss']
})
export class MobileProjectComponent implements OnInit {

  @Input() project!: Project;
  @ViewChild('mobileVideo') mobileVideoElement!: ElementRef;
  @ViewChild('mobileBackgroundVideo') mobileBackgroundVideoElement!: ElementRef;

  constructor(private _element: ElementRef) { }

  ngOnInit(): void {
  }

  showVideo(): void {
    this._element.nativeElement.classList.add('fullscreen')
  }

  hideVideo(): void {
    this._element.nativeElement.classList.remove('fullscreen')
  }

  playVideo(): void {
    console.log("playing video");
    this.mobileVideoElement.nativeElement.muted = true;
    this.mobileVideoElement.nativeElement.play();

    this.mobileBackgroundVideoElement.nativeElement.muted = true;
    this.mobileBackgroundVideoElement.nativeElement.play();
  }

  pauseVideo(): void {
    this.mobileVideoElement.nativeElement.pause();
    this.mobileBackgroundVideoElement.nativeElement.pause();
  }

}
