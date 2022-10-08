import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RADesign } from '../../models/app.model';
import { AppStateService } from 'src/app-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-ra-design',
  templateUrl: './select-ra-design.component.html',
  styleUrls: ['./select-ra-design.component.scss'],
})
export class SelectRaDesign implements OnInit {
  selectedElement: RADesign | undefined;
  selectionRADesign: Set<RADesign> = new Set<RADesign>();
  allRA: Array<RADesign> = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    public dialogRef: MatDialogRef<SelectRaDesign>,
    public appStateService: AppStateService,
    private router: Router
  ) {
    this.selectedElement = this.dataDialog;
    if (this.selectedElement) {
      this.selectionRADesign.add(this.selectedElement);
    }
  }

  ngOnInit(): void {
    this.appStateService.getAllRA().subscribe((data) => (this.allRA = data));
  }

  onSave() {
    this.dialogRef.close([...this.selectionRADesign][0]);
  }

  onToogleSelection(design: RADesign) {
    if (this.selectionRADesign.has(design)) {
      this.selectionRADesign.delete(design);
    } else {
      this.selectionRADesign.clear();
      this.selectionRADesign.add(design);
    }
  }
  seeDetails(e: any, design: RADesign) {
    e.stopPropagation();
    this.appStateService.setCurrentRADesign(design);
    this.router.navigate(['create-ra']);
    this.dialogRef.close();
  }
}
