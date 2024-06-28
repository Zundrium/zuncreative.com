import { Component, OnInit, ViewChild } from '@angular/core';
import { PageableService } from '../pageable.service';
import { Project } from '../project/project.component';
import { SlideContainerComponent } from '../slide-container/slide-container.component';
import { YamlReadService } from '../yaml-read.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

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
