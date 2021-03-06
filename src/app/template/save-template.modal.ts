import { Component, Input} from '@angular/core';
import {TemplateListComponent} from './template-list.component';
import { TemplateService } from './template.service';
import { Template} from './template';
import { Observable }     from 'rxjs/Observable';
import { FormBuilder, Validators } from '@angular/forms';
import {MdDialogRef} from '@angular/material'
import { TemplateInstanceStore } from '../template-instance/template-instance.store';

@Component({
    selector: 'template-save-modal',
    template: `
        <form [formGroup]="saveForm" (ngSubmit)="onSaveButtonClicked()">
        		<h2 md-dialog-title>{{title}}</h2>
                <hr>
        		<md-dialog-content>
                    <div>
        			<md-input-container style="width: 100%;">
	                	<input mdInput [(ngModel)]="template.name" formControlName="name" type="text" placeholder={{placeholderName}}>
                        <md-hint *ngIf="saveForm.controls['name'].hasError('required') && saveForm.controls['name'].touched"  style="color:red;">Je třeba vyplnit název</md-hint>	                
                	</md-input-container>
                    </div>
                    <div>
                     <tag-input [(ngModel)]="template.tagged" [identifyBy]="'id'" [displayBy]="'tag_name'" formControlName="tags">
                      </tag-input>
                    </div>
                    <br>
                    <div>
	            	<md-checkbox [(ngModel)]="template.public" formControlName="public">Veřejné</md-checkbox>
                    </div>
                    <hr>
                    <div style="float: right;">
          			<button  md-raised-button color="primary" type = "submit" [disabled]="!saveForm.valid">Uložit</button>
          			<button  md-raised-button color="primary" md-dialog-close type = "button">Zrušit</button>
                    </div>
          		</md-dialog-content>
        </form>
    `,
    providers: []
})

//dialog for saving the template
export class SaveTemplateModal  {
	
	@Input()
    //template to be saved
	template: Template

    @Input()
    title: string = 'ULOŽIT ŠABLONU'

    @Input()
    placeholderName :string = 'jméno šablony'

	public saveForm = this.fb.group({
        name: ["", Validators.required],
        public: [false],
        tags: [""]
    });

	constructor(private fb: FormBuilder, private ref: MdDialogRef<SaveTemplateModal>){


    }

    //triggered on form submit
	onSaveButtonClicked(){
        if(this.saveForm.valid){
		    this.ref.close('save')
        }
	}
     
}