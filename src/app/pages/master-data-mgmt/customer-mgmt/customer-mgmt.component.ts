import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SortEvent, AdvancedSortableDirective } from './table-config/advanced-sortable.directive';
import { AdvancedService } from './table-config/advanced.service';
import { Observable } from 'rxjs';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormGroupName, FormArray } from '@angular/forms';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ApiService } from 'src/app/shared/services/api.services';
import Swal from 'sweetalert2';
import { CustomerModel } from './table-config/customer.model';
import { DecimalPipe } from '@angular/common';
import { NgbDate, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, scan, startWith, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/shared/dateAdapter/datePicker.adapter';



@Component({
  selector: 'app-customer-mgmt',
  templateUrl: './customer-mgmt.component.html',
  styleUrls: ['./customer-mgmt.component.scss'],
  providers: [AdvancedService, DecimalPipe,
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}]
})
export class CustomerMgmtComponent implements OnInit {

 
  breadCrumbItems: Array<{}>;
  tableData: CustomerModel[];
  tables$: Observable<CustomerModel[]>;
  total$: Observable<number>;
  addCustomerForm: FormGroup;
  updateCustomerForm: FormGroup;
  createInvoiceForm: FormGroup;

  submit: boolean;
  formsubmit: boolean;
  typesubmit: boolean;
  rangesubmit: boolean;

  totalAmount = 0;
  totalCGSTAmount = 0;
  totalSGSTAmount = 0;
  totalIGSTAmount = 0;

  serviceStartdate: string;
  serviceEnddate: string;

  subscriptionList = [
    {
      value: '1 Month',
      displayName: '1 Month'
  },
  {
      value: '2 Month',
      displayName: '2 Month'
  },
  {
      value: '3 Month',
      displayName: '3 Month'
  },
  {
      value: '4 Month',
      displayName: '4 Month'
  },
  {
      value: '5 Month',
      displayName: '5 Month'
  },
  {
      value: '6 Month',
      displayName: '6 Month'
  },
  {
      value: '7 Month',
      displayName: '7 Month'
  },
  {
      value: '8 Month',
      displayName: '8 Month'
  },
  {
      value: '9 Month',
      displayName: '9 Month'
  },
  {
      value: '10 Month',
      displayName: '10 Month'
  },
  {
      value: '11 Month',
      displayName: '11 Month'
  },
  {
      value: '12 Month',
      displayName: '12 Month'
  }
  ]

  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

