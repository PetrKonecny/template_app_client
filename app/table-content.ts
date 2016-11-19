import {Content} from './content'

export class TableContent extends Content {
    type: string = 'table_content'
    rows: Array<RowContent>
    
    addRows(count: number, length: number){
        if(!this.rows) this.rows = new Array()
        for(var i = 0; i<count; i++){
            var row = new RowContent()
            row.addCells(length)
            this.rows.push(row)
        }
    }
}

export class RowContent{
    cells: Array<CellContent>
    
    addCells (count: number){
        if (!this.cells) this.cells = new Array()
        for(var i = 0; i<count; i++){
            this.cells.push(new CellContent())
        }
    }
} 

export class CellContent{
    text: string
}