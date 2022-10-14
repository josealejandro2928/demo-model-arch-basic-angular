import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { RADesign, SADesign } from 'src/models/app.model';
import { ValidationService } from 'src/services/validation.service';
import { Subject, takeUntil } from 'rxjs';

export interface ISuggestionItem {
  action: 'CREATE' | 'DELETE' | 'CONNECT' | 'DISCONNECT';
  elementType: 'ElementComponent' | 'ConnectionComponent';
  message: string;
  objectsIds: string[];
  id: string;
  severity: 'ERROR' | 'WARNING';
}

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestionsComponent implements OnInit, OnDestroy {
  @Input() raDesign: RADesign | undefined = undefined;
  @Input() saDesign: SADesign | undefined = undefined;
  @Input() enabled = true;
  suggestionRejected: Set<string> | undefined = new Set();
  _unsubscribeAll = new Subject<any>();

  @Output() onAutomaticSuggestionExce: EventEmitter<ISuggestionItem> =
    new EventEmitter();

  allSuggestion: Array<ISuggestionItem> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {
    if (!this.enabled) return;
    this.validationService.$getNewValidations
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ raDesign, saDesign }) => {
        this.raDesign = raDesign;
        this.saDesign = saDesign;
        this.getInitialSuggestionRejected();
        // console.log(this.raDesign, this.saDesign);
        this.allSuggestion = this.validationService.makeSuggestions(
          this.raDesign,
          this.saDesign
        );
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  getInitialSuggestionRejected() {
    let meta: any = localStorage.getItem(this.saDesign?.id as string);
    if (!meta) return;
    meta = JSON.parse(meta);
    this.suggestionRejected = new Set(meta?.suggestionRejected);
  }

  onReject(e: any, item: ISuggestionItem) {
    e.stopPropagation();
    this.suggestionRejected?.add(item.id);
    let data = {
      suggestionRejected: [...(this.suggestionRejected || [])],
    };
    localStorage.setItem(this.saDesign?.id as string, JSON.stringify(data));
  }

  onRestore() {
    localStorage.setItem(this.saDesign?.id as string, '');
    this.suggestionRejected = new Set();
  }

  onClickSuggestion(item: ISuggestionItem) {
    this.onAutomaticSuggestionExce.next(item);
  }
}
