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
var aws_resource_service_1 = require("./aws-resource.service");
var AwsResourceComponent = (function () {
    function AwsResourceComponent(awsResourceService) {
        this.awsResourceService = awsResourceService;
    }
    AwsResourceComponent.prototype.ngOnInit = function () {
        //let res = this.awsResourceService.freeTierDetails(this.resourceName);
        //this.isFreeTierCompliant = res.isFreeTierCompliant;
        var _this = this;
        this.awsResourceService.freeTierDetails(this.resourceName).then(function (res) {
            console.log('then: ' + JSON.stringify(res));
            _this.isFreeTierCompliant = res.isFreeTierCompliant;
        });
    };
    return AwsResourceComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AwsResourceComponent.prototype, "resourceName", void 0);
AwsResourceComponent = __decorate([
    core_1.Component({
        selector: 'aws-resource',
        templateUrl: './aws-resource.component.html'
    }),
    __metadata("design:paramtypes", [aws_resource_service_1.AwsResourceService])
], AwsResourceComponent);
exports.AwsResourceComponent = AwsResourceComponent;
//# sourceMappingURL=aws-resource.component.js.map