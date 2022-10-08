import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppStateService } from 'src/app-state.service';
import { delay_ms } from 'src/utils';
import { RADesign } from '../../models/app.model';
import { SelectRaDesign } from '../../dialogs/select-ra-design/select-ra-design.component';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-sa-arch',
  templateUrl: './create-sa-arch.component.html',
  styleUrls: ['./create-sa-arch.component.scss'],
})
export class CreateSaArchComponent implements OnInit {
  designName = 'Example SA';
  description = '';
  id = '';
  loading = true;
  currentSADesign: any;
  parentRADesign: RADesign | null = null;
  rootDesign: HTMLElement | null = null;
  constructor(
    private appStateService: AppStateService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.appStateService.createUniqueId();
    this.rootDesign = document.querySelector('#box-cont');
    this.init();
  }

  async init() {
    this.route.queryParams.subscribe(
      async (data: { modal?: boolean; raId?: string }) => {
        if (data.raId) {
          let allRa: Array<RADesign> = await firstValueFrom(
            this.appStateService.getAllRA()
          );
          this.parentRADesign = allRa.find(
            (e) => (e.id = data.raId as string)
          ) as any;
        }
        if (data.modal) {
          this.openModalSelectRA();
        }
      }
    );
    await delay_ms(1000);
    this.rootDesign = document.querySelector('#box-cont');
    this.currentSADesign = this.appStateService.getCurrentSADesign();
    if (!this.currentSADesign) {
      this.loading = false;
      return;
    }
    this.loading = false;
  }

  onClickRootDesign(e: any) {}

  onNameChanged(name: string) {
    this.designName = name;
  }

  onSelectRA() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        modal: true,
      },
      queryParamsHandling: 'merge',
    });
  }

  openModalSelectRA() {
    const dialogRef = this.dialog.open(SelectRaDesign, {
      maxHeight: '90vh',
      maxWidth: '100%',
      width: '20cm',
      data: this.parentRADesign,
    });
    dialogRef.afterClosed().subscribe((value: RADesign | undefined) => {
      if (!value) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
        });
        return;
      }

      this.parentRADesign = value;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
      });
    });
  }
}
