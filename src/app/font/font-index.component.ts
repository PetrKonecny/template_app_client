import { Component, OnInit} from '@angular/core';
import { FontListComponent} from './font-list.component';
import { FontService } from './font.service';
import { Font} from './font';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';
import {AppConfig} from '../app.config'



@Component({
    selector: 'font-index',
    template: `
        <input type="file" 
               ngFileSelect [options]="options"
               (onUpload)="handleUpload($event)"
        >
        <h2>My Fonts</h2>
        <font-list [fonts] = fonts></font-list>
    `,
    styles: [],
    providers: [FontService]
})

export class FontIndexComponent implements OnInit  {
    
    errorMessage: string;
    fonts : Font[];

    constructor(
        private fontService: FontService, private appConfig: AppConfig 
    ){ }
    
    
    ngOnInit(){
        this.getFonts();
    }
    
    getFonts(){
        this.fontService.getFonts().subscribe(
                               fonts => this.fonts = fonts,
                               error =>  this.errorMessage = <any>error
        );
    }
    
    uploadFile: any;
    options: Object = {
        url: this.appConfig.getConfig('api-url')+'/font'
    };

    handleUpload(data): void {
      console.log(data);
      if (data && data.done) {
          this.getFonts();
      }
    }
}