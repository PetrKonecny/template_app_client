import { Component, Input, ViewChild, ElementRef, AfterViewInit, HostListener} from '@angular/core';
import { Element} from './element';
import { Image } from '../image/image';
import { ImageContent } from '../content/image-content';
import { TextElement} from './text-element'
import { TableElement } from './table-element'
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'display-element',
    template: `
        <display-text-element *ngIf="element.type == 'text_element'" [element]="element"></display-text-element>
        <display-frame-element *ngIf="element.type == 'frame_element'" [element]="element"></display-frame-element>
        <display-image-element *ngIf="element.type == 'image_element'" [element]="element"></display-image-element>
        <display-table-element *ngIf="element.type == 'table_element'" [element]="element"></display-table-element>
    `,
})

export class DisplayElementComponent {

    @Input()
    element: Element;

    constructor( private elementStore: ElementStore){

    }

    @HostListener('mousedown',['$event'])
    onMousedown(){
        this.elementStore.changeElement(this.element)
    } 
    
}