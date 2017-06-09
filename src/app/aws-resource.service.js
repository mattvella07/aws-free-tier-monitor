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
var aws_credentials_1 = require("./config/aws-credentials");
var aws_resource_ec2_service_1 = require("./aws-resource-ec2.service");
var aws_resource_s3_service_1 = require("./aws-resource-s3.service");
var aws_resource_rds_service_1 = require("./aws-resource-rds.service");
var AWS = require("aws-sdk");
var AwsResourceService = (function () {
    function AwsResourceService(ec2Service, s3Service, rdsService) {
        this.ec2Service = ec2Service;
        this.s3Service = s3Service;
        this.rdsService = rdsService;
        AWS.config.update(aws_credentials_1.config);
    }
    AwsResourceService.prototype.freeTierDetails = function (resource) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (resource === 'ec2') {
                var ec2 = new AWS.EC2();
                _this.ec2Service.getEC2Details(ec2).then(function (res) {
                    resolve(res);
                }).catch(function (err) {
                    console.log("EC2 error: " + err);
                    reject(new Error(err.message));
                });
            }
            else if (resource === 's3') {
                var s3 = new AWS.S3();
                _this.s3Service.getS3Details(s3).then(function (res) {
                    resolve(res);
                }).catch(function (err) {
                    console.log("S3 error: " + err);
                    reject(new Error(err.message));
                });
            }
            else if (resource === 'rds') {
                var rds = new AWS.RDS();
                _this.rdsService.getRDSDetails(rds).then(function (res) {
                    resolve(res);
                }).catch(function (err) {
                    console.log("RDS error: " + err);
                    reject(new Error(err.message));
                });
            }
            else {
                reject(new Error('Not EC2 or S3'));
            }
        });
    };
    return AwsResourceService;
}());
AwsResourceService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [aws_resource_ec2_service_1.AwsResourceEC2Service, aws_resource_s3_service_1.AwsResourceS3Service, aws_resource_rds_service_1.AwsResourceRDSService])
], AwsResourceService);
exports.AwsResourceService = AwsResourceService;
//# sourceMappingURL=aws-resource.service.js.map