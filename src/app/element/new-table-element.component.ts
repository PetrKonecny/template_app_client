import { Component, Input, OnInit, HostListener} from '@angular/core'
import { TableElement, MergeCells, DeleteRow2, DeleteColumn2, AddColumnLeft2, AddRowBelow2, AddColumnRight2, AddRowAbove2} from './table-element'
import { ElementDimensions} from '../draggable.directive'
import { NewPageReference } from '../page/new-page.ref'
import { NewTableElementReference} from './new-table-element.ref'
import { Content } from '../content/content'
import { Store } from '@ngrx/store'
import { AppState } from '../app.state'
import { NewElementComponent } from '../element/new-element.component'

@Component({
    selector: 'create-new-table-element',
    template: `

        <!-- displays controll elements for changing editing state of table -->

        <div *ngIf="selected" style="position: absolute" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY - 40">
            
            <!-- controlls for moving the table -->

            <button md-raised-button  md-icon-button md-tooltip="posunout tabulku" [color]="element.clientState == 0? 'accent' : 'background'" (click)="element.clientState = 0"><md-icon>zoom_out_map</md-icon></button>
            
            <!-- controlls for filling out the table -->

            <button md-raised-button  md-icon-button md-tooltip="vyplnit tabulku" [color]="element.clientState == 1? 'accent' : 'background'"  (click)="element.clientState = 1">Ab</button>
            
            <!-- controlls for editing table structure -->

            <button md-raised-button  md-icon-button md-tooltip="změnit strukturu tabulky" [color]="element.clientState == 2? 'accent' : 'background'"  (click)="element.clientState = 2"><md-icon>vertical_align_center</md-icon></button>
            <span *ngIf="element.clientState ==2">
                <button md-icon-button [mdMenuTriggerFor]="resizeTableMenu"><md-icon>more_vert</md-icon></button>
                <md-menu #resizeTableMenu="mdMenu">
                  <button md-menu-item (click)="addColumnLeft()" [disabled]="!(element.selectedCells?.length === 1)">
                    <span>Přidat sloupec doprava</span>
                  </button>
                  <button md-menu-item (click)="addColumnRight()"  [disabled]="!(element.selectedCells?.length === 1)">
                    <span>Přidat sloupec doleva</span>
                  </button>
                  <button md-menu-item (click)="addRowBelow()"  [disabled]="!(element.selectedCells?.length === 1)">
                    <span>Přidat řádek pod</span>
                  </button>
                  <button md-menu-item (click)="addRowAbove()"  [disabled]="!(element.selectedCells?.length === 1)">
                    <span>Přidat řádek nad</span>
                  </button>
                  <button md-menu-item (click)="deleteColumn()"  [disabled]="!(element.selectedCells?.length === 1)">
                    <span>Smazat sloupec</span>
                  </button>
                  <button md-menu-item (click)="deleteRow()"  [disabled]="!(element.selectedCells?.length === 1)">
                    <span>Smazat řádek</span>
                  </button>                   
                </md-menu>
            </span>

            <!-- controlls for editing cell properties -->

            <button md-raised-button  md-icon-button md-tooltip="upravit vlastnosti polí" [color]="element.clientState == 3? 'accent' : 'background'"  (click)="element.clientState = 3"><md-icon>border_all</md-icon></button>
            <span *ngIf="element.clientState ==3">
                <button md-icon-button [mdMenuTriggerFor]="editCellsMenu"><md-icon>more_vert</md-icon></button>
                <md-menu #editCellsMenu="mdMenu">
                  <button md-menu-item (click)="mergeCells()" [disabled]="element.selectedCells?.length <= 1">
                    <span>Spojit vybrané buňky</span>
                  </button>
                  <button md-menu-item (click)="clearSelection()"  [disabled]="!(element.selectedCells?.length === 1)">
                    <span>Zrušit výběr</span>
                  </button>                       
                </md-menu>
            </span>      
        </div>

        <!-- table displayed when moving the table -->

        <table *ngIf="element.clientState == 0" class="table-element-move" [class.selected]="selected" draggable2 (move)="move($event)" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [myTr]="element" [y]="i" [style.height.px]="row.height" [content]="contents[element.content].rows[i]" class="locked"></tr>
        </table>

        <!-- table displayed when filling out the table -->

        <table *ngIf="element.clientState == 1" [class.selected]="selected" class= "inner" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [myTr]="element" [y]="i"  [content]="contents[element.content].rows[i]" [style.height.px]="row.height - 4"></tr>
        </table>

        <!-- table displayed when editing table structure or changing parameters of cells -->

        <table *ngIf="element.clientState > 1" [class.selected]="selected" class= "inner" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [myTr]="element" [y]="i"  [content]="contents[element.content].rows[i]" [style.height.px]="row.height"></tr>
        </table>
        `,
    styles:[`
        .inner {
        }
        .locked {
            pointer-events: none;
        }
        .button{
            z-index: 1000;
            position: absolute;
            margin-right: 10px;
        }
        table {
            position: absolute;
            table-layout: fixed;
        }
        table, td {
            border-collapse: collapse;
        }
        td {
            border: 1px solid black;
        }`
    ],
    providers: [NewTableElementReference]
})

       
export class NewTableElementComponent extends NewElementComponent{
    
