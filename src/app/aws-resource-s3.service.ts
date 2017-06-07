import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as AWS from 'aws-sdk';

@Injectable()
export class AwsResourceS3Service {

    constructor() { }

    getS3Details(s3:AWS.S3):Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            s3.listBuckets({}, function(err:any, bucketData:any) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(JSON.stringify(bucketData));
                }
            });
        });
    }
}