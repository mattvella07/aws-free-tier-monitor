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
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var aws_credentials_1 = require("./config/aws-credentials");
var AWS = require("aws-sdk");
var AwsResourceService = (function () {
    function AwsResourceService(http) {
        this.http = http;
        AWS.config.update(aws_credentials_1.config);
    }
    AwsResourceService.prototype.freeTierDetails = function (resource) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (resource === 'ec2') {
                console.log('ec2');
                _this.getEC2Details().then(function (res) {
                    console.log(res);
                    resolve(res);
                }).catch(function (err) {
                    console.log(err);
                    reject(new Error(err.message));
                });
            }
            else {
                reject(new Error('Not EC2'));
            }
        });
    };
    AwsResourceService.prototype.getEC2Details = function () {
        return new Promise(function (resolve, reject) {
            var ec2 = new AWS.EC2(), ec2FreeTierDetails = {
                computeHours: 750,
                allowedInstanceSizes: ['t2.micro'],
                allowedOS: ['Linux', 'RHEL', 'SLES', 'Windows'],
                expirationMonths: 12
            }, freeTier = true, allIns = [];
            ec2.describeInstances({}, function (err, data) {
                if (err) {
                    console.log('ERR: ' + err);
                    reject(new Error(err.message));
                }
                else {
                    console.log("data: " + JSON.stringify(data));
                    if (data.Reservations.length > 0) {
                        var images = [];
                        //Loop through all EC2 instances
                        for (var _i = 0, _a = data.Reservations; _i < _a.length; _i++) {
                            var res = _a[_i];
                            for (var _b = 0, _c = res['Instances']; _b < _c.length; _b++) {
                                var ins = _c[_b];
                                var i = {};
                                i['InstanceId'] = ins['InstanceId'];
                                i['ImageId'] = ins['ImageId'];
                                i['InstanceType'] = ins['InstanceType'];
                                i['State'] = ins['State']['Name'];
                                i['AvailabilityZone'] = ins['Placement']['AvailabilityZone'];
                                if (ins['InstanceType'] === 't2.micro') {
                                    images.push(ins['ImageId']);
                                }
                                else {
                                    freeTier = false;
                                    i['freeTier'] = false;
                                }
                                allIns.push(i);
                            }
                        }
                        if (images.length > 0) {
                            //Set parameters for describeImages call 
                            var params = {
                                ImageIds: images
                            };
                            ec2.describeImages(params, function (error, imgData) {
                                if (error) {
                                    console.log('describe images error: ' + error);
                                    reject(new Error(error.message));
                                }
                                else {
                                    for (var _i = 0, _a = imgData.Images; _i < _a.length; _i++) {
                                        var img = _a[_i];
                                        var idx = -1;
                                        for (var x = 0; x < allIns.length; x++) {
                                            if (allIns[x]['ImageId'] === img['ImageId'] && !allIns[x].hasOwnProperty('freeTier')) {
                                                idx = x;
                                                break;
                                            }
                                        }
                                        //Check if Image is part of free tier 
                                        var imgName = img['Name'].toString().toLowerCase();
                                        if (imgName.indexOf('amzn-ami') !== -1 ||
                                            imgName.indexOf('suse-sles') !== -1 ||
                                            (imgName.indexOf('windows_server') !== -1 && imgName.indexOf('base') !== -1) ||
                                            imgName.indexOf('rhel') !== -1) {
                                            allIns[idx]['freeTier'] = true;
                                        }
                                        else {
                                            freeTier = false;
                                            allIns[idx]['freeTier'] = false;
                                        }
                                    }
                                    console.log(data.Reservations);
                                    resolve({ isFreeTierCompliant: freeTier, details: ec2FreeTierDetails, instances: allIns });
                                }
                            });
                        }
                        else {
                            resolve({ isFreeTierCompliant: freeTier, details: ec2FreeTierDetails, instances: allIns });
                        }
                    }
                    else {
                        reject(new Error('No running instances'));
                    }
                }
            });
        });
    };
    return AwsResourceService;
}());
AwsResourceService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], AwsResourceService);
exports.AwsResourceService = AwsResourceService;
//# sourceMappingURL=aws-resource.service.js.map