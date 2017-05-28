import { Component, Input, OnInit } from '@angular/core';

import { AwsResourceService } from './aws-resource.service';

@Component({
    selector: 'aws-resource',
    templateUrl: './aws-resource.component.html'
})

export class AwsResourceComponent implements OnInit {
    @Input() resourceName: string;
    isFreeTierCompliant: boolean;

    constructor(private awsResourceService: AwsResourceService) { }

    ngOnInit(): void {
        //let res = this.awsResourceService.freeTierDetails(this.resourceName);
        //this.isFreeTierCompliant = res.isFreeTierCompliant;

        this.awsResourceService.freeTierDetails(this.resourceName).then(res => {
            console.log('then: ' + JSON.stringify(res));
            this.isFreeTierCompliant = res.isFreeTierCompliant;
        });
    }
}