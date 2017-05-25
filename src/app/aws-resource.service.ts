import { Injectable } from '@angular/core';
import { Http, Response }       from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { config } from './config/aws-credentials';

import * as AWS from 'aws-sdk';

@Injectable()
export class AwsResourceService { 
    constructor(private http: Http) { }

    freeTierDetails(resource: string): Object {
        let ec2FreeTierDetails = {
            computeHours: 750,
            allowedInstanceSizes: ['t2.micro'],
            allowedOS: ['Linux', 'RHEL', 'SLES', 'Windows'],
            expirationMonths: 12 
        };

        if(resource === 'ec2') {
            AWS.config.update(config);

            var ec2:AWS.EC2 = new AWS.EC2();

            ec2.describeInstances({}, function(err, data) {
                if(err) {
                    console.log('ERR: ' + err);
                } else {
                    console.log("data: " + JSON.stringify(data));
                }

            });
            
            return ec2FreeTierDetails;
        }

        return {};
    }
}