import {Page} from '../page/page'
import {Template} from '../template/template';
import {Element} from '../element/element'
import {Guide} from '../guide/guide'
import {User} from '../user/user'

export class TemplateHelper {


	static filloutNewTemplate(template: Template){    
        if(template && template.pages && template.pages.length){
            return 
        } 
        template.pages = new Array<Page>()
        template.pages.push(new Page)      
    }

    static copyIds(template:Template,template2: Template){
        template.id = template2.id
        template.pages.forEach((page,index)=> {
            page.id = template2.pages[index].id
            page.elements.forEach((element,index2) =>{
                element.id = template2.pages[index].elements[index2].id
                if(template2.pages[index].elements[index2].content){
                    element.content.id = template2.pages[index].elements[index2].content.id
                }
            })
        })
        if(template.tagged){
            template.tagged.forEach((tag,index)=>{
                if(template2.tagged[index]){
                    tag.id = template2.tagged[index].id
                }
            })
        }
    }


    static deleteElementFromTemplate(element: Element, template: Template){
        template.pages.forEach((page) => {
            var index = page.elements.indexOf(element)
            if(index > -1){
                page.elements.splice(index,1)
            }
        })
    }
    
    static deleteRulerFromTemplate(ruler: Guide, template: Template){
        template.pages.forEach((page) => {
            var index = page.rulers.indexOf(ruler)
            if(index > -1){
                page.rulers.splice(index,1)
            }
        })
    }
    
    static getPageFromTemplateForElement(element: Element,template: Template){
        for (var page of template.pages){
            for (var elmnt of page.elements){
                if(elmnt === element) {
                    return page
                }
            }
        }
    }
    
    static deletePageFromTemplate(page: Page, template: Template){
        var index = template.pages.indexOf(page)
        if(index > -1){
            template.pages.splice(index,1)
        }
    }

 	static removeIdsFromTemplate(template: Template){
        delete template.id
        template.pages.forEach(page=>{
            delete page.id
            page.elements.forEach(element => delete element.id)
        })
    }

    static canDeleteTemplate(user: User, template: Template){
        return (user && user.id == template.user_id) || (user && user.admin)
    }

    static canEditTemplate(user: User, template: Template){
        return (user && user.id == template.user_id) || (user && user.admin)
    }

    static canCreateDocumentFromTemplate(user: User, template: Template){
        return true;
    }
}