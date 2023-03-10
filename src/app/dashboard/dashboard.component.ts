import { Component } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { SiteTitleService } from '@red-probeaufgabe/core';
import {
  FhirSearchFn,
  IFhirPatient,
  IFhirPractitioner,
  IFhirSearchResponse,
  ISearchFormData,
} from '@red-probeaufgabe/types';
import { IUnicornTableColumn } from '@red-probeaufgabe/ui';
import { SearchFacadeService } from '@red-probeaufgabe/search';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Init unicorn columns to display
  columns: Set<IUnicornTableColumn> = new Set<IUnicornTableColumn>([
    'number',
    'resourceType',
    'name',
    'gender',
    'birthDate',
  ]);
  isLoading = true;
  searchFormData$ = new BehaviorSubject<ISearchFormData>({ searchText: '', searchFuncSelect: FhirSearchFn.SearchAll });

  /*
   * Implement search on keyword or fhirSearchFn change
   **/
  search$: Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> = this.searchFormData$.pipe(
    tap(() => (this.isLoading = true)),
    switchMap(({ searchText, searchFuncSelect }) =>
      this.searchFacade.search(searchFuncSelect, searchText).pipe(
        catchError(this.handleError),
        tap(() => {
          this.isLoading = false;
        }),
        shareReplay(),
      ),
    ),
  );

  entries$: Observable<Array<IFhirPatient | IFhirPractitioner>> = this.search$.pipe(
    map((data) => !!data && data.entry),
    startWith([]),
  );

  totalLength$ = this.search$.pipe(
    map((data) => !!data && data.total),
    startWith(0),
  );

  // AbstractSearchFacadeService is not a service, is a class of common methods which other classes or in this case a SearchFacadeService can use/extend
  // so the multiple dependenies (PatientSearchService and PractitionerSearchService) can use the same methods instead of declaring them double
  constructor(private siteTitleService: SiteTitleService, private searchFacade: SearchFacadeService) {
    this.siteTitleService.setSiteTitle('Dashboard');
  }

  onSearch(event: ISearchFormData): void {
    // I could probably use methods from searchFacade here
    this.searchFormData$.next(event);
  }

  private handleError(): Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> {
    return of({ entry: [], total: 0 });
  }
}
