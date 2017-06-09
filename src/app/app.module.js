"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var animations_1 = require("@angular/platform-browser/animations");
var material_1 = require("@angular/material");
var app_component_1 = require("./app.component");
var aws_resource_component_1 = require("./aws-resource.component");
var aws_resource_service_1 = require("./aws-resource.service");
var aws_resource_ec2_service_1 = require("./aws-resource-ec2.service");
var aws_resource_s3_service_1 = require("./aws-resource-s3.service");
var aws_resource_rds_service_1 = require("./aws-resource-rds.service");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            animations_1.BrowserAnimationsModule,
            material_1.MdCardModule,
            material_1.MdToolbarModule
        ],
        declarations: [
            app_component_1.AppComponent,
            aws_resource_component_1.AwsResourceComponent
        ],
        providers: [
            aws_resource_service_1.AwsResourceService,
            aws_resource_ec2_service_1.AwsResourceEC2Service,
            aws_resource_s3_service_1.AwsResourceS3Service,
            aws_resource_rds_service_1.AwsResourceRDSService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map