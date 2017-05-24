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
var AWS = require("aws-sdk");
var AwsResourceService = (function () {
    function AwsResourceService(http) {
        this.http = http;
    }
    AwsResourceService.prototype.freeTierDetails = function (resource) {
        var ec2FreeTierDetails = {
            computeHours: 750,
            allowedInstanceSizes: ['t2.micro'],
            allowedOS: ['Linux', 'RHEL', 'SLES', 'Windows'],
            expirationMonths: 12
        };
        if (resource === 'ec2') {
            AWS.config.update({
                region: 'us-east-1',
                accessKeyId: '',
                secretAccessKey: ''
            });
            var ec2 = new AWS.EC2();
            ec2.describeInstances({}, function (err, data) {
                if (err) {
                    console.log('ERR: ' + err);
                }
                else {
                    console.log("data: " + JSON.stringify(data));
                }
            });
            return ec2FreeTierDetails;
        }
        return {};
    };
    return AwsResourceService;
}());
AwsResourceService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], AwsResourceService);
exports.AwsResourceService = AwsResourceService;
//# sourceMappingURL=aws-resource.service.js.map