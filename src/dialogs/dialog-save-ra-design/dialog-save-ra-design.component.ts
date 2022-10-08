import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { appIcons } from 'src/utils';
import { ElementComponent, RADesign } from '../../models/app.model';

export interface FormCreateRAElemet {
  name: string;
  type: string;
  color: string;
  fill: string | null;
  icon: string | null;
}

@Component({
  selector: 'app-dialog-save-ra-design',
  templateUrl: './dialog-save-ra-design.component.html',
  styleUrls: ['./dialog-save-ra-design.component.scss'],
})
export class DialogSaveRADesign implements OnInit {
  formData: FormGroup | undefined;
  selectedElement: RADesign;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    public dialogRef: MatDialogRef<DialogSaveRADesign>,
    private fb: FormBuilder
  ) {
    this.selectedElement = this.dataDialog?.element;
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      description: [this.selectedElement.description, [Validators.required]],
    });
  }

  onSave() {
    let data: FormCreateRAElemet = (this.formData as FormGroup).value;
    this.dialogRef.close({...this.selectedElement,...data});
  }
}
