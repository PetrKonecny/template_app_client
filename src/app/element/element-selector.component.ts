import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ImageService } from '../image/image.service';
import { Element, ElementCommands } from './element';
import { TextElement } from './text-element';
import {FontService} from '../font/font.service';
import {ClientState, TableElement, Cell} from './table-element'
import {Font} from '../font/font'
import {TextContent} from '../content/text-content'
import {PageCommands} from '../page/page'
import {TemplateInstanceStore} from '../template-instance/template-instance.store'
import { TemplateHelper} from '../template/template.helper'
import { TemplateStore } from '../template/template.store'
import { Template } from '../template/template'
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'element-select',
    template: ` 
                <div class="toolbar" style="display: flex;" *ngIf="element"> 
                    <button md-icon-button (click)="deleteElement()"><md-icon>delete</md-icon></button>
                    <div class="toolbarCategory">
                    <button md-icon-button [mdMenuTriggerFor]="menu" mdTooltip="pozice a šířka">XY</button>
                    <my-md-menu #menu="mdMenu">
                        <md-input-container>
                            <input mdInput [(ngModel)]="element.width"  (keyup)="0" placeholder="width">
                        </md-input-container>
                        <md-input-container>
                            <input  mdInput [(ngModel)]="element.height"  (keyup)="0"placeholder="height">
                        </md-input-container>
                        <md-input-container>
                            <input mdInput [(ngModel)]="element.positionX"   (keyup)="0" placeholder="X">
                        </md-input-container>
                        <md-input-container>
                            <input mdInput [(ngModel)]="element.positionY"   (keyup)="0" placeholder="Y">
                        </md-input-container>
                    </my-md-menu>
                    <button md-icon-button [mdMenuTriggerFor]="opacity" mdTooltip="průhlednost"><md-icon>opacity</md-icon></button>
                    <button md-icon-button (onMenuOpen)="checkArrangement()" [mdMenuTriggerFor]="arangement" mdTooltip="pořadí">123</button>
                    <md-menu #arangement="mdMenu">
                      <button md-menu-item (click)="onBringForward()" [disabled]="last">
                        <span>Posunout dopředu</span>
                      </button>
                      <button md-menu-item (click)="onPushBack()" [disabled]="first">
                        <span>Posunout dozadu</span>
                      </button>
                    </md-menu>
                    <my-md-menu #opacity="mdMenu">
                        <md-slider style="margin:10px; width: 200px;" [thumbLabel]="true" [value]="this.element.opacity ? this.element.opacity : 100" (input)="onSliderChange($event)"></md-slider>
                    </my-md-menu>                   
                    <button md-icon-button mdTooltip="Barva pozadí" [mdMenuTriggerFor]="backgroundColorMenu"><md-icon  [style.color]="element.background_color">fiber_manual_record</md-icon></button>
                    <my-md-menu #backgroundColorMenu>
                        <div md-menu-item [colorPicker]="element.background_color ? element.background_color : lastColor" style="width: 230px; height: 290px; padding: 0 !important;" [cpOutputFormat]="hex" (colorPickerChange)="changeBackgroundColor($event)" [cpToggle]="true" [cpDialogDisplay]="'inline'" [cpAlphaChannel]="'disabled'">
                        </div>
                        <div md-menu-item style="overflow: hidden;">
                            Zobrazit/skrýt pozadí <md-checkbox #bgCheckbox [checked]="element.background_color" (change)="toggleElementBackground(bgCheckbox.checked)" style="position: relative; z-index: 1000;"></md-checkbox>
                        </div>
                    </my-md-menu>
                    </div>
                    <div class="toolbarCategory" *ngIf="element.type == 'text_element' && element.content.editor">
                        <span class="toolbarCategoryHint">text</span>
                        <text-select></text-select>
                    </div>
                    <div class="toolbarCategory" *ngIf="element.type == 'table_element' && element.clientState == 3 && element.selectedCells?.length > 0">
                        <span class="toolbarCategoryHint">vybrané buňky</span> 
                        <cell-edit-toolbar></cell-edit-toolbar>
                    </div>                                              
                </div>
             `,
    providers: [],
    styles: [`
        .toolbarCategory{
            position: relative; margin-left: 20px; border-left: 1px solid #bdbdbd; padding-left: 12px;
        }
        .toolbarCategoryHint{
            position: absolute; z-index:1000; top: 42px; font-size: 10px; width: 100%; text-align: center; color: #bdbdbd;
        }


    `]
})

export class ElementSelectorComponent  {
        
    element: Element
    template: Template
    first: boolean
    last: boolean
    lastColor = Element.defaultBackgroundColor

    constructor(private elementStore: ElementStore,  private commands: ElementCommands, private pageCommands: PageCommands, private templateStore: TemplateStore){
        this.elementStore.element.subscribe(element=> this.element = element)
        this.templateStore.template.subscribe(template => this.template = template)
    }

    private getBgColor(){
        let color = this.element.background_color
        if(color){
            return color
        }else{
            return Element.defaultBackgroundColor
        }
    }

    deleteElement(){
        let page = TemplateHelper.getPageFromTemplateForElement(this.element, this.template)
        console.log(this.element,this.template, page)
        this.pageCommands.RemoveElement(page,this.element)
        this.elementStore.changeElement(null)
    }

    changeBackgroundColor(color: string){
        this.lastColor = color
        if(this.element.background_color){
            this.commands.changeBackgroundColor(this.element, this.lastColor)
        }
    }

    toggleElementBackground(value: boolean){
        if(this.element.background_color){
            this.commands.changeBackgroundColor(this.element, null)
        }else{
            this.commands.changeBackgroundColor(this.element, this.lastColor)
        }
    }

    onSliderChange(event){
        this.commands.startChangingOpacity(this.element,event.value)
    }

    onBringForward(){
        this.pageCommands.bringElementForward(TemplateHelper.getPageFromTemplateForElement(this.element, this.template),this.element)
        this.checkArrangement()
    }

    onPushBack(){
        this.pageCommands.pushElementBack(TemplateHelper.getPageFromTemplateForElement(this.element, this.template),this.element)
        this.checkArrangement()
    }

    isElementLast(){
        let page = TemplateHelper.getPageFromTemplateForElement(this.element, this.template)
        return page.elements.indexOf(this.element) == page.elements.length - 1
    }

    isElementFirst(){
        let page = TemplateHelper.getPageFromTemplateForElement(this.element, this.template)
        return page.elements.indexOf(this.element) == 0
    }

    checkArrangement(){
        this.first = this.isElementFirst()
        this.last = this.isElementLast()
    }

    onKey(){
        
    }
    
}