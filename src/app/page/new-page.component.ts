import { Component, Input, HostListener, OnInit,KeyValueDiffers, KeyValueDiffer} from '@angular/core';
import { Page} from './page';
import { PageService} from './page.service'
import { Guide } from '../guide/guide'
import {PageSelector} from '../page/page-selector'
import {NewPageRemote} from './new-page.remote'

@Component({
    selector: 'create-new-page',
    template: `
          <h3>New Page</h3>
          <div class ="page" (click)="onPageClicked()">
            <create-new-element *ngFor="let element of page.elements" [element] = "element" ></create-new-element>
            <display-guide *ngFor="let guide of guides" [guide] = "guide" ></display-guide>
            <display-ruler *ngFor="let guide of page.rulers" [guide] = "guide" ></display-ruler>
          </div>        
    `,
    styles:[`
        .grid {
            min-width: 100%;
            min-height: 100%;
        }
        .page {
            position: relative;
            width: 210mm;
            height: 297mm;
        }
    `],
    providers: [NewPageRemote]
})

export class NewPageComponent implements OnInit {
    
    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        this.newPageRemote.onMouseDown()
    }
    
    @HostListener('mouseup', ['$event'])
    onMouseup(event) {
        this.guides = new Array
        this.newPageRemote.onMouseUp()
    }

    guides: Array<Guide>
        differ: KeyValueDiffer;

    @Input()
    page: Page  
    
    ngDoCheck(){
        var changes = this.differ.diff(this.page);
        if(changes) {
            changes.forEachAddedItem(item => {
                console.log(item.key,item.currentValue,item.previousValue,item.currentValue === item.previousValue)
            })
            changes.forEachChangedItem(item => {
                console.log(item.key,item.currentValue,item.previousValue,item.currentValue === item.previousValue)                
            })
        }
        
    }

    constructor(private newPageRemote: NewPageRemote, private pageSelector: PageSelector,         private differs: KeyValueDiffers) {
        this.newPageRemote.component = this
        this.guides = new Array
                this.differ = differs.find({}).create(null);

    }
    
    ngOnInit(){
        this.page.rulers = new Array
        var ruler = new Guide
        ruler.positionX = 20
        this.page.rulers.push(ruler)
        var ruler2 = new Guide
        ruler2.positionY = 20
        this.page.rulers.push(ruler2)
    }
    
    onPageClicked(){
        this.pageSelector.selectPage(this.page)
    }

}