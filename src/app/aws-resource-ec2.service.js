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
//import { Http, Response } from '@angular/http';
//import { Observable }     from 'rxjs/Rx';
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var AwsResourceEC2Service = (function () {
    function AwsResourceEC2Service() {
        this.ec2FreeTierDetails = {
            computeHours: 750,
            allowedInstanceSizes: ['t2.micro'],
            allowedOS: ['Linux', 'RHEL', 'SLES', 'Windows'],
            expirationMonths: 12
        };
        this.freeTier = true;
        this.allIns = [];
    }
    AwsResourceEC2Service.prototype.getEC2Details = function (ec2) {
        var _this = this;
        return new Promise(function (resolve, reject) {
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
                                    this.freeTier = false;
                                    i['FreeTier'] = false;
                                }
                                this.allIns.push(i);
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
                                        for (var x = 0; x < this.allIns.length; x++) {
                                            if (this.allIns[x]['ImageId'] === img['ImageId'] && !this.allIns[x].hasOwnProperty('FreeTier')) {
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
                                            this.allIns[idx]['FreeTier'] = true;
                                        }
                                        else {
                                            this.freeTier = false;
                                            this.allIns[idx]['FreeTier'] = false;
                                        }
                                        this.allIns[idx]['OS'] = img['Name'].toString();
                                    }
                                    console.log(data.Reservations);
                                    resolve({ isFreeTierCompliant: this.freeTier, details: this.ec2FreeTierDetails, instances: this.allIns });
                                }
                            }.bind(this));
                        }
                        else {
                            resolve({ isFreeTierCompliant: this.freeTier, details: this.ec2FreeTierDetails, instances: this.allIns });
                        }
                    }
                    else {
                        reject(new Error('No running instances'));
                    }
                }
            }.bind(_this));
        });
    };
    return AwsResourceEC2Service;
}());
AwsResourceEC2Service = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], AwsResourceEC2Service);
exports.AwsResourceEC2Service = AwsResourceEC2Service;
//# sourceMappingURL=aws-resource-ec2.service.js.map