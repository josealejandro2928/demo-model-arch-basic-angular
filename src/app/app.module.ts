import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from '../components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ErrorComponent } from '../components/error/error.component';
import { CreateRaArchComponent } from 'src/components/create-ra-arch/create-ra-arch.component';
import { ToolbarComponent } from 'src/components/toolbar/toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModelerComponent } from '../components/modeler/modeler.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { DialogAddElementComponent } from 'src/dialogs/dialog-add-element/dialog-add-element.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogSaveRADesign } from 'src/dialogs/dialog-save-ra-design/dialog-save-ra-design.component';
import { CreateSaArchComponent } from 'src/components/create-sa-arch/create-sa-arch.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectRaDesign } from 'src/dialogs/select-ra-design/select-ra-design.component';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    CreateRaArchComponent,
    ToolbarComponent,
    ModelerComponent,
    DialogAddElementComponent,
    DialogSaveRADesign,
    CreateSaArchComponent,
    SelectRaDesign,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
