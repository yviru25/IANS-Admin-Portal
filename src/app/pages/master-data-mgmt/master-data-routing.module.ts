import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryMgmtComponent } from './country-mgmt/country-mgmt.component';
import { StateMgmtComponent } from './state-mgmt/state-mgmt.component';
import { CityMgmtComponent } from './city-mgmt/city-mgmt.component';

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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MasterDataRoutingModule { }