  constructor(public service: AdvancedService, private modalService: NgbModal,
              public formBuilder: FormBuilder, private spiner: NgxSpinnerService,
              private apiService: ApiService, private ngbCalendar: NgbCalendar, 
              private dateAdapter: NgbDateAdapter<string>) {
    
                // this.iansServicesArray.valueChanges.subscribe(console.log);
   }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'Quick Service', active: true }];
    this.getCustomerList();


    this.addCustomerForm = this.formBuilder.group({
      customerName: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      primaryContactEmail: ['', [Validators.required]],
      primaryContactMobileno: ['', [Validators.required]],
      headOfficePhoneNo: ['', [Validators.required]],
      headOfficeEmailId: ['', [Validators.required]],
      headOfficeAddress: ['', [Validators.required]],
      companyPhoneNo: ['', [Validators.required]],
      companyEmailId: ['', [Validators.required]],
      companyAddress: ['', [Validators.required]],
      gstNo: ['', [Validators.required]],
      isActive: ['Y', [Validators.required]],
      subscriptionValue: ['', [Validators.required]],
      IansSubscription: this.formBuilder.group({
        subscriptionValue: 1,
        displayName: '1 Month'
      })
    });

    this.submit = false;
    this.formsubmit = false;
    this.typesubmit = false;
    this.rangesubmit = false;

    
  }

  getCustomerList() {
    this.spiner.show();
    this.apiService.sendGetRequest('iansCustomers').subscribe( (res) => {
      this.spiner.hide();
      this.tableData = res._embedded.iansCustomers;    
         
    });
  }


  onSort({ column, direction }: SortEvent): void {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  openAddCustomerModel(centerDataModal: any) {
    this.modalService.open(centerDataModal, { size: 'xl'});
  }

  addCustomer(): void {
    const subsIans = this.addCustomerForm.get('IansSubscription') as FormGroup;
    subsIans.get('subscriptionValue').setValue(this.addCustomerForm.get('subscriptionValue').value);
    subsIans.get('displayName').setValue(this.addCustomerForm.get('subscriptionValue').value);
    console.log(subsIans);
    console.log(this.addCustomerForm.value);
     this.spiner.show();
     this.apiService.sendPostFormRequest('iansCustomers', this.addCustomerForm.value).subscribe((res) => {
          this.spiner.hide();
          Swal.fire(
            'Added!',
            'Customer has been added.',
            'success'
          ).then( okay => {
            if (okay) { 
              window.location.reload();
            }
        });

     })
  }
  get CustomerFormControls() {
    return this.addCustomerForm.controls;
  }

  get updateCustomerControls() {
    return this.updateCustomerForm.controls;
  }

  editCustomerPopupForm(tabelDataModel: CustomerModel, editCustomercenterDataModal: any) {
      this.modalService.open(editCustomercenterDataModal, { centered: true, size: 'xl' });
      this.updateCustomerForm = this.formBuilder.group({
        customerId: tabelDataModel.customerId,
        companyName: [tabelDataModel.companyName, [Validators.required]],
        description: [tabelDataModel.description, [Validators.required]],
        primaryContactEmail: [tabelDataModel.primaryContactEmail, [Validators.required]],
        primaryContactMobileno: [tabelDataModel.primaryContactMobileno, [Validators.required]],
        gstNo: [tabelDataModel.gstNo, [Validators.required]],
        headOfficePhoneNo: [tabelDataModel.headOfficePhoneNo, [Validators.required]],
        headOfficeEmailId: [tabelDataModel.headOfficeEmailId, [Validators.required]],
        headOfficeAddress: [tabelDataModel.headOfficeAddress, [Validators.required]],
        companyPhoneNo: [tabelDataModel.companyPhoneNo, [Validators.required]],
        customerName: [tabelDataModel.customerName, [Validators.required]],
        companyEmailId: [tabelDataModel.companyEmailId, [Validators.required]],
        companyAddress: [tabelDataModel.companyAddress, [Validators.required]],
        isActive: [tabelDataModel.isActive, [Validators.required]],
      });
  }

  submitUpdateCustomerForm() {
   
    console.log(this.updateCustomerForm.value);
    this.spiner.show();
     this.apiService.sendPostFormRequest('iansCustomers', this.updateCustomerForm.value).subscribe((res) => {
          this.spiner.hide();
          Swal.fire(
            'Updated!',
            'Customer has been Updated.',
            'success'
          ).then( okay => {
            if (okay) {
              window.location.reload();
            }
        });

     })
  }

  deleteCustomer(tabelDataModel: CustomerModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete Customer Data',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.spiner.show();
        this.apiService.sendDeleteRequest('iansCustomers/' + tabelDataModel.customerId)
            .subscribe( res => {
                this.spiner.hide();
                Swal.fire(
                  'Deleted!',
                  'Customer has been removed successfully.',
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


  /*   ======================== Create Invoice Functionality ======================================== */

  get createInvoiceFormControls() {
    return this.createInvoiceForm.controls;
  }

  get iansServicesArray() {
    return this.createInvoiceForm.get('iansServices') as FormArray
  }

  createInvoicePopupModel(tableModel: CustomerModel, CreatInvoicecenterDataModal: any) {
    this.modalService.open(CreatInvoicecenterDataModal, { size: 'xl', scrollable: true, });
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
                 customerId: tableModel.customerId,
                 serviceId: [res._embedded.iansServices[index].serviceId, [Validators.required]],
                 serviceName: [res._embedded.iansServices[index].serviceName, [Validators.required]],
                 serviceDescription: [res._embedded.iansServices[index].serviceDescription, [Validators.required]],
                 sacCode: [res._embedded.iansServices[index].sacCode, [Validators.required]],
                 totalAmount: ['', [Validators.required]],
                 totalCGSTAmount: ['', [Validators.required]],
                 totalSGSTAmount: ['', [Validators.required]],
                 totalIGSTAmount: ['', [Validators.required]],
                 subscriptionDate: ['', [Validators.required]],
                 serviceStartDate: ['', [Validators.required]],
                 serviceEndDate: ['', [Validators.required]],
                 createdBy: 'Portal'
              }))
            
          } 
          
          const frService = this.createInvoiceForm.get('iansServices') as FormArray;
          console.log(frService.value);
         // this.totalAmountCalCulation(frService.value);
      
    });

  }

  submitCreateInvoiceForm() {

    if(this.createInvoiceForm.value.iansServices.length <= 1) {
      this.createInvoiceForm.value.iansServices.forEach(element => {
        
        element['companyName'] = this.createInvoiceForm.get("companyName").value;
        element['headOfficeAddress'] =  this.createInvoiceForm.get("headOfficeAddress").value;
        element['gstNo']  =  "7478";
        

     this.spiner.show();
     this.apiService.sendPostFormRequest('createInvoice', element).subscribe((res) => {
          this.spiner.hide();
          const invoiceId = res;
          console.log(invoiceId);
          element['invoiceNo'] = invoiceId
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
                  this.apiService.downloadPost('downloadInvoice', element)
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


      });
    } else {
      Swal.fire({
        title: 'Alert?',
        text: 'Service can not be submitted more than one',
        icon: 'warning',
        cancelButtonText: 'Ok'
      })
    }

   

   

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
