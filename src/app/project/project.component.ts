import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MobileProjectComponent } from '../mobile-project/mobile-project.component';

export class Project {
  constructor(
    public name: string,
    public slug: string,
    public type: string,
    public partner: string,
    public description: string,
    public image_fullscreen: string,
    public video_fullscreen: string,
    public video_mobile: string,
    public full_description: string,
    public external_url: string
  ) { }
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements AfterViewInit {

  private baseURL: string = "/assets"
  @Input() project!: Project;
  @ViewChild('image') imageElement!: ElementRef;
  @ViewChild('dialog') dialogElement!: ElementRef;
  @ViewChild('mobileProject') mobileProject!: MobileProjectComponent;

  constructor() { }

  ngAfterViewInit(): void {
    //this.loadVideo().then(() => {
    //  this.imageElement.nativeElement.classList.add('hide');
    //});
  }

  openDialog() {
    this.dialogElement.nativeElement.classList.add("active");
    this.mobileProject.playVideo();
  }

  closeDialog() {
    this.dialogElement.nativeElement.classList.remove("active");
    this.mobileProject.pauseVideo();
  }

}
