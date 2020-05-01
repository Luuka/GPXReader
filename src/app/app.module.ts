import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { EditorComponent } from './editor/editor.component';
import { EditorlistComponent } from './editorlist/editorlist.component';
import { EditormapComponent } from './editormap/editormap.component';
import { ModalComponent } from './modal/modal.component';
import { EdittrackModalComponent } from './edittrack-modal/edittrack-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditorComponent,
    EditorlistComponent,
    EditormapComponent,
    ModalComponent,
    EdittrackModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SimplebarAngularModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
