import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/shared/dateAdapter/datePicker.adapter';
import { ApiService } from 'src/app/shared/services/api.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-sequence-mngt',
  templateUrl: './invoice-sequence-mngt.component.html',
  styleUrls: ['./invoice-sequence-mngt.component.scss']
})
export class InvoiceSequenceMngtComponent implements OnInit {

  rows = [];
  selected = [];
  allRowsSelected=  [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  breadCrumbItems: Array<{}>;
  expanded: any = {};
  createInvoiceSequenceForm: FormGroup;

  rangesubmit: boolean;
  
  constructor(private spiner: NgxSpinnerService,
    private apiService: ApiService, 
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private ngbCalendar: NgbCalendar, 
    private dateAdapter: NgbDateAdapter<string>) { 

      this.createInvoiceSequenceForm = this.formBuilder.group({
        sequenceStartValue: ['', [Validators.required]],
        sequenceEndValue: ['', [Validators.required]],
        sequencePrefix: ['', [Validators.required]],
        yearValue: [new Date().getFullYear().toString(), [Validators.required]],
        monthValue: [(new Date().getMonth() + 1).toString(), [Validators.required]],
        sequenceType: ['', [Validators.required]]
      });

    }

  ngOnInit(): void {
    this.getInvoiceSequences();
  }


  getInvoiceSequences() {
    this.spiner.show();
    this.apiService.sendGetRequest('iansInvoiceSequences').subscribe( (res) => {
      this.spiner.hide();
      this.rows = res._embedded.iansInvoiceSequences; 
      console.log(this.rows);   
    });
  }
 
  createInvoiceSeqPopupModel(createInvoiceSequencecenterDataModal) {
    this.modalService.open(createInvoiceSequencecenterDataModal, { centered: true } );
  }


  SubmitInvoiceSequenceForm() {
    console.log(JSON.stringify(this.createInvoiceSequenceForm.value));
    this.spiner.show();
    this.apiService.sendPostFormRequest('iansInvoiceSequences', this.createInvoiceSequenceForm.value).subscribe((res) => {
        this.spiner.hide();
        Swal.fire(
          'Created!',
          'Invoice Sequence has been Created.',
          'success'
        ).then( okay => {
          if (okay) {
             window.location.reload();
          }
        });
      })
  }
  
  get createInvoiceSequenceFormControls() {
    return this.createInvoiceSequenceForm.controls;
  }
  

}
