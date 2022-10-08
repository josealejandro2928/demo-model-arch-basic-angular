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
import { ElementComponent } from '../../models/app.model';

export interface FormCreateRAElemet {
  name: string;
  type: string;
  color: string;
  fill: string | null;
  icon: string | null;
}

@Component({
  selector: 'app-dialog-add-element',
  templateUrl: './dialog-add-element.component.html',
  styleUrls: ['./dialog-add-element.component.scss'],
})
export class DialogAddElementComponent implements OnInit {
  formElement: FormGroup | undefined;
  allIcons: { name: string; icon: string }[] = [];
  filteredIcons: { name: string; icon: string }[] = [];
  selectedElement: ElementComponent | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    public dialogRef: MatDialogRef<DialogAddElementComponent>,
    private fb: FormBuilder
  ) {
    this.selectedElement = this.dataDialog?.element;
  }

  ngOnInit(): void {
    this.allIcons = appIcons;
    if (this.dataDialog?.isEdition) {
      this.formElement = this.fb.group({
        name: [this.selectedElement?.name, [Validators.required]],
        fill: [
          this.selectedElement?.uxElement?.options?.color,
          [Validators.required],
        ],
        color: [
          this.selectedElement?.uxElement?.options?.fontColor,
          [Validators.required],
        ],
        type: [
          this.selectedElement?.type,
          [Validators.required, this.uniqueTypeElementValidator()],
        ],
        icon: [this.selectedElement?.uxElement?.options?.renderEL, []],
      });
    } else {
      this.formElement = this.fb.group({
        name: ['Element', [Validators.required]],
        fill: ['#fff9c4', [Validators.required]],
        color: ['#000', [Validators.required]],
        type: [
          this.formatType('Element'),
          [Validators.required, this.uniqueTypeElementValidator()],
        ],
        icon: [null, []],
      });
    }
    if (!this.selectedElement) {
      this.formElement?.get('name')?.valueChanges.subscribe((value) => {
        this.formElement?.get('type')?.setValue(this.formatType(value));
      });
    }
    this.filteredIcons = this.allIcons;
    this.formElement?.get('icon')?.valueChanges.subscribe((value) => {
      this.filteredIcons = this.allIcons.filter((icon) =>
        icon.name.includes((value || '').trim().toLowerCase())
      );
    });
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
    this.formElement?.get('type')?.setValue(this.formatType(e.target.value));
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
        ) &&
        this.formatType(value) !== this.selectedElement?.type
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
