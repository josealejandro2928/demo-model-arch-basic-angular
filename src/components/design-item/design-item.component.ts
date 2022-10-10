import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from 'src/services/app-state.service';
import { RADesign, SADesign } from 'src/models/app.model';

@Component({
  selector: 'app-design-item',
  templateUrl: './design-item.component.html',
  styleUrls: ['./design-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignItemComponent implements OnInit {
  design: RADesign | SADesign | undefined;
  @Output() deleteEvent = new EventEmitter();

  @Input() set _design(value: RADesign | SADesign | undefined) {
    this.design = value;
  }

  constructor(
    public appStateService: AppStateService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  seeDetails(e: any, design?: RADesign | SADesign) {
    e.stopPropagation();
    if (!design) return;
    if ('parentRADesign' in design) {
      this.appStateService.setCurrentSADesign(design);
      this.router.navigate(['create-sa']);
    } else {
      this.appStateService.setCurrentRADesign(design);
      this.router.navigate(['create-ra']);
    }
  }
  onDelete(e: any, design?: RADesign | SADesign) {
    e.stopPropagation();
    this.deleteEvent.next(design);
  }
}
