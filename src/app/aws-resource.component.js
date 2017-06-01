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
var aws_resource_service_1 = require("./aws-resource.service");
var AwsResourceComponent = (function () {
    function AwsResourceComponent(awsResourceService) {
        this.awsResourceService = awsResourceService;
        this.numInstances = 0;
        this.freeTierCompliantIcon = 'fa';
        this.arrowIcon = 'fa fa-chevron-right';
        this.showInstances = false;
    }
    AwsResourceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.instancesClassName = this.resourceName + 'Instances';
        this.awsResourceService.freeTierDetails(this.resourceName).then(function (res) {
            console.log('then: ' + JSON.stringify(res));
            _this.isFreeTierCompliant = (res['isFreeTierCompliant']) ? 'Within Free Tier' : 'NOT Within Free Tier';
            _this.freeTierCompliantIcon += (res['isFreeTierCompliant']) ? ' fa-check' : ' fa-times';
            _this.numInstances = res['instances'].length;
            _this.instances = res['instances'];
        }).catch(function (err) {
            console.log('OnInit: ' + err);
        });
    };
    AwsResourceComponent.prototype.onCardClick = function () {
        this.showInstances = !this.showInstances;
        if (this.arrowIcon.indexOf('fa-chevron-right') !== -1) {
            this.arrowIcon = this.arrowIcon.replace('fa-chevron-right', 'fa-chevron-down');
        }
        else {
            this.arrowIcon = this.arrowIcon.replace('fa-chevron-down', 'fa-chevron-right');
        }
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
        templateUrl: './aws-resource.component.html',
        styleUrls: ['./aws-resource.component.css']
    }),
    __metadata("design:paramtypes", [aws_resource_service_1.AwsResourceService])
], AwsResourceComponent);
exports.AwsResourceComponent = AwsResourceComponent;
//# sourceMappingURL=aws-resource.component.js.map