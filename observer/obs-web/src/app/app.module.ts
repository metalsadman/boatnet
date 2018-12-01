import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
  MatCardModule,
  MatDialogModule,
  MatListModule,
  MatOptionModule,
  MatSelectModule,
  MatInputModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatMenuModule,
  MatIconModule,
  MatSlideToggleModule,
  MatAutocompleteModule,
  MatButtonToggleModule,
  MatTableModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule
} from '@angular/material';

import { RouterModule, Routes } from '@angular/router';
import { identifierModuleUrl } from '@angular/compiler';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import {CardModule} from 'primeng/card';

import { MenuComponent } from './menu/menu.component';
import { VesselPermitsComponent } from './vessel-permits/vessel-permits.component';
import { TripsComponent } from './trips/trips.component';
import { OTSManagementComponent } from './ots-management/ots-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { VesselsComponent } from './vessels/vessels.component';
import { PermitsComponent } from './permits/permits.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { VesselDetailComponent } from './vessel-detail/vessel-detail.component';
import { PermitDetailComponent } from './permit-detail/permit-detail.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';

const appRoutes: Routes = [
  { path: 'ots-management',   component: OTSManagementComponent },
  { path: 'manage-users',     component: UserManagementComponent },
  { path: 'user',             component: UserComponent },
  { path: 'trips',            component: TripsComponent },
  { path: 'trip',             component: TripDetailComponent },
  { path: 'message-detail',   component: MessageDetailComponent },
  { path: 'user-preferences', component: UserPreferencesComponent },
  { path: 'manage-vessels',   component: VesselsComponent },
  { path: 'vessel-detail',    component: VesselDetailComponent },
  { path: 'manage-permits',   component: PermitsComponent },
  { path: 'permit-detail',    component: PermitDetailComponent },
  // { path: 'vessel-permits',component: VesselPermitsComponent },
  { path: '',
    redirectTo: 'trips',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    VesselPermitsComponent,
    TripsComponent,
    OTSManagementComponent,
    UserManagementComponent,
    UserPreferencesComponent,
    VesselsComponent,
    PermitsComponent,
    TripDetailComponent,
    MessagesComponent,
    FooterComponent,
    HeaderComponent,
    UserComponent,
    VesselDetailComponent,
    PermitDetailComponent,
    MessageDetailComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatTableModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ToggleButtonModule,
    SelectButtonModule,
    DropdownModule,
    CalendarModule,
    CardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
