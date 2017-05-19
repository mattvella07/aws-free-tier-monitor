import { Component, Input } from '@angular/core';

@Component({
    selector: 'aws-resource',
    templateUrl: './aws-resource.component.html'
})

export class AwsResourceComponent {
    @Input() resourceName: string;

    /*service: Object;

    constructor() {
        this.service = {
            'name': 'EC2'
        };
    }*/
}