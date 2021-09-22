import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryMgmtComponent } from './country-mgmt/country-mgmt.component';
import { StateMgmtComponent } from './state-mgmt/state-mgmt.component';
import { CityMgmtComponent } from './city-mgmt/city-mgmt.component';
import { ServiceMgmtComponent } from './service-mgmt/service-mgmt.component';
import { CustomerMgmtComponent } from './customer-mgmt/customer-mgmt.component';
import { MasterDataRoutingModule } from './master-data-routing.module';
import { AddCountryComponent } from './country-mgmt/add-country/add-country.component';
import { AddStateComponent } from './country-mgmt/add-state/add-state.component';
import { UiModule } from '../../shared/ui/ui.module';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-bootstrap-spinner';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceSequenceMngtComponent } from './invoice-sequence-mngt/invoice-sequence-mngt.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [CountryMgmtComponent, StateMgmtComponent,
     CityMgmtComponent, ServiceMgmtComponent,
     CustomerMgmtComponent, AddCountryComponent, AddStateComponent, InvoiceSequenceMngtComponent],
  imports: [
    CommonModule,
    MasterDataRoutingModule,
    UiModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgbDatepickerModule,
    NgxDatatableModule
  ]
})
export class MasterDataMgmtModule { }
