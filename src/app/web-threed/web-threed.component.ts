import { Component, OnInit, ViewChild } from '@angular/core';
import { PageableService } from '../pageable.service';
import { Project } from '../project/project.component';
import { SlideContainerComponent } from '../slide-container/slide-container.component';
import { YamlReadService } from '../yaml-read.service';

@Component({
  selector: 'app-web-threed',
  templateUrl: './web-threed.component.html',
  styleUrls: ['./web-threed.component.scss']
})
export class WebThreedComponent implements OnInit {

  public projects: Project[] = [];
  @ViewChild(SlideContainerComponent) slideContainer!: SlideContainerComponent;

  constructor(private _yamlReadService: YamlReadService) { }

  ngOnInit(): void {
    this._yamlReadService.load().then((work) => {
      this.projects = work.projects.filter((x: Project) => { return x.type == '3d' });
    });
  }

  goNext() {
    this.slideContainer.next();
  }



}
