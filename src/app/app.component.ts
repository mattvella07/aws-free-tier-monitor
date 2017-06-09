import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
})

export class AppComponent  { 
    resources: String[];

    constructor() {
        this.resources = ['ec2', 's3', 'rds'];
    }
}
