import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as AWS from 'aws-sdk';

@Injectable()
export class AwsResourceRDSService {
    rdsFreeTierDetails: Object;
    freeTier: boolean;
    allDBs: Object[];

    constructor() {
        this.rdsFreeTierDetails = {
            dbHours: 750,
            allowedInstanceSizes: ['db.t2.micro'],
            allowedEngines: ['mysql'], //PostgreSQL, Oracle BYOL, SQL Server Express Edition
            dbStorage: 20,
            dbStorageType: 'gp2',
            dbSnapshotStorage: 20,
            expirationMonths: 12
        };
        this.freeTier = true; 
        this.allDBs = [];
    }

    getRDSDetails(rds: AWS.RDS): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            rds.describeDBInstances().promise().then(dbData => {
                console.log('DB data: ' + JSON.stringify(dbData));

                if (dbData.DBInstances.length > 0) {
                    let totalMem = 0; 
                    //Loop through all DBs 
                    for(let db of dbData.DBInstances) {
                        let i = {};

                        i['InstanceId'] = db['DBInstanceIdentifier'];
                        i['State'] = db['DBInstanceStatus'];
                        i['AvailabilityZone'] = db['AvailabilityZone'];
                        i['InstanceCreateTime'] = db['InstanceCreateTime'];
                        i['MultiAZ'] = db['MultiAZ'];
                        i['StorageType'] = db['StorageType'];
                        i['AllocatedStorage'] = db['AllocatedStorage'];
                        i['Engine'] = db['Engine'];
                        i['InstanceType'] = db['DBInstanceClass'];
                        i['FreeTier'] = true;

                        this.allDBs.push(i);

                        if(!this.rdsFreeTierDetails['allowedInstanceSizes'].includes(db['DBInstanceClass']) ||
                           !this.rdsFreeTierDetails['allowedEngines'].includes(db['Engine']) ||
                           this.rdsFreeTierDetails['dbStorageType'] !== db['StorageType']) {
                            this.freeTier = i['FreeTier'] = false; 
                        } 

                        totalMem += db['AllocatedStorage'];
                    }

                    if(totalMem > 20) {
                        this.freeTier = false;
                    }                    
                } 

                rds.describeDBSnapshots().promise().then(snapData => {
                    


                    resolve({ isFreeTierCompliant: this.freeTier, details: this.rdsFreeTierDetails, instances: this.allDBs });
                }).catch(err => {
                    console.log("describeDBSnapshots Error: " + err);
                    reject(new Error(err.message));
                });
            }).catch(err => {
                console.log('DB ERR: ' + err);
                reject(new Error(err.message));
            });
        });
    }
}


/* Function calls and properties needed
describeDBInstances()
"DBInstances":[
    {
        "DBInstanceClass":"db.t2.micro",
        "Engine":"mysql",
        "AllocatedStorage":5,
        "StorageType":"gp2",
        "MultiAZ":false,
        "InstanceCreateTime":"2017-06-07T19:05:47.437Z",
        "DBInstanceIdentifier":"test-mysql",
        "DBInstanceStatus":"available",
        "AvailabilityZone":"us-east-1a"
    }
]

describeDBSnapshots()
"DBSnapshots":[
    {
        "AllocatedStorage":5,
        "Status":"available",
        "DBSnapshotIdentifier":"rds:test-mysql-2017-06-07-19-05",
        "DBInstanceIdentifier":"test-mysql",
        "AvailabilityZone":"us-east-1a",
        "SnapshotType":"automated",
        "StorageType":"gp2"
    }
]
*/