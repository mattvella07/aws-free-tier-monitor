import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as AWS from 'aws-sdk';

@Injectable()
export class AwsResourceS3Service {
    constructor() { }

    getS3Details(s3:AWS.S3):Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            /*s3.listBuckets().promise().then(bucketData => {
                console.log(JSON.stringify(bucketData));
            }).catch(err => {
                console.log(err);
            });

            s3.listObjects().promise().then(bucketData => {
                console.log(JSON.stringify(bucketData));
            }).catch(err => {
                console.log(err);
            });*/
        });
    }
}