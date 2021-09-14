import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

/**
 * Dashboard Component
 */
export class DashboardComponent implements OnInit {

  quickService = [];
  breadCrumbItems: Array<{}>;
  constructor(private route: Router) {
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'Quick Service', active: true }];
    this.quickService = [
      {
        iconClassName: 'fas fa-globe',
        serviceName: 'Country Managment',
        serviceType: 'Master Data Managment',
        cardColor: 'card gradient-scooter',
        routPath: '/master-data/country/management'
      },
      {
        iconClassName: 'fas fa-language',
        serviceName: 'State Managment',
        serviceType: 'Master Data Managment',
        cardColor: 'card gradient-bloody',
        routPath: '/master-data/state/management'
      },
      {
        iconClassName: 'fas fa-building',
        serviceName: 'City Managment',
        serviceType: 'Master Data Managment',
        cardColor: 'card gradient-quepal',
        routPath: '/master-data/city/management'
      },
      {
        iconClassName: 'fas fa-cogs',
        serviceName: 'Service Managment',
        serviceType: 'Master Data Managment',
        cardColor: 'card gradient-blooker',
        routPath: '/master-data/service/management'
      },
      {
        iconClassName: 'fas fa-users',
        serviceName: 'Customer Managment',
        serviceType: 'Master Data Managment',
        cardColor: 'card gradient-purpink',
        routPath: '/master-data/customer/management'
      },
      {
        iconClassName: 'fas fa-clone',
        serviceName: 'Invoice Managment',
        serviceType: 'Invoice Managment',
        cardColor: 'card gradient-sylvia',
        routPath: ''
      },
      {
        iconClassName: 'fas fa-chart-bar',
        serviceName: 'Report Managment',
        serviceType: 'Report Managment',
        cardColor: 'card gradient-jshine',
        routPath: ''
      },
      {
        iconClassName: 'fas fa-bell',
        serviceName: 'Notification',
        serviceType: 'Notification Managment',
        cardColor: 'card gradient-danger',
        routPath: ''
      },
      {
        iconClassName: 'fas fa-list-ol',
        serviceName: 'Expired Customer',
        serviceType: '15 days Expired Customer',
        cardColor: 'card gradient-lovekiss',
        routPath: ''
      }
    ];
  }

  routeLink(routName: string) {
    this.route.navigate([routName])
  }

}
