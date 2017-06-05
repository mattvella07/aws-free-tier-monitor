import { NgModule }                      from '@angular/core';
import { BrowserModule }                 from '@angular/platform-browser';
import { HttpModule }                    from '@angular/http';
import { BrowserAnimationsModule }       from '@angular/platform-browser/animations';
import { MdCardModule, MdToolbarModule } from '@angular/material';

import { AppComponent }          from './app.component';
import { AwsResourceComponent }  from './aws-resource.component';
import { AwsResourceService }    from './aws-resource.service';
import { AwsResourceEC2Service } from './aws-resource-ec2.service';

@NgModule({
    imports:      [ 
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
    providers: [ AwsResourceService, AwsResourceEC2Service ],
    bootstrap:    [ AppComponent ]
})

export class AppModule { }
