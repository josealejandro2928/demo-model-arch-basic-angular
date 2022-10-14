import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { appIcons } from 'src/utils';
import { SADesign, RADesign } from 'src/models/app.model';
import { ValidationService } from 'src/services/validation.service';
import { ISuggestionItem } from '../../components/suggestions/suggestions.component';

@Component({
  selector: 'app-dialog-save-ra-design',
  templateUrl: './dialog-save-ra-design.component.html',
  styleUrls: ['./dialog-save-ra-design.component.scss'],
})
export class DialogSaveRADesign implements OnInit {
  formData: FormGroup | undefined;
  selectedElement: RADesign | SADesign;
  isSADesign: boolean = false;
  raDesign: RADesign | undefined;
  saDesign: SADesign | undefined;
  suggestionErros: ISuggestionItem[] = [];
  onlyDescription = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    public dialogRef: MatDialogRef<DialogSaveRADesign>,
    private fb: FormBuilder,
    private validationService: ValidationService
  ) {
    this.selectedElement = this.dataDialog?.element;
    this.raDesign = this.dataDialog?.raDesign;
    this.saDesign = this.dataDialog?.saDesign;
    this.isSADesign = this.dataDialog?.isSADesign;
    this.onlyDescription = this.dataDialog?.onlyDescription;
  }

  ngOnInit(): void {
    this.suggestionErros = this.validationService
      .makeSuggestions(this.raDesign, this.saDesign)
      .filter((e) => e.severity == 'ERROR');
    console.log(this.suggestionErros);
    this.formData = this.fb.group({
      description: [this.selectedElement.description, [Validators.required]],
    });
  }

  onSave() {
    let data: any = (this.formData as FormGroup).value;
    this.dialogRef.close({ ...this.selectedElement, ...data });
  }
}
