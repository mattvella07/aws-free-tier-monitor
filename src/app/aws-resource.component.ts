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
    arrowIcon: string;
    freeTierCompliantIcon: string; 
    numInstances: number;
    instances: Object[];
    instancesClassName: string; 
    showInstances: boolean;

    constructor(private awsResourceService: AwsResourceService) {
        this.numInstances = 0; 
        this.freeTierCompliantIcon = 'fa';
        this.arrowIcon = 'fa fa-chevron-right';
        this.showInstances = false;
     }

    ngOnInit(): void {
        this.instancesClassName = this.resourceName + 'Instances';

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

    onCardClick(): void {
        this.showInstances = !this.showInstances;
        if(this.arrowIcon.indexOf('fa-chevron-right') !== -1) {
            this.arrowIcon = this.arrowIcon.replace('fa-chevron-right', 'fa-chevron-down');
        } else {
            this.arrowIcon = this.arrowIcon.replace('fa-chevron-down', 'fa-chevron-right');
        }
    }
}