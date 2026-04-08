import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { parse } from 'yamljs';
import { map } from 'rxjs/operators';
import { Project } from './project/project.component';

class Work {
  constructor(
    public projects: Project[]
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class YamlReadService {
  public work: Work = new Work([]);
  public isLoaded: boolean = false;

  constructor(private _http: HttpClient) {
  }

  getWork(): Promise<Work> {
    return new Promise((success, error) => {
      if (this.isLoaded) {
        success(this.work);
      } else {
        this.load().then((work) => {
          this.work = work;
          success(this.work);
        })
      }
    });
  }

  load(): Promise<any> {
    return new Promise((success) => {
      this.requestYML(`/assets/yml/work.yml`).subscribe((response) => {
        success(response);
      });

    })
  }

  requestYML(url: string) {
    return this._http.get(url, { observe: "body", responseType: "text" }).pipe(
      map(yamlString => parse(yamlString))
    );
  }

}
