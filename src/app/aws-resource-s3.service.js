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
var AwsResourceS3Service = (function () {
    function AwsResourceS3Service() {
    }
    AwsResourceS3Service.prototype.getS3Details = function (s3) {
        return new Promise(function (resolve, reject) {
            /*s3.listBuckets().promise().then(bucketData => {
                console.log(JSON.stringify(bucketData));
            }).catch(err => {
                console.log(err);
            });

            s3.listObjects().promise().then(bucketData => {
                console.log(JSON.stringify(bucketData));
            }).catch(err => {
                console.log(err);
            });*/
        });
    };
    return AwsResourceS3Service;
}());
AwsResourceS3Service = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], AwsResourceS3Service);
exports.AwsResourceS3Service = AwsResourceS3Service;
//# sourceMappingURL=aws-resource-s3.service.js.map