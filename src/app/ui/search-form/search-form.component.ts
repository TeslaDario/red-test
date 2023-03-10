import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FhirSearchFn, ISearchFormData } from '@red-probeaufgabe/types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnDestroy {
  @Output() searchHandler = new EventEmitter<ISearchFormData>();

  readonly filterOptions: FhirSearchFn[] = [
    FhirSearchFn.SearchAll,
    FhirSearchFn.SearchPatients,
    FhirSearchFn.SearchPractitioners,
  ];
  searchForm = new FormGroup({
    search: new FormControl(''),
    filter: new FormControl(FhirSearchFn.SearchAll),
  });

  get f() {
    return this.searchForm.controls;
  }

  private _destroyed$ = new Subject<void>();

  constructor() {
    this.f.search.valueChanges.pipe(takeUntil(this._destroyed$)).subscribe((e) => this.onSearchChange(e));
    this.f.filter.valueChanges.pipe(takeUntil(this._destroyed$)).subscribe((e) => this.onFilterChange(e));
  }

  private onSearchChange(event) {
    console.log('onSearchChange', event);
    //validate search valuer value
    this.submit();
  }

  private onFilterChange(event) {
    console.log('onFilterChange', event);
    // validate filter value or use 'submit' directly in filter subsription as there is no need to validation.
    this.submit();
  }

  private submit() {
    this.searchHandler.emit({
      searchText: this.f.search.value.trim(),
      searchFuncSelect: this.f.filter.value,
    });
  }

  // onSubmit() {
  //   if (this.searchForm.valid) {
  //     console.log('submit', this.searchForm);
  //     this.searchHandler.emit({
  //       search: this.f.search.value,
  //       filter: this.f.filter.value,
  //     });
  //   }
  // }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
