import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Album } from '../album/album';
import { User } from '../user/user'
import { SaveAlbumModal } from '../album/save-album.modal'
import { MdDialog } from '@angular/material'
import { MdSnackBar } from '@angular/material';
import { AlbumHttpService } from '../album/album-http.service'

@Component({
    selector: 'album-list',
    template: `
            <div class="shutter ">
                <h3 *ngIf="albums && albums.length == 0" class="nothing-found">Žádná alba k zobrazení</h3>
            </div>
            <div class="list-wrapper">                         
                <md-nav-list>
                    <md-list-item [routerLink] = "['/albums', album.id]" *ngFor="let album of albums">
                        <span md-line>{{ album.name }}</span>
                        <md-chip-list md-line><md-chip *ngFor="let tag of album.tagged">{{tag.tag_name}}</md-chip></md-chip-list>
                        <album-menu *ngIf="user?.id == album?.user_id" [album]="album" (afterAlbumEdited)="onEditAlbum($event)" (afterAlbumDeleted)="onDeleteAlbum($event)"></album-menu>
                    </md-list-item>
                </md-nav-list> 
            </div>
            `,
    styles: [`                         
            `]
})
//displays grid of albums with different color depending on their visibility
export class AlbumListComponent {
     
    @Input()
    //array of albums to display
    albums : Album[] 

    constructor(private dialog: MdDialog, private albumService: AlbumHttpService, private snackBar: MdSnackBar ){}

    @Input()
    //currently logged in user
    user: User


    @Output() 
    //triggered on album clicked
    onAlbumClicked = new EventEmitter<Album>();

    @Output() 
    //triggered on album clicked
    onAddAlbumClicked = new EventEmitter<null>();

    @Output() 
    //triggered on edit clicked
    onEditClicked = new EventEmitter<Album>();

    @Output() 
    //trigered on delete clicked
    onDeleteClicked = new EventEmitter<Album>();

    //makes album menu not click the album
    onClick(event) {
       event.stopPropagation();
    }
       
   //triggered on album clicked
    onSelect(album: Album) {
        this.onAlbumClicked.emit(album);
    }    

    //trigered on edit clicked
    onEditAlbum(album: Album){
        this.onEditClicked.emit(album)
    }

    //trigered on delete clicked
    onDeleteAlbum(album: Album){
        this.onDeleteClicked.emit(album)
    }
}