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
            freeTier:boolean = true,
            allIns:Object[] = [];

            ec2.describeInstances({}, function(err, data) {
                if(err) {
                    console.log('ERR: ' + err);
                    reject(new Error(err.message));
                } else {
                    //console.log("data: " + JSON.stringify(data));
                    if(data.Reservations.length > 0) {
                        let images = [];

                        //Loop through all EC2 instances
                        for(let res of data.Reservations) {
                            for(let ins of res['Instances']) {
                                let i = {};

                                i['InstanceId'] = ins['InstanceId'];
                                i['ImageId'] = ins['ImageId'];
                                i['InstanceType'] = ins['InstanceType'];
                                i['State'] = ins['State']['Name'];
                                i['AvailabilityZone'] = ins['Placement']['AvailabilityZone'];

                                if(ins['State']['Name'] === 'running' && 
                                   ins['InstanceType'] === 't2.micro') {
                                    images.push(ins['ImageId']);
                                } else {
                                    freeTier = false;
                                    i['freeTier'] = false;
                                }

                                allIns.push(i);
                            }
                        }

                        //Set parameters for describeImages call 
                        let params = {
                            ImageIds: images
                        };

                        ec2.describeImages(params, function(error, imgData) {
                            if(error) {
                                console.log('describe images error: ' + error);
                                reject(new Error(error.message));
                            } else {
                                for(let img of imgData.Images) {
                                    let idx:number = -1;
                                    for(let x = 0; x < allIns.length; x++) {
                                        if(allIns[x]['ImageId'] === img['ImageId'] && !allIns[x].hasOwnProperty('freeTier')) {
                                            idx = x;
                                            break;
                                        }
                                    }

                                    // !!!!Need to add RHEL and Windows!!!!
                                    if(img['Description'].toString().toLowerCase().indexOf('amazon linux') !== -1 ||
                                       img['Description'].toString().toLowerCase().indexOf('suse linux enterprise server') !== -1) {
                                        allIns[idx]['freeTier'] = true;
                                        
                                    } else {
                                        freeTier = false;
                                        allIns[idx]['freeTier'] = false;
                                    }
                                }

                                console.log(data.Reservations);
                                resolve( { isFreeTierCompliant: freeTier, details: ec2FreeTierDetails, instances: allIns } );
                            }
                        });
                    } else {
                        reject(new Error('No running instances'));
                    }
                }
            });
        });
    }
}