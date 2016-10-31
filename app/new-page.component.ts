import { Component, Input, ViewChildren, QueryList} from '@angular/core';
import { Element} from './element';
import { TextElement } from './text-element';
import { ImageElement } from './image-element';
import { TableElement } from './table-element';
import { Page} from './page';
import { NewElementComponent } from './new-element.component';
import { TextContent } from './text-content'
import { ImageContent } from './image-content'
import { TemplateInstanceStore } from './template-instance.store'

@Component({
    selector: 'create-new-page',
    template: `
          <h3>New Page</h3>\n\
          <div class ="page">\n\
            <div class="grid">
                  <create-new-element *ngFor="let element of page.elements" [element] = "element" ></create-new-element>
            </div>
          </div>
          <button (click)="createNewTextElement()">Add text element</button>
          <button (click)="createNewImageElement()">Add image element</button>
          <button (click)="createNewTableElement()">Add table element</button>
          <button (click)="onDeleteClicked()">Delete page</button>
    `,
    styles:[`
        .grid {
            min-width: 100%;
            min-height: 100%;
        }
        .page {\n\
            position: relative;
            width: 210mm;
            height: 297mm;
        }
    `],
    directives: [NewElementComponent]
})

export class NewPageComponent  {

    @Input()
    page: Page = new Page();
    
    @ViewChildren(NewElementComponent)
    elementsComponents : QueryList<NewElementComponent>;
    
    constructor(private templateInstanceStore: TemplateInstanceStore) { }

    createNewTextElement(){
        if (this.page.elements == null) {
            this.page.elements = new Array<Element>();
        }
        var element = new TextElement();
        element.width = 100;
        element.height = 100;
        element.positionX = 0;
        element.positionY = 0;
        element.font_size = 20;
        element.content = new TextContent();
        this.page.elements.push(element);
    }
    
    createNewImageElement(){
        if (this.page.elements == null) {
            this.page.elements = new Array<Element>();
        }
        var element = new ImageElement();
        element.width = 100;
        element.height = 100;
        element.positionX = 0;
        element.positionY = 0;
        element.content = new ImageContent();
        this.page.elements.push(element);
    }
    
    createNewTableElement(){
        if (this.page.elements == null) {
            this.page.elements = new Array<Element>();
        }
        var element = new TableElement();
        element.width = 100;
        element.height = 100;
        element.positionX = 0;
        element.positionY = 0;
        element.table_width = 5;
        element.table_height = 5;
        element.row_height = 50
        element.content = new ImageContent();
        this.page.elements.push(element);
    }
        
    fillFromDOM(){
        this.elementsComponents.toArray().forEach((child) => child.fillFromDOM());
    }
    
    onDeleteClicked(){
        this.templateInstanceStore.deletePageFromTemplate(this.page);
    }

}