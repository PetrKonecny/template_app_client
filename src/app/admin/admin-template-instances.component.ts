import { Component, OnInit, Input} from '@angular/core';
import { TemplateInstanceService } from '../template-instance/template-instance.service';
import {TemplateInstance } from '../template-instance/template-instance'

@Component({
    selector: 'admin-template-instances',
    template: `
        <template-instance-table [templateInstances] = "templates" [loadingIndicator]="loading" (onDeleteClicked) = "onDeleteClicked($event)"></template-instance-table>
    `,
    providers: []
})

export class AdminTemplateInstancesComponent implements OnInit {
    
    errorMessage: string;
    templateInstances : TemplateInstance[];
    loading = true;

    constructor(
        private templateInstanceService: TemplateInstanceService
    ){}

    ngOnInit(){
        this.templateInstanceService.getTemplateInstances().subscribe(
        templates=>{
            this.templateInstances = templates
            this.loading = false
        },
        error =>{
            this.errorMessage = error
            this.loading = false
        })
    }
}