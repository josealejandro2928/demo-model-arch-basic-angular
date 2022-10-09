import { Component, OnInit } from '@angular/core';
import { AppStateService } from 'src/app-state.service';
import { RADesign, SADesign } from '../../models/app.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-list-design',
  templateUrl: './list-design.component.html',
  styleUrls: ['./list-design.component.scss'],
})
export class ListDesignComponent implements OnInit {
  allRA: Array<RADesign> = [];
  allSA: Array<SADesign> = [];
  constructor(private appService: AppStateService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.allRA = await firstValueFrom(this.appService.getAllRA());
      this.allSA = await firstValueFrom(this.appService.getAllSA());
    } catch (e) {
      console.error(e);
    }
  }
}
