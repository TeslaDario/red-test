import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FhirUtilService } from '@red-probeaufgabe/search';
import {
  IFhirPatient,
  IFhirPractitioner,
  IPreparedIFhirPatient,
  IPreparedIFhirPractitioner,
} from '@red-probeaufgabe/types';

@Component({
  selector: 'app-dialog-detail-row',
  templateUrl: './dialog-detail-row.component.html',
  styleUrls: ['./dialog-detail-row.component.scss'],
})
export class DialogDetailRowComponent {
  // could use here router and pass id then use the searchFacade to findById
  // but for now im keeping it simple and just passing data to material modal
  data: IPreparedIFhirPatient | IPreparedIFhirPractitioner;
  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: IFhirPatient | IFhirPractitioner,
    private fhirUtilService: FhirUtilService,
  ) {
    this.data = this.fhirUtilService.prepareData(_data);
    console.log(this.data);
  }
}
