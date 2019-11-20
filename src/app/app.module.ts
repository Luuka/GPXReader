import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimplebarAngularModule } from 'simplebar-angular';

import { HomeComponent } from './home/home.component';
import { EditorComponent } from './editor/editor.component';
import { EditorlistComponent } from './editorlist/editorlist.component';
import { EditormapComponent } from './editormap/editormap.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditorComponent,
    EditorlistComponent,
    EditormapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SimplebarAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
