import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
//import { Observable }     from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as AWS from 'aws-sdk';

@Injectable()
export class AwsResourceEC2Service {
    ec2FreeTierDetails: Object;
    freeTier: boolean;
    allIns: Object[];

    constructor() {
        this.ec2FreeTierDetails = {
            computeHours: 750,
            allowedInstanceSizes: ['t2.micro'],
            allowedOS: ['amzn-ami', 'rhel', 'suse-sles', ['windows_server', 'base']],
            expirationMonths: 12
        };
        this.freeTier = true;
        this.allIns = [];
    }

    getEC2Details(ec2: AWS.EC2): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            ec2.describeInstances().promise().then(data => {
                console.log("data: " + JSON.stringify(data));
                if (data.Reservations.length > 0) {
                    let images = [];

                    //Loop through all EC2 instances
                    for (let res of data.Reservations) {
                        for (let ins of res['Instances']) {
                            let i = {};

                            i['InstanceId'] = ins['InstanceId'];
                            i['ImageId'] = ins['ImageId'];
                            i['InstanceType'] = ins['InstanceType'];
                            i['State'] = ins['State']['Name'];
                            i['AvailabilityZone'] = ins['Placement']['AvailabilityZone'];

                            if (this.ec2FreeTierDetails['allowedInstanceSizes'].includes(ins['InstanceType'])) {
                                images.push(ins['ImageId']);
                            } else {
                                this.freeTier = false;
                                i['FreeTier'] = false;
                            }

                            this.allIns.push(i);
                        }
                    }

                    if (images.length > 0) {
                        //Set parameters for describeImages call, which is all images that are in the free tier 
                        //instance type 
                        let params = {
                            ImageIds: images
                        };

                        ec2.describeImages(params).promise().then(imgData => {
                            //Loop through all images 
                            for (let img of imgData.Images) {
                                //Match up this image to the index that should be used on the allIns variable 
                                let idx: number = -1;
                                for (let x = 0; x < this.allIns.length; x++) {
                                    if (this.allIns[x]['ImageId'] === img['ImageId'] && !this.allIns[x].hasOwnProperty('FreeTier')) {
                                        idx = x;
                                        break;
                                    }
                                }

                                //Check if Image is part of free tier 
                                let imgName = img['Name'].toString().toLowerCase();
                                this.allIns[idx]['FreeTier'] = false;

                                this.ec2FreeTierDetails['allowedOS'].map((os: any) => {
                                    //If os variable is a string then the imgName only needs to contain
                                    //that string, otherwise the os variable is an array and imgName
                                    //needs to contain all strings in the array 
                                    if (typeof os === 'string') {
                                        if (imgName.indexOf(os) !== -1) {
                                            this.allIns[idx]['FreeTier'] = true;
                                        }
                                    } else if (!this.allIns[idx]['FreeTier']) {
                                        this.allIns[idx]['FreeTier'] = true;

                                        for (let i = 0; i < os.length; i++) {
                                            if (imgName.indexOf(os[i]) === -1) {
                                                this.allIns[idx]['FreeTier'] = false;
                                            }
                                        }
                                    }
                                });

                                //If any of the instances are not part of free tier, then the overall freeTier 
                                //for EC2 should be false 
                                if (!this.allIns[idx]['FreeTier']) {
                                    this.freeTier = false;
                                }

                                //Add the image name to the allIns variable that is returned 
                                this.allIns[idx]['OS'] = img['Name'].toString();
                            }

                            console.log(data.Reservations);
                            resolve({ isFreeTierCompliant: this.freeTier, details: this.ec2FreeTierDetails, instances: this.allIns });
                        }).catch(error => {
                            console.log('describe images error: ' + error);
                            reject(new Error(error.message));
                        });
                    } else {
                        resolve({ isFreeTierCompliant: this.freeTier, details: this.ec2FreeTierDetails, instances: this.allIns });
                    }
                } else {
                    reject(new Error('No running instances'));
                }
            }).catch(err => {
                console.log('ERR: ' + err);
                reject(new Error(err.message));
            });
        });
    }
}
