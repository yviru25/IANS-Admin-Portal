import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';
import { ApiService } from 'src/app/shared/services/api.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss']
})
export class InvoiceManagementComponent implements OnInit {

  rows = [];
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  breadCrumbItems: Array<{}>;
  expanded: any = {};

  constructor(private spiner: NgxSpinnerService,
    private apiService: ApiService,  public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getAllInvoices();
  }

  getAllInvoices() {
    this.spiner.show();
    this.apiService.sendGetRequest('getAllInvoices').subscribe( (res) => {
      this.spiner.hide();
      this.rows = res; 
      console.log(this.rows);   
    });
  }


  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
  
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  
  onActivate(event) {
    console.log('Activate Event', event);
  }
  
  add() {
    this.selected.push(this.rows[1], this.rows[3]);
    console.log(this.selected);
  }
  
  remove() {
    this.selected = [];
  }
  
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  
  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    // this.renewCustomerTable.rowDetail.toggleExpandRow(row);
  }


  deleteInvoice(rowDetails: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete Invoice',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.spiner.show();
        this.apiService.sendDeleteRequest('deleteInvoice/' + rowDetails.invoiceId)
            .subscribe( res => {
                this.spiner.hide();
                Swal.fire(
                  'Deleted!',
                  'Invoice has been removed successfully.',
                  'success'
                ).then( okay => {
                  if (okay) {
                    window.location.reload();
                  }
              });
        });
      }
    });
  }


  dowwnloadInvoice() {
    console.log(this.selected.length);
    if(this.selected.length >= 1) {
  
       const jsonData = {
        downloadInvoices: []
       }
  
      this.selected.forEach(el => {
        
          jsonData.downloadInvoices.push({
            invoiceId:el.invoiceId,
            customerName:el.iansCustomer.customerName,
            customerId:el.iansCustomer.customerId,
            companyName:el.iansCustomer.companyName,
            headOfficeAddress:el.iansCustomer.headOfficeAddress,
            gstNo:el.iansCustomer.gstNo,
            createdBy: 'Portal',
            invoiceNo:el.invoiceNo,
            totalAmount:el.totalAmount,
            totalCGSTAmount:el.cgstAmount,
            totalSGSTAmount:el.sgstAmount,
            totalIGSTAmount:el.igstAmount,
            subscriptionDate:el.subscriptionDate,
            serviceStartDate:el.serviceStartDate,
            serviceEndDate:el.serviceEndDate,
            serviceId:el.iansServiceId,
            subscriptionValue:'1',
            serviceDescription: el.serviceDescription
          });
      })
      console.log(jsonData);
      Swal.fire({
        title: 'Are you sure?',
        text: 'Want to download Invoice',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, download.',
        cancelButtonText: 'No, let me think'
      }).then((result) => {
     
          
        this.spiner.show();
        this.apiService.downloadPost('downloadInvoices', jsonData)
            .subscribe( blob => {
                const a = document.createElement('a')
                const objectUrl = URL.createObjectURL(blob)
                a.href = objectUrl
                a.download = 'Invoice_'+ new Date()+'.zip';
                a.click();
                URL.revokeObjectURL(objectUrl);
                this.spiner.hide();
                Swal.fire(
                  'Downloaded!',
                  'Invoice has been successfully downloaded.',
                  'success'
                ).then( okay => {
                  if (okay) {
                    window.location.reload();
                  }
              });
        });
          
      });
    }
    else {
      Swal.fire({
        title: 'Alert?',
        text: 'Please Select at least one row',
        icon: 'warning',
        cancelButtonText: 'Ok'
      })
    }
  
  }

}
