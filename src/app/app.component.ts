import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `
        <aws-resource *ngFor="let resource of resources" [resourceName]="resource"></aws-resource>
    `,
})

export class AppComponent  { 
    resources: String[];

    constructor() {
        this.resources = ['ec2'];
    }
}
