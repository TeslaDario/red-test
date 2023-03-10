import { getTestBed, TestBed } from '@angular/core/testing';
import { FhirSearchFn } from '@red-probeaufgabe/types';
import { SearchFacadeService } from './search-facade.service';
import { HttpTestingController } from '@angular/common/http/testing';

/**
 * Optionale Zusatzaufgabe
 */
describe('SearchFacadeService', () => {
  let service: SearchFacadeService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [],
    });

    service = TestBed.inject(SearchFacadeService);
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
  });
  /* eslint-disable no-empty, @typescript-eslint/no-empty-function */
  test('should init', () => {});

  test('should find patients', () => {
    let result;
    service.searchPatients('').subscribe((value) => (result = value));
    expect(result).toBeCalled();

    // spy on request to ensure its called
    const req = httpMock.expectOne(
      `https://wildfhir4.aegis.net/fhir4-0-1/Patient?_format=application/fhir+json&_count=50&name=`,
    );
    expect(req.request.method).toBe('GET');

    // maybe check length of table or check that every patient is with the resourceType of patient
  });

  test('should find practitioners', () => {
    let result;
    service.searchPractitioners('').subscribe((value) => (result = value));
    expect(result).toBeCalled();
    // spy on request to ensure its called
    // maybe check length of table or check that every practitioners is with the resourceType of practitioner
  });

  test('should find both', () => {
    let result;
    service.search(FhirSearchFn.SearchAll, '').subscribe((value) => (result = value));
    expect(result).toBeCalled();

    // spy on request to ensure both practitioners and patients requests are made
  });

  test('merge arrays', () => {});
});
