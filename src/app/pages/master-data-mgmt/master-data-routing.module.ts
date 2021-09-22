import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryMgmtComponent } from './country-mgmt/country-mgmt.component';
import { StateMgmtComponent } from './state-mgmt/state-mgmt.component';
import { CityMgmtComponent } from './city-mgmt/city-mgmt.component';
import { CustomerMgmtComponent } from './customer-mgmt/customer-mgmt.component';
import { ServiceMgmtComponent } from './service-mgmt/service-mgmt.component';
import { InvoiceSequenceMngtComponent } from './invoice-sequence-mngt/invoice-sequence-mngt.component';

const routes: Routes = [
    {
        path: 'country/management',
        component: CountryMgmtComponent
    },
    {
        path: 'state/management',
        component: StateMgmtComponent
    },
    {
        path: 'city/management',
        component: CityMgmtComponent
    },
    {
        path: 'service/management',
        component: ServiceMgmtComponent
    },
    {
        path: 'customer/management',
        component: CustomerMgmtComponent
    },
    {
        path: 'customer/sequenceinvoice/management',
        component: InvoiceSequenceMngtComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MasterDataRoutingModule { }