    @Input()
    //element to be displayed
    element : TableElement
    //true if element selected false otherwise

    //output of draggable directive that moves the element
    
    //sets on initiation default element cient state
    ngOnInit(){
        super.ngOnInit();
        this.element.clientState = 0
    }
    
    //gets total table height
    getTableHeight(){
        let total = 0
        this.element.rows.forEach(row => total += row.height)
        return total
    }

    //gets total table width
    getTableWidth(){
        let total = 0
        this.element.rows.forEach(row => total += row.cells[0].width)
        return total
    }
    
    /**
    @param newPage - injects reference to the new page component
    @param - newTableElement - injects reference to this table
    @param - elementCommands - injects commands taht operate with the element
    @param - tableElementcommands - injects commands that operate with table element
    @param - element store - injects element store that holds selected elements
    **/
    constructor (
        public newPage: NewPageReference, 
        public newTableElement: NewTableElementReference, 
        public store: Store<AppState>
    ){
        super(store,newPage);
        this.newTableElement.component = this;
    }
    
    //calls command to add row above the selected cell
    addRowAbove(){
        if(this.element.selectedCells.length && this.element.selectedCells.length == 1){
            this.store.dispatch(new AddRowAbove2(this.element, this.contents[this.element.content],this.element.selectedCells[0]));
        }
    }

    //calls command to add row below the selected cell
    addRowBelow(){
        if(this.element.selectedCells.length && this.element.selectedCells.length == 1){
            this.store.dispatch(new AddRowBelow2(this.element, this.contents[this.element.content],this.element.selectedCells[0]));
        }
    }

    //calls command to add column to the right the selected cell
    addColumnRight(){
        if(this.element.selectedCells.length && this.element.selectedCells.length == 1){
            this.store.dispatch(new AddColumnRight2(this.element, this.contents[this.element.content],this.element.selectedCells[0]));
        }
    }

    //calls command to add column to the left of the selected ell 
    addColumnLeft(){
        debugger
        if(this.element.selectedCells.length && this.element.selectedCells.length == 1){
            this.store.dispatch(new AddColumnLeft2(this.element, this.contents[this.element.content],this.element.selectedCells[0]));
        }
    }

    //calls command to delete column that contains the selected cells
    deleteColumn(){
        if(this.element.selectedCells.length && this.element.selectedCells.length == 1){
            this.store.dispatch(new DeleteColumn2 (this.element, this.contents[this.element.content],this.element.selectedCells[0]));
        }       
    }


    //calls command to delete row that contains the selected cell 
    deleteRow(){
        if(this.element.selectedCells.length && this.element.selectedCells.length == 1){
            this.store.dispatch(new DeleteRow2(this.element, this.contents[this.element.content],this.element.selectedCells[0]));
        }
    }

    //merges selected cells
    mergeCells(){
        if(this.element.selectedCells.length && this.element.selectedCells.length > 1){
            this.store.dispatch(new MergeCells(this.element));
        }
    }

    //clears selected cells
    clearSelection(){
        if(this.element.selectedCells.length){
            TableElement.clearSelectedCells(this.element)
        }
    }
}