import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  ConnectionComponent,
  ElementComponent,
  RADesign,
  SADesign,
} from 'src/models/app.model';
import { ValidationService } from 'src/services/validation.service';

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
export class SuggestionsComponent implements OnInit {
  raDesign: RADesign | undefined = undefined;
  saDesign: SADesign | undefined = undefined;
  suggestionRejected: Set<string> | undefined = new Set();
  @Output() onAutomaticSuggestionExce: EventEmitter<ISuggestionItem> =
    new EventEmitter();

  @Input() set _raDesign(value: RADesign | undefined) {
    this.raDesign = value;
    this.allSuggestion = this.validationService.makeSuggestions(
      this.raDesign,
      this.saDesign
    );
    this.cdRef.markForCheck();
  }
  @Input() set _saDesign(value: SADesign | undefined) {
    // console.log("Enter here: ",value);
    this.saDesign = value;
    this.allSuggestion = this.validationService.makeSuggestions(
      this.raDesign,
      this.saDesign
    );
    this.getInitialSUggestionRejected();
    this.cdRef.markForCheck();
  }
  allSuggestion: Array<ISuggestionItem> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {}

  getInitialSUggestionRejected() {
    let meta: any = localStorage.getItem(this.saDesign?.id as string);
    // console.log(meta);
    if (!meta) return;
    meta = JSON.parse(meta);
    this.suggestionRejected = new Set(meta?.suggestionRejected);
    // console.log(this.suggestionRejected);
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
