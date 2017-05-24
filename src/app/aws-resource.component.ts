import { Component, Input, OnInit } from '@angular/core';

import { AwsResourceService } from './aws-resource.service';

@Component({
    selector: 'aws-resource',
    templateUrl: './aws-resource.component.html'
})

export class AwsResourceComponent implements OnInit {
    @Input() resourceName: string;

    constructor(private awsResourceService: AwsResourceService) { }

    ngOnInit(): void {
        console.log(this.awsResourceService.freeTierDetails(this.resourceName));
    }
}