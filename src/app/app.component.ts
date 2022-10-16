import { Component, OnInit } from '@angular/core';
import { AppStateService } from 'src/services/app-state.service';
const data = require('../data/app-initial-data.json');
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'demo-model-arch-basic-angular';
  constructor(private appService: AppStateService) {}
  ngOnInit(): void {
    this.initApp();
  }

  initApp() {
    try {
      let listRA = localStorage.getItem('listRA');
      let listSA = localStorage.getItem('listSA');
      if (!listRA || listRA == '[]' || !listRA.length) {
        localStorage.setItem('listRA', JSON.stringify(data['listRA']));
        this.appService.listRA = data['listRA'] as any;
        console.log('Uploaded the standar RA');
      }
      if (!listSA || listSA == '[]' || !listSA.length) {
        localStorage.setItem('listSA', JSON.stringify(data['listSA']));
        this.appService.listSA = data['listSA'] as any;
        console.log('Uploaded the standar SA');
      }
      if (localStorage.getItem('3abd453')) return;
      localStorage.setItem('3abd453', JSON.stringify(data['3abd453']));
    } catch (e) {
      console.log(
        '*******************ERROR IN THE INITIALIZATION************************'
      );
      console.log(e);
    }
  }
}
