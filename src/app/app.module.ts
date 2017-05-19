import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { AwsResourceComponent }  from './aws-resource.component';

@NgModule({
    imports:      [ BrowserModule ],
    declarations: [ 
        AppComponent,
        AwsResourceComponent
    ],
    bootstrap:    [ AppComponent ]
})

export class AppModule { }
