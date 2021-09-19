import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';
import { ApiService } from 'src/app/shared/services/api.services';
import Swal from 'sweetalert2';
import { CustomerModel } from '../master-data-mgmt/customer-mgmt/table-config/customer.model';

@Component({
  selector: 'app-expired-customer',
  templateUrl: './expired-customer.component.html',
  styleUrls: ['./expired-customer.component.scss']
})
export class ExpiredCustomerComponent implements OnInit {
  rows = [];
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  breadCrumbItems: Array<{}>;
  expanded: any = {};
  totalAmount = 0;
  totalCGSTAmount = 0;
  totalSGSTAmount = 0;
  totalIGSTAmount = 0;
  rangesubmit: boolean;

  @ViewChild('renewCustomerTable') renewCustomerTable: any;
  createInvoiceForm: FormGroup;
  
  constructor(private spiner: NgxSpinnerService,
    private apiService: ApiService,  public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getRenewInvoices();
  }


  update(rowData: any) {
    console.log(rowData);
  }

  
getRenewInvoices() {
  this.spiner.show();
  this.apiService.sendGetRequest('getRenewInvoices').subscribe( (res) => {
    this.spiner.hide();
    this.rows = res; 
    console.log(this.rows);   
  });
}

onRenewCustomers() {
  console.log(this.selected.length);
  if(this.selected.length >= 1) {

     const jsonData = {
       renewServices: []
     }

    this.selected.forEach(el => {
      
        jsonData.renewServices.push({
          invoiceId:el.invoiceId,
          customerName:el.iansCustomer.customerName,
          customerId:el.iansCustomer.customerId,
          createdBy: 'Portal',
          totalAmount:el.totalAmount,
          totalCGSTAmount:el.cgstAmount,
          totalSGSTAmount:el.sgstAmount,
          totalIGSTAmount:el.igstAmount,
          subscriptionDate:el.subscriptionDate,
          serviceStartDate:el.serviceStartDate,
          serviceEndDate:el.serviceEndDate,
          serviceId:el.iansServiceId,
          subscriptionValue:el.iansCustomer.iansSubscription.subscriptionValue,
          serviceDescription: el.serviceDescription
        });
    })
    console.log(jsonData);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to Renewed Customer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Sure.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.spiner.show();
        this.apiService.sendPostFormRequest('doRenewInvoice', jsonData)
            .subscribe( res => {
                this.spiner.hide();
                Swal.fire(
                  'Renewed!',
                  'Customer has been Renewed successfully.',
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
  else {
    Swal.fire({
      title: 'Alert?',
      text: 'Please Select at least one row',
      icon: 'warning',
      cancelButtonText: 'Ok'
    })
  }

  
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
  this.createInvoicePopupModel(event.value.iansCustomer,null);
  console.log('Detail Toggled', event);
}

toggleExpandRow(row) {
  console.log('Toggled Expand Row!', row);
  this.renewCustomerTable.rowDetail.toggleExpandRow(row);
}




get createInvoiceFormControls() {
  return this.createInvoiceForm.controls;
}

get iansServicesArray() {
  return this.createInvoiceForm.get('iansServices') as FormArray
}

createInvoicePopupModel(tableModel: CustomerModel, CreatInvoicecenterDataModal: any) {
  // this.modalService.open(CreatInvoicecenterDataModal, { size: 'xl', scrollable: true, });
  this.createInvoiceForm = this.formBuilder.group({
      customerId: tableModel.customerId,
      companyName: [tableModel.companyName, [Validators.required]],
      description: [tableModel.description, [Validators.required]],
      companyPhoneNo: [tableModel.companyPhoneNo, [Validators.required]],
      customerName: [tableModel.customerName, [Validators.required]],
      companyEmailId: [tableModel.companyEmailId, [Validators.required]],
      companyAddress: [tableModel.companyAddress, [Validators.required]],
      headOfficePhoneNo: [tableModel.headOfficePhoneNo, [Validators.required]],
      headOfficeEmailId: [tableModel.headOfficeEmailId, [Validators.required]],
      headOfficeAddress: [tableModel.headOfficeAddress, [Validators.required]],
      createdBy: 'Portal',
      totalAmount: ['', [Validators.required]],
      totalCGSTAmount: ['', [Validators.required]],
      totalSGSTAmount: ['', [Validators.required]],
      totalIGSTAmount: ['', [Validators.required]],
      subscriptionDate: ['', [Validators.required]],
      iansServices: this.formBuilder.array([])

  });

  this.spiner.show();
  this.apiService.sendGetRequest('iansServices').subscribe( (res) => {
        this.spiner.hide();
        const invoiceServiceArray = this.createInvoiceForm.get('iansServices') as FormArray;
        for (let index = 0; index < res._embedded.iansServices.length; index++) {
            invoiceServiceArray.push(this.formBuilder.group({
               serviceId: [res._embedded.iansServices[index].serviceId, [Validators.required]],
               serviceName: [res._embedded.iansServices[index].serviceName, [Validators.required]],
               serviceDescription: [res._embedded.iansServices[index].serviceDescription, [Validators.required]],
               sacCode: [res._embedded.iansServices[index].sacCode, [Validators.required]]
             /*   serviceAmount: [res._embedded.iansServices[index].defaultPrice, [Validators.required]],
               serviceDescription: [res._embedded.iansServices[index].serviceDescription, [Validators.required]],
               cgstAmount: ['', [Validators.required]],
               sgstAmount: ['', [Validators.required]],
               igstAmount: ['', [Validators.required]],
               serviceStartDate: ['', [Validators.required]],
               serviceEndDate: ['', [Validators.required]], */
            }))
          
        } 
        
        const frService = this.createInvoiceForm.get('iansServices') as FormArray;
        console.log(frService.value);
        this.totalAmountCalCulation(frService.value);
    
  });

}

submitCreateInvoiceForm() {
  console.log(this.createInvoiceForm.value);
  this.spiner.show();
   this.apiService.sendPostFormRequest('createInvoice', this.createInvoiceForm.value).subscribe((res) => {
        this.spiner.hide();
        const invoiceId = res;
        console.log(invoiceId);
        Swal.fire(
          'Created!',
          'Invoice has been Created.',
          'success'
        ).then( okay => {
          if (okay) {
            
            Swal.fire({
              title: 'Download Invoice',
              text: 'You want to download Invoice',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'download Invoice',
              cancelButtonText: 'No'
            }).then((result) => {
              if (result.value) {
                this.spiner.show();
                this.apiService.download('downloadInvoice/' + invoiceId)
                    .subscribe( blob => {
                        const a = document.createElement('a')
                        const objectUrl = URL.createObjectURL(blob)
                        a.href = objectUrl
                        a.download = 'Invoice_'+invoiceId+ new Date()+'.pdf';
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
              } else {
                 window.location.reload();
              }
            });

          }
      });

   })

}



deleteServiceGroup(index) {
  console.log(index);
  Swal.fire({
    title: 'Are you sure?',
    text: 'Want to delete Service ',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete.',
    cancelButtonText: 'No, let me think'
  }).then((result) => {
    if (result.value) {
      const serviceArray = this.createInvoiceForm.get('iansServices') as FormArray
      serviceArray.removeAt(index);
      console.log(serviceArray.value);
      this.totalAmountCalCulation(serviceArray.value);
    }
  });
  
}

totalAmountCalCulation(arrayElement: any) {
  // console.log(arrayElement);
  this.totalAmount = 0;
  const serviceArray = this.createInvoiceForm.get('iansServices') as FormArray;
  for (let index = 0; index < serviceArray.value.length; index++) {
    this.totalAmount += Number(serviceArray.value[index].serviceAmount);
    this.createInvoiceForm.get('totalAmount').setValue(this.totalAmount);
  }
}

totalCGSTAmountCalCulation(arrayElement: any) {
  // console.log(arrayElement);
  this.totalCGSTAmount = 0;
  const serviceArray = this.createInvoiceForm.get('iansServices') as FormArray;
  for (let index = 0; index < serviceArray.value.length; index++) {
    this.totalCGSTAmount += Number(serviceArray.value[index].cgstAmount);
    this.createInvoiceForm.get('totalCGSTAmount').setValue(this.totalCGSTAmount);
  }
}
totalSGSTAmountCalCulation(arrayElement: any) {
  // console.log(arrayElement);
  this.totalSGSTAmount = 0;
  const serviceArray = this.createInvoiceForm.get('iansServices') as FormArray;
  for (let index = 0; index < serviceArray.value.length; index++) {
    this.totalSGSTAmount += Number(serviceArray.value[index].sgstAmount);
    this.createInvoiceForm.get('totalSGSTAmount').setValue(this.totalSGSTAmount);
  }
}
totalIGSTAmountCalCulation(arrayElement: any) {
  // console.log(arrayElement);
  this.totalIGSTAmount = 0;
  const serviceArray = this.createInvoiceForm.get('iansServices') as FormArray;
  for (let index = 0; index < serviceArray.value.length; index++) {
    this.totalIGSTAmount += Number(serviceArray.value[index].igstAmount);
    this.createInvoiceForm.get('totalIGSTAmount').setValue(this.totalIGSTAmount);
  }
}


  

}
