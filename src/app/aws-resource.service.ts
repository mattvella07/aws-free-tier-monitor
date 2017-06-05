import { Injectable }     from '@angular/core';
//import { Http, Response } from '@angular/http';
//import { Observable }     from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { config } from './config/aws-credentials';
import { AwsResourceEC2Service } from './aws-resource-ec2.service';
import { AwsResourceS3Service } from './aws-resource-s3.service';

import * as AWS from 'aws-sdk';

@Injectable()
export class AwsResourceService { 
    constructor(private ec2Service: AwsResourceEC2Service, private s3Service: AwsResourceS3Service) { 
        AWS.config.update(config);
    }

    freeTierDetails(resource: string): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            if(resource === 'ec2') {
                let ec2:AWS.EC2 = new AWS.EC2();
                this.ec2Service.getEC2Details(ec2).then(res => {
                    console.log(res);
                    resolve(res);
                }).catch(err => {
                    console.log(err);
                    reject(new Error(err.message));
                });
            } else if(resource === 's3') {
                let s3:AWS.S3 = new AWS.S3();
                this.s3Service.getS3Details(s3).then(res => {
                    console.log(res);
                    resolve(res);
                }).catch(err => {
                    console.log(err);
                    reject(new Error(err.message));
                });
            } else {
                reject(new Error('Not EC2 or S3'));
            } 
        });
    }
}