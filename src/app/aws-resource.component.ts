import { Component, Input, OnInit } from '@angular/core';

import { AwsResourceService } from './aws-resource.service';

@Component({
    selector: 'aws-resource',
    templateUrl: './aws-resource.component.html',
    styleUrls: [ './aws-resource.component.css' ]
})

export class AwsResourceComponent implements OnInit {
    @Input() resourceName: string;
    isFreeTierCompliant: string;
    freeTierCompliantIcon: string; 
    numInstances: number;
    instances: Object[];

    constructor(private awsResourceService: AwsResourceService) {
        this.numInstances = 0; 
        this.freeTierCompliantIcon = 'fa';
     }

    ngOnInit(): void {
        //let res = this.awsResourceService.freeTierDetails(this.resourceName);
        //this.isFreeTierCompliant = res.isFreeTierCompliant;

        this.awsResourceService.freeTierDetails(this.resourceName).then(res => {
            console.log('then: ' + JSON.stringify(res));
            this.isFreeTierCompliant = (res['isFreeTierCompliant']) ? 'Within Free Tier' : 'NOT Within Free Tier';
            this.freeTierCompliantIcon += (res['isFreeTierCompliant']) ? ' fa-check' : ' fa-times';
            this.numInstances = res['instances'].length;
            this.instances = res['instances'];
        }).catch(err => {
            console.log('OnInit: ' + err);
        });
    }
}