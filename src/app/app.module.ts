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
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { ListDesignComponent } from 'src/components/list-design/list-design.component';
import { DesignItemComponent } from 'src/components/design-item/design-item.component';
import { ConsoleComponent } from 'src/components/console/console.component';
import { SuggestionsComponent } from 'src/components/suggestions/suggestions.component';
import { SettingElementComponent } from 'src/components/setting-element/setting-element.component';

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
    ListDesignComponent,
    DesignItemComponent,
    ConsoleComponent,
    SuggestionsComponent,
    SettingElementComponent,
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
    MatTabsModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
