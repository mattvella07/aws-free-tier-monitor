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
            }, freeTier = false;
            ec2.describeInstances({}, function (err, data) {
                if (err) {
                    console.log('ERR: ' + err);
                    reject(new Error(err.message));
                }
                else {
                    //console.log("data: " + JSON.stringify(data));
                    //Check the following:
                    //State.Name === 'running'
                    //InstanceType === 't2.micro'
                    //ImageId
                    if (data.Reservations[0].Instances[0].State.Name === 'running' &&
                        data.Reservations[0].Instances[0].InstanceType === 't2.micro') {
                        var params = {
                            'ImageIds': [data.Reservations[0].Instances[0].ImageId]
                        };
                        ec2.describeImages(params, function (error, imgData) {
                            if (error) {
                                console.log('describe images error: ' + error);
                                reject(new Error(error.message));
                            }
                            else {
                                //console.log('image: ' + JSON.stringify(imgData));
                                console.log(imgData.Images[0].Description);
                                if (imgData.Images[0].Description.toString().toLowerCase().indexOf('amazon linux') !== -1) {
                                    freeTier = true;
                                }
                                resolve({ isFreeTierCompliant: freeTier, details: ec2FreeTierDetails });
                            }
                        });
                    }
                    else {
                        resolve({ isFreeTierCompliant: freeTier, details: ec2FreeTierDetails });
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