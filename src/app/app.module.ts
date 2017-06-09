import { NgModule }                      from '@angular/core';
import { BrowserModule }                 from '@angular/platform-browser';
import { HttpModule }                    from '@angular/http';
import { BrowserAnimationsModule }       from '@angular/platform-browser/animations';
import { MdCardModule, MdToolbarModule } from '@angular/material';

import { AppComponent }          from './app.component';
import { AwsResourceComponent }  from './aws-resource.component';
import { AwsResourceService }    from './aws-resource.service';
import { AwsResourceEC2Service } from './aws-resource-ec2.service';
import { AwsResourceS3Service }  from './aws-resource-s3.service';
import { AwsResourceRDSService } from './aws-resource-rds.service';

@NgModule({
    imports: [ 
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,
        MdCardModule,
        MdToolbarModule
    ],
    declarations: [ 
        AppComponent,
        AwsResourceComponent
    ],
    providers: [ 
        AwsResourceService,
        AwsResourceEC2Service,
        AwsResourceS3Service,
        AwsResourceRDSService
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
