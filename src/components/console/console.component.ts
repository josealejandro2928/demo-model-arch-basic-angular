import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AppStateService } from 'src/app-state.service';
import { ConsoleItem } from 'src/models/app.model';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleComponent implements OnInit, OnDestroy {
  consoleList: Array<ConsoleItem> = [];
  __unsubscribeAll: Subject<any> = new Subject();
  constructor(public appService: AppStateService) {}

  ngOnInit(): void {
    this.appService.$consoleUpdate
      .pipe(takeUntil(this.__unsubscribeAll))
      .subscribe((_) => {
        document
          .querySelector('#console-bottom')
          ?.scrollIntoView({ behavior: 'smooth' });
      });
  }
  ngOnDestroy(): void {
    this.__unsubscribeAll.next(true);
    this.__unsubscribeAll.complete();
  }
}
