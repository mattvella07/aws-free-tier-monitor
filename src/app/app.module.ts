import { NgModule }                from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { HttpModule }              from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdCardModule }            from '@angular/material';

import { AppComponent }          from './app.component';
import { AwsResourceComponent }  from './aws-resource.component';
import { AwsResourceService }    from './aws-resource.service';

@NgModule({
    imports:      [ 
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,
        MdCardModule
    ],
    declarations: [ 
        AppComponent,
        AwsResourceComponent
    ],
    providers: [ AwsResourceService ],
    bootstrap:    [ AppComponent ]
})

export class AppModule { }
