import { Component, OnInit, ViewChild } from '@angular/core';
import { PageableService } from '../pageable.service';
import { Project } from '../project/project.component';
import { SlideContainerComponent } from '../slide-container/slide-container.component';
import { YamlReadService } from '../yaml-read.service';

declare var Pageable: any;

@Component({
  selector: 'app-web-ar',
  templateUrl: './web-ar.component.html',
  styleUrls: ['./web-ar.component.scss']
})
export class WebArComponent implements OnInit {

  public projects: Project[] = [];
  @ViewChild(SlideContainerComponent) slideContainer!: SlideContainerComponent;

  constructor(private _yamlReadService: YamlReadService) { }

  ngOnInit(): void {
    this._yamlReadService.load().then((work) => {
      this.projects = work.projects.filter((x: Project) => { return x.type == 'ar' });
    });
  }

  goNext() {
    this.slideContainer.next();
  }


}
