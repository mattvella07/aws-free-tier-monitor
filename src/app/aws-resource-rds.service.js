"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var AwsResourceRDSService = (function () {
    function AwsResourceRDSService() {
        this.rdsFreeTierDetails = {
            dbHours: 750,
            allowedInstanceSizes: ['db.t2.micro'],
            allowedEngines: ['mysql'],
            dbStorage: 20,
            dbStorageType: 'gp2',
            dbSnapshotStorage: 20,
            expirationMonths: 12
        };
        this.freeTier = true;
        this.allDBs = [];
    }
    AwsResourceRDSService.prototype.getRDSDetails = function (rds) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            rds.describeDBInstances().promise().then(function (dbData) {
                console.log('DB data: ' + JSON.stringify(dbData));
                if (dbData.DBInstances.length > 0) {
                    var totalMem = 0;
                    //Loop through all DBs 
                    for (var _i = 0, _a = dbData.DBInstances; _i < _a.length; _i++) {
                        var db = _a[_i];
                        var i = {};
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
                        _this.allDBs.push(i);
                        if (!_this.rdsFreeTierDetails['allowedInstanceSizes'].includes(db['DBInstanceClass']) ||
                            !_this.rdsFreeTierDetails['allowedEngines'].includes(db['Engine']) ||
                            _this.rdsFreeTierDetails['dbStorageType'] !== db['StorageType']) {
                            _this.freeTier = i['FreeTier'] = false;
                        }
                        totalMem += db['AllocatedStorage'];
                    }
                    if (totalMem > 20) {
                        _this.freeTier = false;
                    }
                }
                rds.describeDBSnapshots().promise().then(function (snapData) {
                    resolve({ isFreeTierCompliant: _this.freeTier, details: _this.rdsFreeTierDetails, instances: _this.allDBs });
                }).catch(function (err) {
                    console.log("describeDBSnapshots Error: " + err);
                    reject(new Error(err.message));
                });
            }).catch(function (err) {
                console.log('DB ERR: ' + err);
                reject(new Error(err.message));
            });
        });
    };
    return AwsResourceRDSService;
}());
AwsResourceRDSService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], AwsResourceRDSService);
exports.AwsResourceRDSService = AwsResourceRDSService;
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
//# sourceMappingURL=aws-resource-rds.service.js.map