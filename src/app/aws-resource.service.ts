import { Injectable } from '@angular/core';
import { Http, Response }       from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { config } from './config/aws-credentials';

import * as AWS from 'aws-sdk';

@Injectable()
export class AwsResourceService { 
    constructor(private http: Http) { 
        AWS.config.update(config);
    }

    freeTierDetails(resource: string): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            if(resource === 'ec2') {
                console.log('ec2');
                this.getEC2Details().then(res => {
                    console.log(res);
                    resolve(res);
                }).catch(err => {
                    console.log(err);
                    reject(new Error(err.message));
                });
            } else {
                reject(new Error('Not EC2'));
            } 
        });
    }

    getEC2Details(): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            let ec2:AWS.EC2 = new AWS.EC2(), 
            ec2FreeTierDetails:Object = {
                computeHours: 750,
                allowedInstanceSizes: ['t2.micro'],
                allowedOS: ['Linux', 'RHEL', 'SLES', 'Windows'],
                expirationMonths: 12 
            },
            freeTier:boolean = false;

            ec2.describeInstances({}, function(err, data) {
                if(err) {
                    console.log('ERR: ' + err);
                    reject(new Error(err.message));
                } else {
                    //console.log("data: " + JSON.stringify(data));

                    //Check the following:
                    //State.Name === 'running'
                    //InstanceType === 't2.micro'
                    //ImageId
                    
                    if(data.Reservations[0].Instances[0].State.Name === 'running' && 
                    data.Reservations[0].Instances[0].InstanceType === 't2.micro') {
                        let params = {
                            'ImageIds': [data.Reservations[0].Instances[0].ImageId]
                        };
                        ec2.describeImages(params, function(error, imgData) {
                            if(error) {
                                console.log('describe images error: ' + error);
                                reject(new Error(error.message));
                            } else {
                                //console.log('image: ' + JSON.stringify(imgData));
                                console.log(imgData.Images[0].Description);
                                if(imgData.Images[0].Description.toString().toLowerCase().indexOf('amazon linux') !== -1) {
                                    freeTier = true; 
                                }

                                resolve( { isFreeTierCompliant: freeTier, details: ec2FreeTierDetails } );
                            }
                        });
                    } else {
                        //resolve( { isFreeTierCompliant: freeTier, details: ec2FreeTierDetails } );
                        reject(new Error('No running instances'));
                    }
                }
            });
        });
    }
}