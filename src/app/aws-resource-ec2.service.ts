import { Injectable }     from '@angular/core';
//import { Http, Response } from '@angular/http';
//import { Observable }     from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as AWS from 'aws-sdk';

@Injectable()
export class AwsResourceEC2Service {
    ec2FreeTierDetails:Object; 
    freeTier:boolean;
    allIns:Object[];

    constructor() {
        this.ec2FreeTierDetails = {
            computeHours: 750,
            allowedInstanceSizes: ['t2.micro'],
            allowedOS: ['Linux', 'RHEL', 'SLES', 'Windows'],
            expirationMonths: 12 
        };
        this.freeTier = true;
        this.allIns = [];
    }

    getEC2Details(ec2:AWS.EC2): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            ec2.describeInstances({}, function(err, data) {
                if(err) {
                    console.log('ERR: ' + err);
                    reject(new Error(err.message));
                } else {
                    console.log("data: " + JSON.stringify(data));
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

                                if(ins['InstanceType'] === 't2.micro') {
                                    images.push(ins['ImageId']);
                                } else {
                                    this.freeTier = false;
                                    i['FreeTier'] = false;
                                }

                                this.allIns.push(i);
                            }
                        }

                        if(images.length > 0) {
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
                                        for(let x = 0; x < this.allIns.length; x++) {
                                            if(this.allIns[x]['ImageId'] === img['ImageId'] && !this.allIns[x].hasOwnProperty('FreeTier')) {
                                                idx = x;
                                                break;
                                            }
                                        }

                                        //Check if Image is part of free tier 
                                        let imgName = img['Name'].toString().toLowerCase();
                                        if(imgName.indexOf('amzn-ami') !== -1 ||
                                           imgName.indexOf('suse-sles') !== -1 ||
                                           (imgName.indexOf('windows_server') !== -1 && imgName.indexOf('base') !== -1) ||
                                           imgName.indexOf('rhel') !== -1) {
                                            this.allIns[idx]['FreeTier'] = true;
                                        } else {
                                            this.freeTier = false;
                                            this.allIns[idx]['FreeTier'] = false;
                                        }

                                        this.allIns[idx]['OS'] = img['Name'].toString();
                                    }

                                    console.log(data.Reservations);
                                    resolve( { isFreeTierCompliant: this.freeTier, details: this.ec2FreeTierDetails, instances: this.allIns } );
                                }
                            }.bind(this));
                        } else {
                            resolve( { isFreeTierCompliant: this.freeTier, details: this.ec2FreeTierDetails, instances: this.allIns } );
                        }
                    } else {
                        reject(new Error('No running instances'));
                    }
                }
            }.bind(this));
        });
    }
}
