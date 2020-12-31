import { SelectHostComponent } from './widgets/connection-status-widget/modal-cs-setup/select-host/select-host.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicModule } from 'ng-dynamic-component';
import { ComponentsRoutingModule } from './components-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GridsterModule } from 'angular-gridster2';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LabService } from '../services/lab/lab.service';
import { DashboardService } from '../services/dashboard/dashboard.service';
import { LayoutWidgetComponent } from './widgets/layout-widget/layout-widget.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SlideshowModule } from 'ng-simple-slideshow';
import { LayoutComponent } from './layout/layout.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { TatWidgetComponent } from './widgets/tat-based-widget/tat-widget/tat-widget-component/tat-widget.component';
import { LstWidgetComponent } from './widgets/tat-based-widget/lst-widget/lst-widget.component';
import { WidgetConfigurationComponent } from './widgets/tat-based-widget/modals/widget-configuration/widget-configuration.component';
import { TatBrowseTestComponent } from './widgets/tat-based-widget/modals/tat-browse-test/tat-browse-test.component';
import { RadialProgressBarComponent } from './widgets/tat-based-widget/tat-widget/radial-progress-bar/radial-progress-bar.component';
import { LabLayoutComponent } from './widgets/tat-based-widget/modals/widget-configuration/lab-layout/lab-layout.component';
import { SecondsToMinutesPipe } from './widgets/tat-based-widget/lst-widget/seconds-to-minutes.pipe';
import { ConnectionStatusWidgetComponent } from './widgets/connection-status-widget/connection-status-widget.component';
import { ConnectionStatusHostComponent } from './widgets/connection-status-widget/connection-status-host/connection-status-host.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NotificationService } from '../services/notification.service';
import { LottieAnimationViewModule } from 'ng-lottie';
import { ModalCsSetupComponent } from './widgets/connection-status-widget/modal-cs-setup/modal-cs-setup.component';
import { ModalChangeWidgetTypeComponent } from './modals/modal-change-widget-type/modal-change-widget-type.component';
import { DashboardManagementComponent } from './dashboard-management/dashboard-management.component';
import { ModalAddDashboardComponent } from './modals/modal-add-dashboard/modal-add-dashboard.component';
import { ModalResetDashboardComponent } from './modals/modal-reset-dashboard/modal-reset-dashboard.component';
import { DashboardNotFoundComponent } from './error-pages/dashboard-not-found/dashboard-not-found.component';
import { FilterTestPipe, ArrayTestSortPipe } from './widgets/tat-based-widget/modals/tat-browse-test/filter-test.pipe';
import { FilterDashboardPipe } from './dashboard-management/filter-dashboard.pipe';
import { LoginComponent } from './login/login.component';
import { SampleWorkloadWidgetComponent } from './widgets/sample-workload-widget/sample-workload-widget.component';
import { ModalSwSetupComponent } from './widgets/sample-workload-widget/modal-sw-setup/modal-sw-setup.component';
import { SelectEventComponent } from './widgets/tat-based-widget/modals/widget-configuration/select-event/select-event.component';
import { ModalAboutComponent } from './modals/modal-about/modal-about.component';
import { ModalTemplateDashboardComponent } from './modals/modal-template-dashboard/modal-template-dashboard.component';
import { SelectPriorityComponent } from './widgets/tat-based-widget/modals/widget-configuration/select-priority/select-priority.component';
import { SelectDemographicComponent } from './widgets/tat-based-widget/modals/widget-configuration/select-demographic/select-demographic.component';
import { LicenseComponent } from './license/license.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    GridsterModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatExpansionModule,
    MatChipsModule,
    MatTabsModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatSliderModule,
    MatTableModule,
    MatSortModule,
    SlideshowModule,
    MatCheckboxModule,
    MatRadioModule,
    MatBadgeModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatTooltipModule,
    DynamicModule.withComponents([]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    LottieAnimationViewModule.forRoot()
  ],
  declarations: [
    DashboardComponent,
    TatWidgetComponent,
    ModalChangeWidgetTypeComponent,
    ModalCsSetupComponent,
    ModalAddDashboardComponent,
    ModalResetDashboardComponent,
    ModalAboutComponent,
    ModalSwSetupComponent,
    ModalTemplateDashboardComponent,
    LayoutComponent,
    LayoutWidgetComponent,
    LstWidgetComponent,
    ConnectionStatusHostComponent,
    ConnectionStatusWidgetComponent,
    SampleWorkloadWidgetComponent,
    WidgetConfigurationComponent,
    TatBrowseTestComponent,
    RadialProgressBarComponent,
    SplashScreenComponent,
    LabLayoutComponent,
    SelectEventComponent,
    DashboardManagementComponent,
    SecondsToMinutesPipe,
    FilterTestPipe,
    ArrayTestSortPipe,
    FilterDashboardPipe,
    DashboardNotFoundComponent,
    LoginComponent,
    SelectPriorityComponent,
    SelectDemographicComponent,
    SelectHostComponent,
    LicenseComponent
  ],
  providers: [LabService, DashboardService, NotificationService],
  entryComponents: [
    TatWidgetComponent,
    ModalChangeWidgetTypeComponent,
    ModalCsSetupComponent,
    ModalAddDashboardComponent,
    ModalResetDashboardComponent,
    ModalAboutComponent,
    ModalSwSetupComponent,
    ModalTemplateDashboardComponent,
    LayoutWidgetComponent,
    ConnectionStatusHostComponent,
    ConnectionStatusWidgetComponent,
    WidgetConfigurationComponent,
    TatBrowseTestComponent,
    LstWidgetComponent,
    SampleWorkloadWidgetComponent
  ],
  exports: [LayoutComponent]
})
export class ComponentsModule {}
