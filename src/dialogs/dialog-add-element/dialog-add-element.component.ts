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
import { ElementComponent } from '../../models/app.model';

export interface FormCreateRAElemet {
  name: string;
  type: string;
  color: string;
  fill: string | null;
}

@Component({
  selector: 'app-dialog-add-element',
  templateUrl: './dialog-add-element.component.html',
  styleUrls: ['./dialog-add-element.component.scss'],
})
export class DialogAddElementComponent implements OnInit {
  formElement: FormGroup | any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    public dialogRef: MatDialogRef<DialogAddElementComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.dataDialog?.isEdition) {
    } else {
      this.formElement = this.fb.group({
        name: ['Element', [Validators.required]],
        fill: ['#fff9c4', [Validators.required]],
        color: ['#000', [Validators.required]],
        type: [
          this.formatType('Element'),
          [Validators.required, this.uniqueTypeElementValidator()],
        ],
      });
    }
  }

  formatType(str: string | null) {
    if (!str) return str;
    return str
      .trim()
      .split(' ')
      .map((e) => e.toUpperCase())
      .join('_');
  }

  onChangeType(e: any) {
    this.formElement.get('type').setValue(this.formatType(e.target.value));
  }

  uniqueTypeElementValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      if (
        this.dataDialog.allElements.find(
          (e: ElementComponent) => e.type === this.formatType(value)
        )
      ) {
        return { uniqueLabel: true };
      }
      return null;
    };
  }

  onSave() {
    let data: FormCreateRAElemet = (this.formElement as FormGroup).value;
    this.dialogRef.close(data);
  }
}
